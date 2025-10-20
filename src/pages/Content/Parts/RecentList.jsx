import React from 'react'
import {Button, Divider, Dropdown, Menu, Tooltip} from "antd";
import {i18n} from "../../i18n";
import PropTypes from "prop-types";
import FixSvg from '../../../assets/svg/fix.svg'
import UnfixSvg from '../../../assets/svg/unfix.svg'
import TrashSvg from '../../../assets/svg/trash.svg'
import SearchSvg from '../../../assets/svg/search.svg'
import DownSvg from '../../../assets/svg/down.svg'

export const RecentList = (props) => {
	const { fillSearchValue, popupContainer, fixList, recentList, openHistoryMode, updateFixList, updateRecentList } = props

	const addToFix = (e, text) => {
		e.stopPropagation()
		const newFixList = fixList.slice()

		if (newFixList.includes(text)) {
			const index = newFixList.findIndex(r => r === text);
			if (index > 0) {
				newFixList.unshift(newFixList.splice(index, 1)[0])
			}
		} else {
			newFixList.unshift(text)
		}
		updateFixList(newFixList)
	}

	const cancelToFix = (e, text) => {
		e.stopPropagation()
		const newFixList = fixList.slice()

		const index = newFixList.findIndex(r => r === text);
		newFixList.splice(index, 1)
		updateFixList(newFixList)
	}

	const clearRecent = () => {
		updateRecentList([])
	}

	return (
		<Dropdown
			arrow={true}
			placement='bottomLeft'
			trigger={[openHistoryMode]}
			align={{offset: [-4, -8]}}
			overlayStyle={{width: '136px'}}
			menu={{
				items: recentList.map((r, i) => ({
					key: i,
					label:
						<div className="relative pr-[32px] group">
							<div className=" h-5 text-ellipsis whitespace-nowrap overflow-hidden dark:text-[#fff]" onClick={(e) => fillSearchValue(e, r)}>{r}</div>
							<div className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
								<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popupContainer} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('填入并开启正则模式')}</div>}>
									<div
										onClick={(e) => fillSearchValue(e, r, true)}
										className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2] dark:text-[#b0b0b0] dark:hover:bg-[#2c2c2c]">.*
									</div>
								</Tooltip>

								<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popupContainer} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('固定之')}</div>}>
									<div
										onClick={(e) => addToFix(e, r)}
										className="flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] dark:hover:bg-[#2c2c2c] group/fix ">
										<FixSvg className="w-3 h-3 group-hover/fix:fill-[#50a3d2] dark:*:fill-[#b0b0b0]" />
									</div>
								</Tooltip>
							</div>
						</div>
				}))
			}}
			dropdownRender={(menu) => (
				<div className="bg-white dark:bg-[#242424] dark:[&_.ant-dropdown-menu]:bg-[#242424]" style={{
					boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
					borderRadius: '6px'
				}}>
					{
						fixList.length > 0 &&
						<>
							<div className="font-bold pl-[10px] pt-[10px] select-none dark:text-[#fff]">{i18n('固定')}</div>
							<Menu
								style={{boxShadow: 'none'}}
								items={fixList.map((r, i) => ({
									key: i,
									label:
										<div className="relative pr-[32px] group">
											<div className="max-w-10 h-5 text-ellipsis whitespace-nowrap overflow-hidden dark:text-[#fff]" onClick={(e) => fillSearchValue(e, r)}>{r}</div>
											<div className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
												<Tooltip arrowPointAtCenter={true} placement="top"
														 getPopupContainer={() => popupContainer}
														 align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('填入并开启正则模式')}</div>}>
													<div
														onClick={(e) => fillSearchValue(e, r, true)}
														className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2] dark:text-[#b0b0b0] dark:hover:bg-[#2c2c2c]">.*
													</div>
												</Tooltip>

												<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popupContainer} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('取消固定')}</div>}>
													<div
														onClick={(e) => cancelToFix(e, r)}
														className="flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[rgba(216,30,6,0.1)] ">
														<UnfixSvg className="w-3 h-3" />
													</div>
												</Tooltip>
											</div>
										</div>
								}))}
							/>
							<Divider style={{margin: 0}}/>
						</>
					}
					<div className="flex items-center justify-between pl-[10px] pr-[10px] pt-[10px] h-[20px] box-content dark:text-[#fff]">
						<div className="font-bold select-none">{i18n('最近')}</div>
						<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer !inline-flex items-center justify-center" onClick={clearRecent}>
							<TrashSvg className="w-[16px] h-[16px] cursor-pointer" />
						</Button>
					</div>
					<div className="smallScroll max-h-[160px] overflow-auto overscroll-contain dark:[&_.ant-dropdown-menu]:bg-[#242424]">
						{
							recentList.length > 0
								? React.cloneElement(menu, {style: {boxShadow: 'none'}})
								: <div className="text-xs h-[30px] text-center scale-90 text-[#cccccc] select-none">{i18n('暂无数据')}</div>
						}
					</div>
				</div>
			)}
			getPopupContainer={() => popupContainer}
		>
			<div className="absolute top-0 left-0 h-[36px]">
				<SearchSvg className="absolute left-[4px] top-0 bottom-0 p-1 box-content m-auto w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2] dark:*:fill-[#fff] dark:hover:bg-[#353535]" />
				<DownSvg className="absolute w-[8px] h-[8px] left-[23px] top-[14px] z-10 cursor-pointer" />
			</div>
		</Dropdown>
	)
}

RecentList.propTypes = {
	recentList: PropTypes.array,
	fixList: PropTypes.array,
	fillSearchValue: PropTypes.func,
	popupContainer: PropTypes.object,
	updateRecentList: PropTypes.func,
	updateFixList: PropTypes.func
}
