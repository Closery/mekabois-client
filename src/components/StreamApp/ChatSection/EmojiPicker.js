import Tooltip from '@material-ui/core/Tooltip';
import Picker, { SKIN_TONE_LIGHT } from 'emoji-picker-react';
import { CgClose } from 'react-icons/cg';
import { GiNinjaHead } from 'react-icons/gi';

export default function EmojiPicker(props) {
	const { showEmojiPicker, messageInputRef, setMessage, setShowEmojiPicker, setShowSettings, setShowSwitcher } = props;

	const onEmojiClick = (event, emojiObject) => {
		setMessage((oldMsg) => oldMsg + emojiObject.emoji);
		messageInputRef.current.focus();
	};

	function toggleEmojiPicker() {
		setShowEmojiPicker(!showEmojiPicker);
		setShowSettings(false);
		setShowSwitcher(false);
	}

	return (
		<>
			<div className={showEmojiPicker ? 'picker-wrapper' : 'picker-wrapper hide'}>
				<div className="tab">
					<Tooltip title="Kapat">
						<span onClick={toggleEmojiPicker}>
							<CgClose color="#ffffff" size="22" />
						</span>
					</Tooltip>
				</div>

				<Picker
					onEmojiClick={onEmojiClick}
					disableAutoFocus={true}
					skinTone={SKIN_TONE_LIGHT}
					groupNames={{ smileys_people: 'PEOPLE' }}
					native
				/>
			</div>

			<Tooltip title="Emojiler">
				<div className="emoji-btn" onClick={toggleEmojiPicker}>
					<GiNinjaHead color="#ffffff" size="24" />
				</div>
			</Tooltip>
		</>
	);
}
