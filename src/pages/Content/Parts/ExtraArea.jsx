import { useEffect, useState } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import HiddenSvg from '../../../assets/svg/hidden.svg'
import OpacitySvg from '../../../assets/svg/opacity.svg'
import SettingSvg from '../../../assets/svg/setting.svg'

export const ExtraArea = (props) => {
	const { isHidePanel, isShowSetting, isShowOpacity, isShowStatus, updateIsHidePanel, updateIsHidePanelTemporarily } = props
	const [ visibleStatus, setVisibleStatus ] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		chrome.storage.session.get(['visibleStatus']).then((res) => {
			if (!window.isFrame && res?.visibleStatus !== undefined) {
				setVisibleStatus(res.visibleStatus)
			}
		}).catch(() => null)

		chrome.storage.onChanged.addListener(handleSessionChange)

		return () => {
			chrome.storage.onChanged.removeListener(handleSessionChange)
		}
	}, []);


	const handleSessionChange = async (changes, areaName) => {
		if (areaName === 'session') {
			if (!window.isFrame && changes.visibleStatus !== undefined) {
				setVisibleStatus(changes.visibleStatus.newValue)
			}
		}
	}

	const hidePanelTemporarily = () => {
		if (!isHidePanel) {
			updateIsHidePanelTemporarily(true)
		}
	}

	const showPanelTemporarily = () => {
		if (!isHidePanel) {
			updateIsHidePanelTemporarily(false)
		}
	}

	const toggleHidePanel = () => updateIsHidePanel(!isHidePanel)

	const openSetting = () => {
		chrome?.runtime?.sendMessage({ action: 'openOptionsPage' })
	}

	return (
		<div className="inline-flex items-center absolute right-3 top-1.5 gap-[6px]">
			{
				isShowStatus && visibleStatus &&
				<div className="flex items-center text-xs text-[#a0a0a0] cursor-grabbing opacity-60 h-[12px]">
					<div className="inline-flex items-center scale-[0.8] origin-right text-xs cursor-grabbing text-[#a0a0a0]">
						<HiddenSvg className="mr-1 w-[14px] h-[14px]" />
						{t(visibleStatus)}
					</div>
				</div>
			}
			{
				isShowOpacity &&
				<div
					className={`flex items-center text-xs cursor-grab active:cursor-grabbing z-30 transition-all duration-200 hover:scale-110 active:scale-90 ${
						isHidePanel
							? 'text-[var(--swe-color-primary)] opacity-100'
							: 'text-[#a0a0a0] opacity-75 hover:opacity-100 hover:text-[var(--swe-color-primary)]'
					}`}
					onMouseEnter={hidePanelTemporarily}
					onMouseLeave={showPanelTemporarily}
					onClick={toggleHidePanel}
				>
					<OpacitySvg />
				</div>
			}
			{
				isShowSetting &&
				<div
					className="flex items-center text-xs text-[#a0a0a0] cursor-pointer opacity-75 hover:opacity-100 hover:text-[var(--swe-color-primary)] z-30 transition-all duration-200 hover:scale-110 hover:rotate-45 active:scale-90"
					onClick={openSetting}
				>
					<SettingSvg className="w-[11px] h-[11px]" />
				</div>
			}
		</div>
	)
}

ExtraArea.propTypes = {
	isHidePanel: PropTypes.bool,
	isHidePanelTemporarily: PropTypes.bool,
	updateIsHidePanel: PropTypes.func,
	updateIsHidePanelTemporarily: PropTypes.func
}
