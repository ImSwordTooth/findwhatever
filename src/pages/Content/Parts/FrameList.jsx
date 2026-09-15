import { useMemo } from 'preact/compat'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export const FrameList = (props) => {
	const { frames = [], total = [], tabIndex = '0', updateCurrent, updateTabIndex } = props

	const { t } = useTranslation()
	const totalMap = useMemo(() => {
		if (!Array.isArray(total)) return new Map()
		return new Map(total.map(item => [item?.frameId?.toString(), item?.sum || 0]))
	}, [total])

	const totalSum = useMemo(() => {
		if (!Array.isArray(total)) return 0
		return total.reduce((acc, b) => acc + (b?.sum || 0), 0)
	}, [total])

	const mainFrameSum = totalMap.get('0') || 0
	const activeFrameSum = totalMap.get(tabIndex.toString()) || 0

	const handleTabChange = async (frameid) => {
		if (!updateCurrent || !updateTabIndex) {
			return
		}

		if (totalSum > 0) {
			const { resultSum = [] } = await chrome.storage.session.get(['resultSum'])
			updateTabIndex(frameid)

			let currentNum = 0
			for (let item of resultSum) {
				if (item?.frameId?.toString() !== frameid.toString()) {
					currentNum += (item?.sum || 0)
				} else {
					break
				}
			}
			const targetIndex = currentNum + 1
			await chrome.storage.session.set({ activeResult: targetIndex })
			updateCurrent(targetIndex)
		}
	}

	const nextFrame = () => {
		// 提取除主页面外所有存在有效命中结果的子 iframe
		const validChildFrames = (frames || []).slice(1).filter(f => {
			const sum = totalMap.get(f?.frameId?.toString()) || 0
			return sum > 0
		})

		if (validChildFrames.length === 0) return

		const currentIndex = validChildFrames.findIndex(f => f?.frameId?.toString() === tabIndex.toString())
		if (currentIndex === -1 || currentIndex === validChildFrames.length - 1) {
			// 当前在主页面或在最后一个有结果的子 iframe 时，循环切换至第一个有效子 iframe
			handleTabChange(validChildFrames[0].frameId.toString())
		} else {
			// 顺位切换到下一个有结果的子 iframe
			handleTabChange(validChildFrames[currentIndex + 1].frameId.toString())
		}
	}

	const activeFrameIndex = Math.max(0, frames.findIndex(f => f?.frameId?.toString() === tabIndex.toString()))

	return (
		<div className="flex items-center border-solid border-0 border-b border-[rgba(232,232,232,0.8)] dark:border-[rgba(93,93,93,0.8)] h-full flex-1 mr-1">
			<div className="flex items-center text-xs mr-2 text-[#000000] dark:text-[#ffffff] relative cursor-pointer select-none" onClick={() => handleTabChange('0')}>
				{t('当前页')}
				<span className="bg-[#f4f4f4] dark:bg-[#282828] dark:text-[#b7b4b4] py-[1px] px-[5px] rounded-[7px] ml-1 h-[13px] leading-[14px] box-content">
					{mainFrameSum}
				</span>
				{
					mainFrameSum !== 0
						? (
							tabIndex.toString() === '0'
								? <div className="pageTabStatusBar bg-[var(--swe-color-primary)]" />
								: <div className="pageTabStatusBar bg-[#e0e0e0] dark:bg-[#555]" />
						)
						: <div className="pageTabStatusBar" style={{ height: '1px' }} />
				}
			</div>

			{
				frames?.length > 1 &&
				<div className="flex items-center text-xs select-none cursor-pointer" onClick={nextFrame}>
					<div className="relative">
						<span className="scale-90 inline-block mr-1 text-[#808080]">iframe</span>
						<span className="font-mono text-[#808080] text-[12px] inline-block scale-90 origin-left">
							{activeFrameIndex}/{frames.length - 1}
						</span>

						<div className="flex items-center text-xs absolute w-full -bottom-[4px]">
							{
								frames.slice(1).map((frame) => {
									const frameId = frame?.frameId?.toString()
									const frameSum = totalMap.get(frameId) || 0
									const isActive = frameId === tabIndex.toString()

									if (frameSum !== 0) {
										if (isActive) {
											return <div key={frame.frameId} className="framesTabStatusBar bg-[var(--swe-color-primary)]"></div>
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
						tabIndex.toString() !== '0' &&
						<span className="bg-[#f4f4f4] dark:bg-[#282828] dark:text-[#b7b4b4] py-[1px] px-[5px] rounded-[7px] ml-1 h-[13px] leading-[14px] box-content">
							{activeFrameSum}
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
