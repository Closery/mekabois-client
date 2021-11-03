import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CgClose } from 'react-icons/cg';
import { FaUserNinja } from 'react-icons/fa';
import { TiTicket } from 'react-icons/ti';
import Tooltip from '@material-ui/core/Tooltip';

export default function RoomSwitcher(props) {
	const { socket, roomName, roomList, showSwitcher, setShowSettings, setShowEmojiPicker, setShowSwitcher } = props;

	const toggleSwitcher = () => {
		setShowSwitcher(!showSwitcher);
		setShowSettings(false);
		setShowEmojiPicker(false);
	};

	return (
		<>
			{showSwitcher && (
				<div className="settings-wrapper">
					<div className="tab">
						<Tooltip title="Kapat">
							<span onClick={toggleSwitcher}>
								<CgClose color="#ffffff" size="22" />
							</span>
						</Tooltip>
					</div>
					<div className="settings">
						<div className="settings-title">Kanallar</div>

						<div className="settings-content">
							<div className="room-list">
								{roomList.map((room, i) => (
									<div className={room.name === roomName ? 'link active' : 'link'} key={i}>
										<Link
											to={`/kanal/${room.name}`}
											onClick={() => {
												if (room.name != roomName) socket.disconnect();
											}}
										>
											<span>{room.name}</span>

											<span>
												<FaUserNinja color="#e84545" size="14" />
												{room.users}
											</span>
										</Link>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}

			<Tooltip title="Aktif Kanallar">
				<div className="settings-btn" onClick={toggleSwitcher}>
					<TiTicket color="#ffffff" size="28" />
				</div>
			</Tooltip>
		</>
	);
}
