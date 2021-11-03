import { useRef, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import generateName from 'sillyname'
import socketIOClient from 'socket.io-client'
import randomColor from 'randomcolor'
import Tooltip from '@material-ui/core/Tooltip'
import { FaUserNinja } from 'react-icons/fa'
import { CgClose } from 'react-icons/cg'
import { SiAwesomelists } from 'react-icons/si'
import { BsArrowBarRight } from 'react-icons/bs'
import Loader from 'react-spinners/BarLoader'
import EmojiPicker from './EmojiPicker'
import Settings from './Settings'
import CONFIG from '../../../config.json'
import RoomSwitcher from './RoomSwitcher'

var socket

export default function ChatSection({ room = 'meka1', hideChat, setHideChat }) {
	const [user, _setUser] = useState({
		name: generateName(),
		color: randomColor({ luminosity: 'light' }),
	})
	const userRef = useRef(user)
	const [userList, setUserList] = useState([])
	const [roomList, setRoomList] = useState([])
	const [messages, setMessages] = useState([])
	const [message, setMessage] = useState('')
	const [chatConnection, setChatConnection] = useState(false)
	const [showUserList, setShowUserList] = useState(false)
	const windows = { settings: false, emojiPicker: false, roomSwitcher: false }
	const [showWindow, setShowWindow] = useState(windows)
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)
	const [showSettings, setShowSettings] = useState(false)
	const [showSwitcher, setShowSwitcher] = useState(false)
	const [searchText, setSearchText] = useState('')
	const messagesEndRef = useRef()
	const messageInputRef = useRef()

	const setUser = (user) => {
		userRef.current = user
		_setUser(user)
		saveUserToCache(user)
		return user
	}

	const toggleWindow = (window_name) => {
		setShowWindow({
			...windows,
			[window_name]: !showWindow[window_name],
		})
	}

	const getUserFromCache = () => JSON.parse(localStorage.getItem(room))

	const saveUserToCache = (user) => localStorage.setItem(room, JSON.stringify(user))

	useEffect(() => {
		const SOCKET = CONFIG.DEV_MODE ? CONFIG.DEV_SOCKET_HOST : CONFIG.SOCKET_HOST
		const URL = `${window.location.protocol}//${SOCKET}`
		socket = socketIOClient(URL)

		socket.on('connect', () => {
			const userData = {
				name: generateName(),
				color: randomColor({ luminosity: 'light' }),
				...getUserFromCache(),
			}

			//console.log(userData);

			//const localUser = { ...userRef.current, ...JSON.parse(localStorage.getItem('chat-user')) };
			socket.emit('new-user', { room: room, user: userData })
			setUser({ ...userData, id: socket.id, uuid: uuidv4() })
			// !! ## --> Burada bir bug olabilir oda değişince uuid ve id değişiyor buna sonra bak!

			//localUser.socketID = socket.id;
			//localUser.uuid = uuidv4();

			//localStorage.setItem('chat-user', JSON.stringify(localUser));
			//setUser(localUser);

			updateMessages({
				info: true,
				message: (
					<>
						Sohbete <b>{userData.name}</b> adıyla katıldın. <br /> <b>Kanal:</b> {room}
					</>
				),
			})
			setChatConnection(true)
		})

		socket.on('disconnect', () => {
			setChatConnection(false)
		})

		socket.on('initial-data', (data) => {
			setUserList([...data.userList, userRef.current])
			setChatConnection(true)
		})

		socket.on('room-list-update', (roomList) => {
			setRoomList(roomList)
			console.log('rooms', roomList)
		})

		socket.on('user-list-update', (user_list) => {
			setUserList(user_list)
			console.log(user_list)
		})

		socket.on('chat-message', (data) => {
			updateMessages(data)
		})

		socket.on('user-disconnected', (user) => {
			updateMessages({
				info: true,
				message: (
					<>
						<b>{user.name}</b> ayrıldı.
					</>
				),
			})
		})

		socket.on('user-connected', (user) => {
			updateMessages({
				info: true,
				message: (
					<>
						<b>{user.name}</b> sohbete geldi.
					</>
				),
			})
		})

		socket.on('user-updated', (user) => {
			if (user.old.name !== user.new.name)
				updateMessages({
					info: true,
					message: (
						<>
							<b>{user.old.name}</b> adını <b>{user.new.name}</b> olarak değiştirdi.
						</>
					),
				})
		})
	}, [room])

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const updateMessages = (data) => {
		setMessages((oldMessages) => [...oldMessages, data])
	}

	const sendMessage = (e) => {
		e.preventDefault()

		if (message.trim()) {
			updateMessages({
				type: 'msg',
				user: user,
				message: message,
				styles: { bold: true },
			})
			socket.emit('send-chat-message', message)
			setMessage('')
		}
	}

	const handleInput = (e) => {
		const { value } = e.target
		setMessage(value)
	}

	function scrollToBottom() {
		messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div className="chat-section">
			<div className="title">
				<Tooltip title="Sohbeti Gizle">
					<span onClick={() => setHideChat(!hideChat)}>
						<BsArrowBarRight size="24" color="#ffffff" />
					</span>
				</Tooltip>

				<span>YAYIN SOHBETİ</span>

				<Tooltip title="Sohbetteki kullanıcılar">
					<span onClick={() => setShowUserList(!showUserList)}>
						<FaUserNinja color="#e84545" /> {userList.length}
					</span>
				</Tooltip>
			</div>

			{chatConnection ? (
				<>
					{!showUserList ? (
						<div id="chat-container" className="chat">
							{messages.map((message, i) => {
								if (message.info)
									return (
										<div key={i} className="info">
											{message.message}
										</div>
									)
								else
									return (
										<div className="msg" key={i}>
											<span
												className="title"
												style={{ color: message.user.color, fontWeight: message.styles.bold && '600' }}
											>
												{message.user.name}
											</span>
											<span className="text">{message.message}</span>
										</div>
									)
							})}

							<div ref={messagesEndRef} />
						</div>
					) : (
						<div className="chat-users">
							<div className="users-title">
								<Tooltip title="MekaBois 🍻">
									<span>
										<SiAwesomelists size="22" />
									</span>
								</Tooltip>

								<span>SOHBETTEKİ KULLANICILAR</span>

								<Tooltip title="Kapat">
									<span onClick={() => setShowUserList(false)}>
										<CgClose size="22" />
									</span>
								</Tooltip>
							</div>

							<div className="users-search">
								<input
									onChange={(e) => setSearchText(e.target.value)}
									placeholder="Filtre"
									type="text"
									autoComplete="off"
								/>
							</div>

							<div className="users-list">
								{userList
									.filter((user) => user.name.toLowerCase().includes(searchText.toLowerCase()))
									.map((user, i) => (
										<div style={{ color: user.color }} key={i}>
											{user.name}
										</div>
									))}
							</div>

							<div ref={messagesEndRef} />
						</div>
					)}

					<div className="message-section">
						<form className="send-text" onSubmit={sendMessage}>
							<input
								ref={messageInputRef}
								value={message}
								onChange={handleInput}
								className="msg-input"
								placeholder={`${user.name} adıyla yazıyorsun`}
								maxLength="240"
								type="text"
								autoComplete="off"
								autoFocus
							/>
						</form>

						<EmojiPicker
							socket={socket}
							showEmojiPicker={showEmojiPicker}
							messageInputRef={messageInputRef}
							setMessage={setMessage}
							setShowSettings={setShowSettings}
							setShowEmojiPicker={setShowEmojiPicker}
							setShowSwitcher={setShowSwitcher}
						/>

						<RoomSwitcher
							user={user}
							socket={socket}
							roomName={room}
							roomList={roomList}
							showSwitcher={showSwitcher}
							setShowSwitcher={setShowSwitcher}
							setShowSettings={setShowSettings}
							setShowEmojiPicker={setShowEmojiPicker}
							updateMessages={updateMessages}
						/>

						<Settings
							user={user}
							socket={socket}
							room={room}
							showSettings={showSettings}
							setUser={setUser}
							setUserList={setUserList}
							setShowSettings={setShowSettings}
							setShowEmojiPicker={setShowEmojiPicker}
							setShowSwitcher={setShowSwitcher}
							updateMessages={updateMessages}
						/>
					</div>
				</>
			) : (
				<div className="chat-loading" ref={messagesEndRef}>
					<Loader color="#f31d41" />
					<div className="text">Sohbete bağlanılmaya çalışılıyor.</div>
				</div>
			)}
		</div>
	)
}
