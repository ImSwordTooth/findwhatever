import React from 'react'
import PropTypes from 'prop-types'
import { i18n } from '../../i18n'

export const FrameList = (props) => {
	const { frames, total, tabIndex, updateCurrent, updateTabIndex } = props

	const handleTabChange = async (frameid) => {
		if (!updateCurrent) {
			return
		}

		const sum = total.map(a => a.sum).reduce((a, b) => a + b, 0)
		if (sum > 0) {
			const { resultSum } = await chrome.storage.sync.get(['resultSum'])
			updateTabIndex(frameid)

			let currentNum = 0;
			for (let item of resultSum) {
				if (item.frameId !== +frameid) {
					currentNum += item.sum;
				} else {
					break;
				}
			}
			await chrome.storage.sync.set({ activeResult: currentNum + 1})
			updateCurrent(currentNum + 1)
		}
	}

	const nextFrame = () => {
		const first = total.slice(1).find(f => f.sum !== 0)
		if (tabIndex === '0') {
			if (first) {
				handleTabChange(first.frameId.toString())
			}
		} else {
			const currentIndex = frames.findIndex(f => f.frameId.toString() === tabIndex)
			const nextFrame = total.slice(currentIndex+1).find(f => f.sum !== 0)
			if (nextFrame) {
				handleTabChange(nextFrame.frameId.toString())
			} else {
				if (first) {
					handleTabChange(first.frameId.toString())
				}
			}

		}
	}

	return (
		<div className="flex items-center border-solid border-0 border-b border-[rgba(232,232,232,0.8)] dark:border-[rgba(93,93,93,0.8)] h-full flex-1 mr-1">
			<div className="flex items-center text-xs mr-2 text-[#000000] dark:text-[#ffffff] relative cursor-pointer select-none" onClick={() => handleTabChange('0')}>
				{i18n('当前页')}
				<span className="bg-[#f4f4f4] dark:bg-[#282828] dark:text-[#b7b4b4] py-[1px] px-[5px] rounded-[7px] ml-1 h-[13px] leading-[14px] box-content">
					{total.find(a => a.frameId === 0) ? total.find(a => a.frameId === 0).sum : 0}
				</span>
				{
					total.find(a => a.frameId === 0)?.sum !== 0
					?
					(
						tabIndex === '0'
							? <div className="pageTabStatusBar bg-[#000000] dark:bg-[#cbcbcb]" />
							: <div className="pageTabStatusBar bg-[#e0e0e0] dark:bg-[#555]" />
					)
						: <div className="pageTabStatusBar" style={{ height: '1px' }} />

				}
			</div>

			{
				frames?.length > 1 &&
				<div className="flex items-center text-xs select-none cursor-pointer" onClick={nextFrame}>
					<div className=" relative">
						<span className="scale-90 inline-block mr-1 text-[#808080]">iframe</span>
						<span className="font-mono text-[#808080] text-[12px] inline-block scale-90 origin-left">{frames.findIndex(f => f.frameId == tabIndex)}/{frames.length - 1}</span>

						<div className="flex items-center text-xs absolute w-full -bottom-[4px]">
							{
								frames.slice(1).map((frame) => {
									if (total.find(a => a.frameId === frame.frameId)?.sum !== 0) {
										if (frame.frameId.toString() === tabIndex) {
											return <div key={frame.frameId} className="framesTabStatusBar bg-[#000000] dark:bg-[#cbcbcb]"></div>
										} else {
											return <div key={frame.frameId} className="framesTabStatusBar bg-[#e0e0e0] dark:bg-[#555]"></div>
										}
									} else {
										return <div key={frame.frameId} className="framesTabStatusBar"></div>
									}
								})
							}
						</div>
					</div>
					{
						tabIndex !== '0' &&
						<span className="bg-[#f4f4f4] dark:bg-[#282828] dark:text-[#b7b4b4] py-[1px] px-[5px] rounded-[7px] ml-1 h-[13px] leading-[14px] box-content">
							{total.find(a => a.frameId.toString() === tabIndex) ? total.find(a => a.frameId.toString() === tabIndex).sum : 0}
						</span>
					}
				</div>
			}
		</div>

	)
}

FrameList.propTypes = {
	frames: PropTypes.array,
	total: PropTypes.array,
	tabIndex: PropTypes.string,
	updateTabIndex: PropTypes.func,
	updateCurrent: PropTypes.func
}
