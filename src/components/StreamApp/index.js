import './index.css';
import { useState } from 'react';
import VideoSection from './VideoSection';
import ChatSection from './ChatSection';

export default function StreamApp({ room }) {
	const [hideChat, setHideChat] = useState(false);

	document.title = `Mekanik Ninja - Oda: ${room}`;

	return (
		<div className={hideChat ? 'StreamApp hide-chat' : 'StreamApp'}>
			<VideoSection room={room} hideChat={hideChat} setHideChat={setHideChat} />

			<ChatSection room={room} hideChat={hideChat} setHideChat={setHideChat} />
		</div>
	);
}
