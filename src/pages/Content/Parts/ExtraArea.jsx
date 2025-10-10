import React, {useEffect, useState} from 'react'
import {i18n} from "../../i18n";
import PropTypes from 'prop-types'
import HiddenSvg from '../../../assets/svg/hidden.svg'
import OpacitySvg from '../../../assets/svg/opacity.svg'
import SettingSvg from '../../../assets/svg/setting.svg'

export const ExtraArea = (props) => {
	const { isHidePanel, isShowSetting, isShowOpacity, isShowStatus, updateIsHidePanel, updateIsHidePanelTemporarily } = props
	const [ visibleStatus, setVisibleStatus ] = useState(false)

	useEffect(() => {
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
		<div className="inline-flex items-center absolute right-[12px] top-[6px] gap-[6px]">
			{
				isShowStatus && visibleStatus &&
				<div className="flex items-center text-xs text-[#a0a0a0] cursor-grabbing opacity-60 h-[12px]">
					<div className="inline-flex items-center scale-[0.8] origin-right text-xs cursor-grabbing text-[#a0a0a0]">
						<HiddenSvg className="mr-1 w-[14px] h-[14px]" />
						{i18n(visibleStatus)}
					</div>
				</div>
			}
			{
				isShowOpacity &&
				<div className="flex items-center text-xs text-[#a0a0a0] cursor-grab opacity-80 active:cursor-grabbing z-30" onMouseEnter={hidePanelTemporarily} onMouseLeave={showPanelTemporarily} onClick={toggleHidePanel}>
					<OpacitySvg />
				</div>
			}
			{
				isShowSetting &&
				<div className="flex items-center text-xs text-[#a0a0a0] cursor-pointer opacity-80 z-30" onClick={openSetting}>
					<SettingSvg className="w-3 h-3 dark:*:fill-[#9f9f9f]" />
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
