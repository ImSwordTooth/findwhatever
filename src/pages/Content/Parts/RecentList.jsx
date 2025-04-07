import React, {useEffect, useState} from 'react'
import {Divider, Dropdown, Menu, Tooltip} from "antd";
import {i18n} from "../features";
import PropTypes from "prop-types";

export const RecentList = (props) => {
	const { fillSearchValue, popupContainer, fixList, recentList, updateFixList, updateRecentList } = props

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
			trigger={['hover']}
			align={{offset: [-8, 0]}}
			menu={{
				items: recentList.map((r, i) => ({
					key: i,
					label:
						<div className="relative pr-[32px] group">
							<div
								className="w-20 h-5 text-ellipsis whitespace-nowrap overflow-hidden"
								onClick={(e) => fillSearchValue(e, r)}>{r}</div>
							<div
								className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
								<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popupContainer} align={{offset: [0, 4]}} title={<div className="scale-90 origin-left">{i18n('填入并开启正则模式')}</div>}>
									<div
										onClick={(e) => fillSearchValue(e, r, true)}
										className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2]">.*
									</div>
								</Tooltip>

								<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popupContainer} align={{offset: [0, 4]}} title={<div className="scale-90 origin-left">{i18n('固定之')}</div>}>
									<div
										onClick={(e) => addToFix(e, r)}
										className="flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] group/fix ">
										<svg className="w-3 h-3 group-hover/fix:fill-[#50a3d2]"
											 viewBox="0 0 1024 1024" version="1.1"
											 xmlns="http://www.w3.org/2000/svg" p-id="8003"
											 width="200" height="200" fill="#3B3B3B">
											<path
												d="M1008.618567 392.01748l-383.019709-383.019709C606.447872-10.153214 574.529563 2.61411 568.145902 34.532419l-6.383662 57.452956-6.383662 70.22028c0 12.767324-6.383662 19.150985-12.767324 25.534647L236.195487 404.784804c-6.383662 6.383662-12.767324 6.383662-25.534647 6.383662h-12.767324l-57.452956-6.383662c-31.918309 0-51.069295 38.301971-25.534647 57.452956l44.685632 44.685633 127.673237 127.673236L0 1024l383.019709-287.264782 172.358869 172.358869c25.534647 25.534647 63.836618 6.383662 57.452956-25.534647l-6.383662-57.452956v-12.767324c0-6.383662 0-19.150985 6.383662-25.534647L829.876036 481.388746c6.383662-6.383662 12.767324-12.767324 25.534647-12.767324l70.22028-6.383662 57.452957-6.383662c38.301971-6.383662 51.069295-38.301971 25.534647-63.836618z m-255.346473 31.918309l-217.044501 306.415767s0 6.383662-6.383662 6.383662L287.264782 494.156069s6.383662 0 6.383662-6.383662l306.415767-217.044501c31.918309-19.150985 51.069295-51.069295 57.452956-89.371266l178.742531 178.742531c-31.918309 12.767324-63.836618 31.918309-82.987604 63.836618z"
												p-id="8004"></path>
										</svg>
									</div>
								</Tooltip>

							</div>

						</div>
				}))
			}}
			dropdownRender={(menu) => (
				<div style={{
					background: '#ffffff',
					boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
					borderRadius: '6px'
				}}>
					{
						fixList.length > 0 &&
						<>
							<div className="scale-[0.9] origin-bottom font-bold pt-1">{i18n('固定')}</div>
							<Menu
								style={{boxShadow: 'none'}}
								items={fixList.map((r, i) => ({
									key: i,
									label:
										<div className="relative pr-[32px] group">
											<div className="max-w-10 h-5 text-ellipsis whitespace-nowrap overflow-hidden" onClick={(e) => fillSearchValue(e, r)}>{r}</div>
											<div
												className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
												<Tooltip arrowPointAtCenter={true} placement="top"
														 getPopupContainer={() => popupContainer}
														 align={{offset: [0, 4]}} title={<div className="scale-90 origin-left">{i18n('填入并开启正则模式')}</div>}>
													<div
														onClick={(e) => fillSearchValue(e, r, true)}
														className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2]">.*
													</div>
												</Tooltip>

												<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popupContainer} align={{offset: [0, 4]}} title={<div className="scale-90 origin-left">{i18n('取消固定')}</div>}>
													<div
														onClick={(e) => cancelToFix(e, r)}
														className="flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[rgba(216,30,6,0.1)] ">
														<svg className="w-3 h-3"
															 viewBox="0 0 1024 1024" version="1.1"
															 xmlns="http://www.w3.org/2000/svg" p-id="8148"
															 width="200" height="200" fill="#d81e06">
															<path
																d="M837.618696 480.385109l-99.816294 141.022507-78.18943-67.056074 94.249616-133.216362q32.63225-46.197028 87.019333-55.666779L658.589216 183.239681q-9.405766 54.387083-55.602795 87.019332L452.494163 376.793711 372.12925 307.946063 543.736493 186.438921a34.167885 34.167885 0 0 0 14.268611-24.122271l7.998101-71.79095 0.063985-0.767817 6.590434-59.121959a34.167885 34.167885 0 0 1 58.162187-20.411152l383.013034 383.013034a34.23187 34.23187 0 0 1-20.475137 58.226171l-59.057974 6.52645-0.767817 0.12797-71.79095 7.934116a34.167885 34.167885 0 0 0-24.122271 14.268611zM32.881821 164.620103a47.988603 47.988603 0 1 1 62.449168-72.814707l895.787251 767.817644a47.988603 47.988603 0 1 1-62.449168 72.814706l-895.787251-767.817643z m354.155888 569.208813L562.036147 908.827354a34.167885 34.167885 0 0 0 58.226171-27.321512l-5.438708-60.017745-0.511879-5.502694-0.447893-5.118784a34.167885 34.167885 0 0 1 6.142541-22.90656l43.637636-61.68135L585.3906 659.286619l-49.140329 69.487497-3.711119 5.502693-242.69436-242.69436q2.815331-1.791575 5.502693-3.711118l49.332284-34.871718L264.378841 384.151964l-28.281284 19.963259a34.167885 34.167885 0 0 1-22.842575 6.142541l-5.118784-0.447894-5.566678-0.511878-60.017746-5.438709a34.167885 34.167885 0 0 0-27.257526 58.226172l174.998438 174.998438L0.121602 1024l386.916107-290.171084z"
															></path>
														</svg>
													</div>
												</Tooltip>
											</div>
										</div>
								}))}
							/>
							<Divider style={{margin: 0}}/>
						</>
					}
					<div className="flex items-center justify-between pt-1 pr-[10px] pl-[1px]">
						<div className="scale-[0.9] w-[108px] origin-bottom font-bold">{i18n('最近')}</div>
						<svg className="w-3.5 h-3.5 cursor-pointer" onClick={clearRecent} viewBox="0 0 1024 1024"
							 version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9345"
							 width="200" height="200">
							<path
								d="M764 208H656v-56H368v56H152v56h80v580a28 28 0 0 0 28 28h504a28 28 0 0 0 28-28V264h80v-56H764zM736 816H288V264h448v552z"
								fill="" p-id="9346"></path>
							<path d="M392 368h56v360h-56zM576 368h56v360h-56z" fill=""
								  p-id="9347"></path>
						</svg>
					</div>
					<div className="smallScroll max-h-[160px] overflow-auto overscroll-contain">
						{
							recentList.length > 0
								? React.cloneElement(menu, {style: {boxShadow: 'none'}})
								: <div className="text-xs h-5 text-center scale-90 text-[#cccccc]">暂无数据</div>
						}
					</div>
				</div>
			)}
			getPopupContainer={() => popupContainer}
		>
			<svg
				className="absolute left-[5px] top-0 bottom-0 p-1 box-content m-auto w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2]"
				viewBox="0 0 1024 1024" version="1.1"
				xmlns="http://www.w3.org/2000/svg" width="32" height="32"
				fill="#272636">
				<path d="M924.352 844.256l-163.968-163.968c44.992-62.912 71.808-139.648 71.808-222.72 0-211.776-172.224-384-384-384s-384 172.224-384 384 172.224 384 384 384c82.56 0 158.912-26.432 221.568-70.912l164.16 164.16c12.416 12.416 38.592 15.04 51.072 2.624l45.248-45.248c12.416-12.544 6.592-35.392-5.888-47.936zM128.128 457.568c0-176.448 143.552-320 320-320s320 143.552 320 320-143.552 320-320 320-320-143.552-320-320z"></path>
			</svg>
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
