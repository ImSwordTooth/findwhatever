import { useRef, useEffect } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Tooltip } from '../../../components/Tooltip'

export const RecentList = (props) => {
	const {
		isOpen = false,
		onClose,
		fillSearchValue,
		recentList = [],
		selectedIndex = -1,
		updateRecentList,
		className = ''
	} = props

	const { t } = useTranslation()
	const listRef = useRef(null)

	// 当选中的索引变化时，自动将对应条目平滑滚入可视区
	useEffect(() => {
		if (isOpen && selectedIndex >= 0 && listRef.current) {
			const activeItem = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
			if (activeItem) {
				activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
			}
		}
	}, [selectedIndex, isOpen])

	if (!isOpen) return null

	const clearRecent = (e) => {
		e?.stopPropagation?.()
		updateRecentList?.([])
	}

	const handleItemClick = (e, text, isReg = false) => {
		e?.stopPropagation?.()
		fillSearchValue?.(e, text, isReg)
		onClose?.()
	}

	const hasRecent = Array.isArray(recentList) && recentList.length > 0

	return (
		<div
			className={`absolute top-[calc(100%+6px)] left-0 w-full bg-white/95 dark:bg-[#222222]/95 backdrop-blur-md rounded-lg shadow-xl border border-[rgba(232,232,232,0.9)] dark:border-[rgba(64,64,64,0.9)] z-50 overflow-hidden text-xs select-none transition-all duration-150 p-1.5 ${className || ''}`}
			onClick={(e) => e.stopPropagation()}
			onMouseDown={(e) => e.stopPropagation()}
		>
			{hasRecent ? (
				<>
					<div className="flex items-center justify-between text-[11px] font-medium text-neutral-400 dark:text-neutral-500 px-2 py-0.5 mb-1 select-none">
						<span>{t('最近搜索')}</span>
						<button
							type="button"
							onClick={clearRecent}
							className="text-[11px] text-neutral-400 hover:text-red-500 transition-colors cursor-pointer p-0 border-none bg-transparent"
						>
							{t('清除')}
						</button>
					</div>
					<div
						ref={listRef}
						className="space-y-[1px] max-h-[160px] overflow-y-auto overflow-x-hidden smallScroll"
					>
						{recentList.map((r, i) => {
							const isSelected = selectedIndex === i
							return (
								<div
									key={`recent-${r}-${i}`}
									data-index={i}
									onClick={(e) => handleItemClick(e, r)}
									className={`flex items-center justify-between px-2 py-1 h-6 rounded cursor-pointer group transition-colors ${
										isSelected
											? 'bg-[var(--swe-color-primary)]/10 text-[var(--swe-color-primary)] font-medium'
											: 'hover:bg-gray-100 dark:hover:bg-[#2c2c2c] text-neutral-800 dark:text-neutral-200'
									}`}
								>
									<span className="truncate flex-1 text-xs leading-none" title={r}>
										{r}
									</span>
									<div className="hidden group-hover:flex items-center ml-2 shrink-0">
										<Tooltip placement="topRight" title={<div className="scale-90 p-1">{t('填入并开启正则模式')}</div>}>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation()
													handleItemClick(e, r, true)
												}}
												className="flex w-[18px] h-[18px] justify-center items-center text-[12px] font-mono leading-none select-none rounded cursor-pointer transition-colors hover:bg-gray-200 hover:text-[var(--swe-color-primary)] dark:text-[#b0b0b0] dark:hover:bg-[#383838] p-0 border-none bg-transparent"
											>
												.*
											</button>
										</Tooltip>
									</div>
								</div>
							)
						})}
					</div>
				</>
			) : (
				<div className="py-3 text-center text-xs text-neutral-400 dark:text-neutral-500 select-none">
					{t('暂无数据')}
				</div>
			)}
		</div>
	)
}

RecentList.propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	recentList: PropTypes.array,
	selectedIndex: PropTypes.number,
	fillSearchValue: PropTypes.func,
	updateRecentList: PropTypes.func
}


