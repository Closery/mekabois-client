import { useState } from 'react';
import { TwitterPicker } from 'react-color';
import { CgClose } from 'react-icons/cg';
import { MdSettings } from 'react-icons/md';
import Tooltip from '@material-ui/core/Tooltip';

export default function Settings(props) {
	const {
		socket,
		user,
		room,
		showSettings,
		setUser,
		setUserList,
		setShowSettings,
		setShowEmojiPicker,
		setShowSwitcher,
		updateMessages,
	} = props;

	const [showColorPicker, setShowColorPicker] = useState(false);
	const [settings, setSettings] = useState({
		user_name: user.name,
		user_color: user.color,
	});

	const saveSettings = () => {
		const updatedUser = { ...user };
		var emit = false;

		if (settings.user_name !== user.name) {
			updatedUser.name = settings.user_name;
			emit = true;

			updateMessages({
				info: true,
				message: (
					<>
						Adın <b>{updatedUser.name}</b> olarak değişti.
					</>
				),
			});
		}

		if (settings.user_color !== user.color) {
			updatedUser.color = settings.user_color;
			emit = true;

			updateMessages({ info: true, message: 'Kullanıcı renginiz değişti.' });
		}

		if (emit) {
			setUser(updatedUser);
			setUserList((oldList) => {
				let list = [...oldList];
				console.log(list);
				let i = list.findIndex((user) => user.uuid === updatedUser.uuid);
				list[i] = updatedUser;
				return list;
			});
			socket.emit('user-update', updatedUser);
		}

		setShowSettings(false);
	};

	const toggleSettings = () => {
		setShowSettings(!showSettings);
		setShowEmojiPicker(false);
		setShowSwitcher(false);
	};

	const toggleColorPicker = () => setShowColorPicker(!showColorPicker);

	const handleSettings = (e) => {
		const { name, value } = e.target;

		setSettings({
			...settings,
			[name]: value,
		});
	};

	const handleColorPicker = (pick) => {
		setSettings({
			...settings,
			user_color: pick.hex,
		});
	};

	return (
		<>
			{showSettings && (
				<div className="settings-wrapper">
					<div className="tab">
						<Tooltip title="Kapat">
							<span onClick={toggleSettings}>
								<CgClose color="#ffffff" size="22" />
							</span>
						</Tooltip>
					</div>
					<div className="settings">
						<div className="settings-title">Ayarlar</div>

						<div className="settings-content">
							<div className="line">
								<span className="info">
									Yaptığınız ayarlar sadece bulunduğunuz kanal olan <b>{room}</b> için geçerlidir.
								</span>
							</div>

							<div className="line">
								<span>Kullanıcı Adım: </span>
								<input
									type="text"
									name="user_name"
									defaultValue={user.name}
									onChange={handleSettings}
									className="input-text"
									maxLength="35"
								/>
							</div>

							<div className="line">
								<span>Renk: </span>
								<div>
									<div
										className="color-picker"
										style={{ backgroundColor: settings.user_color }}
										onClick={toggleColorPicker}
									></div>
									{showColorPicker && <TwitterPicker color={settings.user_color} onChange={handleColorPicker} />}
								</div>
							</div>

							<div className="bottom">
								<button className="button" onClick={saveSettings}>
									Kaydet
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			<Tooltip title="Ayarlar">
				<div className="settings-btn" onClick={toggleSettings}>
					<MdSettings color="#ffffff" size="26" />
				</div>
			</Tooltip>
		</>
	);
}
