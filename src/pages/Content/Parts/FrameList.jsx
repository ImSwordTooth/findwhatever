import React from 'react'
import {Tabs} from "antd";
import PropTypes from 'prop-types'
import { i18n } from '../features'

export const FrameList = (props) => {
	const { frames, total, tabIndex, updateCurrent, updateTabIndex } = props

	const handleTabChange = async (frameid) => {
		const { resultSum } = await chrome.storage.session.get(['resultSum'])
		updateTabIndex(frameid)

		let currentNum = 0;
		for (let item of resultSum) {
			if (item.frameId !== +frameid) {
				currentNum += item.sum;
			} else {
				break;
			}
		}
		await chrome.storage.session.set({ activeResult: currentNum + 1})
		updateCurrent(currentNum + 1)
	}

	return (
		<Tabs className="w-[262px] !mr-[4px]" activeKey={tabIndex} items={frames.map((f, index) => {
			return {
				disabled: total.find(a => a.frameId === f.frameId) && total.find(a => a.frameId === f.frameId).sum === 0,
				key: f.frameId.toString(),
				label: (
					<div className="flex items-baseline select-none">
						{index === 0 ? i18n('当前页') : `iframe${index}`}
						<div
							className="bg-[#f4f4f4] py-[1px] px-[5px] rounded-[7px] ml-0.5 h-[13px] leading-[14px] box-content">
							{total.find(a => a.frameId === f.frameId) ? total.find(a => a.frameId === f.frameId).sum : 0}
						</div>
					</div>
				)
			}
		})}
			  onChange={handleTabChange}
			  size={'small'}
			  getPopupContainer={e => e.parentElement}
		>
		</Tabs>
	)
}

FrameList.propTypes = {
	frames: PropTypes.array,
	total: PropTypes.array,
	tabIndex: PropTypes.string,
	updateTabIndex: PropTypes.func,
	updateCurrent: PropTypes.func
}
