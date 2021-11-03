import { useEffect, useRef, useState } from 'react'
import { BsArrowBarLeft, BsInfoCircleFill } from 'react-icons/bs'
import { GiSharpShuriken } from 'react-icons/gi'
import FLV from 'flv.js'
import Tooltip from '@material-ui/core/Tooltip'
import offlineImg from './offline-min.jpg'
import CONFIG from '../../../config.json'

export default function VideoSection({ room, setHideChat, hideChat }) {
	const [isLive, setIsLive] = useState(false)
	const [error, setError] = useState(false)
	var FlvPlayer = useRef()

	const UpdateStream = () => {
		if (FlvPlayer.current.mediaInfo.mimeType) {
			if (!error) {
				FlvPlayer.current.destroy()
			}
			LoadPlayer()
		} else LoadPlayer()
	}

	const LoadPlayer = () => {
		const HOST = CONFIG.DEV_MODE ? CONFIG.DEV_HOST : CONFIG.HOST
		const URL = `${window.location.protocol}//${HOST}`

		if (FLV.isSupported()) {
			// Detailed Document: https://github.com/bilibili/flv.js/blob/master/docs/api.md
			var videoElement = document.getElementById('videoElement')
			FlvPlayer.current = FLV.createPlayer({
				type: 'flv',
				url: `${URL}/stream/${room}`,
			})
			FlvPlayer.current.attachMediaElement(videoElement)
			FlvPlayer.current.load()
			FlvPlayer.current.play()

			FlvPlayer.current.on(FLV.Events.METADATA_ARRIVED, (data) => {
				setIsLive(true)
				setError(false)
			})

			FlvPlayer.current.on(FLV.Events.ERROR, (err) => {
				FlvPlayer.current.destroy()
				setError(true)
				setIsLive(false)
				console.error('err', err)
			})

			FlvPlayer.current.on(FLV.Events.LOADING_COMPLETE, () => {
				FlvPlayer.current.destroy()
				setError(true)
				setIsLive(false)
			})
		}
	}

	useEffect(LoadPlayer, [])

	return (
		<div className="video-section">
			<div className="copyright">
				<BsInfoCircleFill color="#36393f" />

				<span>
					Developed by
					<a className="owner" href="https://github.com/Closery" target="_blank" rel="noreferrer">
						Closery
					</a>
				</span>
			</div>

			{isLive ? <div className="isLive live">CANLI</div> : <div className="isLive">ÇEVRİMDIŞI</div>}

			<button id="updateStream" onClick={UpdateStream}>
				<GiSharpShuriken size="18px" color="#ffffff" /> Yayını Güncelle
			</button>

			<Tooltip title="Sohbeti Göster">
				<BsArrowBarLeft
					onClick={() => setHideChat(!hideChat)}
					size="24"
					className="show-chat-btn"
					color={isLive ? '#fff' : '#292a2b'}
				/>
			</Tooltip>
			{!isLive && <div className="offline" style={{ backgroundImage: `url(${offlineImg})` }} />}
			<video id="videoElement" controls muted autoPlay />
		</div>
	)
}
