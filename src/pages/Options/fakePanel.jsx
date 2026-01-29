import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Divider, Dropdown, Menu, Alert, Tooltip } from "antd";
import { Input } from "../../components/Input";
import { FrameList } from '../Content/Parts/FrameList';
import { i18n } from '../i18n';
import { SettingContext } from './Options'
import HiddenSvg from '../../assets/svg/hidden.svg'
import OpacitySvg from '../../assets/svg/opacity.svg'
import SettingSvg from '../../assets/svg/setting.svg'
import CopySvg from '../../assets/svg/copy.svg'
import FixSvg from '../../assets/svg/fix.svg'
import UnFixSvg from '../../assets/svg/unfix.svg'
import TrashSvg from '../../assets/svg/trash.svg'
import ClearSvg from '../../assets/svg/clear.svg'
import UpArrowSvg from '../../assets/svg/upArrow.svg'
import DownArrowSvg from '../../assets/svg/downArrow.svg'
import CloseSvg from '../../assets/svg/close.svg'
import SearchSvg from '../../assets/svg/search.svg';
import DownSvg from '../../assets/svg/down.svg';

export const FakePanel = (props) => {
	const { onReset } = props

	const [ isHidePanel, setIsHidePanel ] = useState(false) // 是否把面板半透明
	const [ isHidePanelTemporarily, setIsHidePanelTemporarily ] = useState(false) // 是否临时把面板半透明
	const [ recentList, setRecentList ] = useState(['ref', 'second', 'third'])
	const [ fixList, setFixList ] = useState(['first'])
	const [ isDark, setIsDark ] = useState(false)

	const textRef = useRef(null)
	const popContainerRef = useRef(null)
	const { setting } = useContext(SettingContext)

	const text = '   孔乙己是站着喝酒而穿长衫的唯一的人。\n   他身材很高大；青白脸色，皱纹间时常夹些伤痕；一部乱蓬蓬的花白的胡子。\n   穿的虽然是长衫，可是又脏又破，似乎十多年没有补，也没有洗。\n   他对人说话，总是满口之乎者也，教人半懂不懂的。因为他姓孔，别人便从描红纸上的‘上大人孔乙己’这半懂不懂的话里，替他取下一个绰号，叫作孔乙己。'

	useEffect(() => {
		const range1 = new Range()
		range1.setStart(textRef.current.childNodes[0], 4)
		range1.setEnd(textRef.current.childNodes[0], 6)
		CSS.highlights.set('search-results-active', new Highlight(range1))

		const range2 = new Range()
		range2.setStart(textRef.current.childNodes[0], 139)
		range2.setEnd(textRef.current.childNodes[0], 141)
		const range3 = new Range()
		range3.setStart(textRef.current.childNodes[0], 163)
		range3.setEnd(textRef.current.childNodes[0], 165)
		CSS.highlights.set('search-results', new Highlight(range2, range3))
	}, []);

	useEffect(() => {
		if (setting.colorMode === 'auto') {
			setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
		} else {
			setIsDark(setting.colorMode === 'dark')
		}
	}, [setting.colorMode]);

	useEffect(() => {
		const oldElement = document.getElementById('customStyle')
		if (oldElement) {
			oldElement.remove()
		}
		const styleElement = document.createElement('style');
		styleElement.id = 'customStyle'

		const { bgColor, textColor, isOpenUnderline, underlineColor, underlineOffset, underlineThickness, underlineStyle, isOpenUnderlineActive, underlineColorActive, underlineOffsetActive, underlineThicknessActive, underlineStyleActive, bgColorActive, isSame, textColorActive } = setting

		// 定义 CSS 规则
		const cssRules = `
            ::highlight(search-results) {
    			background-color: ${bgColor};
    			color: ${textColor};
				${isOpenUnderline? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : ''}
			}
			::highlight(search-results-active) {
    			background-color: ${bgColorActive};
    			color: ${textColorActive};
    			${isSame
			? (isOpenUnderline ? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : '' )
			: (isOpenUnderlineActive ? `text-decoration: underline; text-decoration-color: ${underlineColorActive}; text-underline-offset: ${underlineOffsetActive}px; text-decoration-thickness: ${underlineThicknessActive}px; text-decoration-style: ${underlineStyleActive}` : '')
		}
			}
			.sketch-picker * {
				box-sizing: unset!important;
			}
		`;
		// 将 CSS 规则添加到 style 元素的文本内容中
		styleElement.textContent = cssRules;
		// 将 style 元素插入到 head 部分
		document.head.appendChild(styleElement);
	}, [setting])

	const hidePanelTemporarily = () => {
		if (!isHidePanel) {
			setIsHidePanelTemporarily(true)
		}
	}

	const showPanelTemporarily = () => {
		if (!isHidePanel) {
			setIsHidePanelTemporarily(false)
		}
	}

	const toggleHidePanel = () => setIsHidePanel(!isHidePanel)

	const getShortcutText = (key, isBottom = false) => {
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
		let text = `Ctrl + Shift + ${key.toUpperCase()}`
		if (isMac) {
			text = `Ctrl + ${key.toUpperCase()}`
		}
		return <span className={`italic scale-90 origin-${isBottom ? 'bottom' : 'center'} rounded-[6px] p-[1px_6px] bg-[rgba(81,81,81,83%)] shadow-[2px_2px_6px_3px_rgba(158,157,157,27%)] inline-block opacity-90`}>{text}</span>
	}

	return (
		<div className={`fixed top-[108px] right-[40px] w-[400px]`}>
			<div
				className={`mainPanel ${isDark ? 'dark' : ''}`}
				style={{
					position: 'absolute',
					right: '0',
					padding:'0 12px 10px',
					background: isDark ? '#1c1c1c' : '#fff',
					borderRadius: '14px',
					boxShadow: isDark ? '0 0 6px 3px rgb(0 0 0 / 27%)' : '0 0 6px 3px rgb(233 233 233 / 27%)',
					border: isDark ? 'solid 1px rgb(65 65 65 / 47%)' : 'solid 1px rgb(211 211 211 / 47%)',
					opacity: (isHidePanel || isHidePanelTemporarily) ? setting.tempOpacity : 1,
					paddingTop: `${!setting.isShowSetting && !setting.isShowOpacity && !setting.isShowStatus && setting.dragArea === 'total' ? '12px' : '18px'}`
			}}>
				<div id="searchWhateverPopup" ref={popContainerRef}>
					{
						setting.dragArea === 'bar' &&
						<div className="flex justify-center absolute top-[7px] left-0 right-0 m-auto z-10 w-full">
							<div className="searchWhateverMoveHandler w-[50px] h-[3px] bg-[#888888] rounded opacity-30 transition-all duration-300 cursor-move hover:w-20 hover:opacity-100 relative before:content-[''] before:px-5 before:py-1 before:w-full before:absolute before:-top-1 before:h-[3px] before:box-content before:-left-5 before:-left-[20px]"/>
						</div>
					}
					<div className="flex items-center justify-between h-[24px] border-b-1 border-[#f5f5f5] mb-1">
						<FrameList tabIndex={'0'} frames={[{frameId: '0'}, { frameId: '1' }, { frameId: '2' }]} total={[{frameId: '0', sum: 3}]} />
						<div id="searchwhatever_result" className="text-xs flex items-center select-none text-[#333] justify-end">
							<div className="inline-flex items-center absolute right-[12px] top-[6px] gap-[6px]">
								{
									setting.isShowStatus &&
									<div className="flex items-center text-xs text-[#a0a0a0] cursor-grabbing opacity-60">
										<div className="inline-flex items-center scale-[0.8] origin-right text-xs cursor-grabbing text-[#a0a0a0]">
											<HiddenSvg className="mr-1 w-[14px] h-[14px]" />
											{i18n('已隐藏')}
										</div>
									</div>
								}
								{
									setting.isShowOpacity &&
									<div className="flex items-center text-xs text-[#a0a0a0] cursor-grab opacity-80 active:cursor-grabbing z-30" onMouseEnter={hidePanelTemporarily} onMouseLeave={showPanelTemporarily} onClick={toggleHidePanel}>
										<OpacitySvg />
									</div>
								}
								{
									setting.isShowSetting &&
									<div className="flex items-center text-xs text-[#a0a0a0] cursor-pointer opacity-80 z-30">
										<SettingSvg className="w-[11px] h-[11px]" />
									</div>
								}
							</div>
							{
								setting.isShowResultText &&
								<>
									<div className="flex items-center cursor-grab shrink-0 active:cursor-grabbing hover:text-[var(--swe-color-primary)] dark:text-[#b7b4b4] dark:hover:text-[var(--swe-color-primary)] transition-colors">
										<div className="scale-90 origin-right">{i18n('查找结果')}</div>
										<CopySvg className="w-2.5 h-2.5 ml-[1px]" />
									</div>
									<span className="dark:text-[#ddd]">：</span>
								</>
							}
							<span id="__swe_current" className="mr-1 inline-block min-w-[15px] text-right shrink-0 monofont shadowText dark:text-[#ddd]">1</span><span className="dark:text-[#ddd]"> / </span><span className="ml-1 inline-block min-w-[15px] text-left shrink-0 monofont shadowText dark:text-[#ddd]" id="__swe_total">3</span>
						</div>
					</div>
					<div className="flex items-center w-full">
						<div className="swe_search relative w-full">
							{
								setting.isShowHistory &&
								<>
									<Dropdown
										arrow={true}
										placement='bottomLeft'
										trigger={[setting.openHistoryMode]}
										align={{offset: [-8, 0]}}
										menu={{
											items: recentList.map((r, i) => ({
												key: i,
												label:
													<div className="relative pr-[32px] group">
														<div className="w-[128px] h-5 text-ellipsis whitespace-nowrap overflow-hidden dark:text-[#fff]">{r}</div>
														<div
															className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
															<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popContainerRef.current} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('填入并开启正则模式')}</div>}>
																<div className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2] dark:text-[#b0b0b0] dark:hover:bg-[#2c2c2c]">.*</div>
															</Tooltip>

															<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popContainerRef.current} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('固定之')}</div>}>
																<div
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
																		<div className="max-w-10 h-5 text-ellipsis whitespace-nowrap overflow-hidden dark:text-[#fff]">{r}</div>
																		<div
																			className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
																			<Tooltip arrowPointAtCenter={true} placement="top"
																					 getPopupContainer={() => popContainerRef.current}
																					 align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('填入并开启正则模式')}</div>}>
																				<div className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2] dark:text-[#b0b0b0] dark:hover:bg-[#2c2c2c]">.*</div>
																			</Tooltip>

																			<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popContainerRef.current} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('取消固定')}</div>}>
																				<div
																					className="flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[rgba(216,30,6,0.1)] ">
																					<UnFixSvg className="w-3 h-3" />
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
													<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer !inline-flex items-center justify-center">
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
										getPopupContainer={() => popContainerRef.current}
									>
										<div className="absolute top-0 left-0 h-[36px]">
											<SearchSvg className="absolute left-[5px] top-0 bottom-0 p-1 box-content m-auto w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2] dark:*:fill-[#fff] dark:hover:bg-[#353535]" />
											<DownSvg className="absolute w-[8px] h-[8px] left-[24px] top-[14px] z-10 cursor-pointer" />
										</div>
									</Dropdown>
								</>
							}

							<Input
								id="swe_searchInput"
								placeholder="输入文本以查找"
								value="乙己"
								readOnly
								className={setting.isShowHistory ? '' : 'pl-[8px]'}
								isShowRing={setting.isShowRing ?? true}
								ringColor={setting.ringColor ?? '#3b82f6'}
								textWidth={setting.textWidth}
							>
								<div className="flex items-center bg-white dark:bg-[rgba(58,58,58,0.9)] rounded-lg p-0.5 absolute right-[6px] top-[6px]">
									<ClearSvg className="absolute -left-[18px] w-3 h-3 opacity-25 hover:opacity-45 cursor-pointer dark:*:fill-[#fff]" />
									<Button type="text" className="w-5 !h-5 min-w-5 cursor-pointer rounded-[6px] !inline-flex items-center justify-center">
										<UpArrowSvg className="w-3.5 h-3.5 dark:*:fill-[#fff]" />
									</Button>
									<Button type="text" className="w-5 !h-5 min-w-5 ml-1 cursor-pointer rounded-[6px] !inline-flex items-center justify-center">
										<DownArrowSvg className="w-3.5 h-3.5 dark:*:fill-[#fff]" />
									</Button>
									<div className="w-[1px] h-3.5 bg-[#dfdfdf] mx-1.5"></div>
									<Tooltip
										arrowPointAtCenter={true}
										placement="bottom"
										getPopupContainer={(e) => e.parentElement}
										title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('大小写敏感')} {getShortcutText('c', true)}</div>}
									>
										<button className="normalButton activeButton dark:bg-[#383838] dark:text-[#fff]">
											<span className="text-xs select-none">Cc</span>
										</button>
									</Tooltip>
									<Tooltip
										arrowPointAtCenter={true}
										placement="bottom"
										getPopupContainer={(e) => e.parentElement}
										title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('匹配单词')} {getShortcutText('w', true)}</div>}
									>
										<button className="normalButton dark:bg-[#383838] dark:text-[#fff]">
											<span className="text-xs select-none">W</span>
										</button>
									</Tooltip>
									<Tooltip
										arrowPointAtCenter={true}
										placement="bottom"
										getPopupContainer={(e) => e.parentElement}
										title={
											<div className="scale-90" style={{ padding: '4px 0' }}>
												<div>{i18n('正则表达式')} {getShortcutText('r')}</div>
												<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{i18n('为了避免输入正则表达式的过程中卡死，开启此选项后的输入防抖会持续数秒')}</div>
											</div>
										}
									>
										<button
											className="normalButton dark:bg-[#383838] dark:text-[#fff]"
										>
											<span className="text-xs select-none">.*</span>
										</button>
									</Tooltip>
									<Tooltip
										arrowPointAtCenter={true}
										placement="bottomRight"
										getPopupContainer={(e) => e.parentElement}
										title={(
											<div className="scale-90" style={{ padding: '4px 0' }}>
												<div>{i18n('实时监测 DOM 变化')} {getShortcutText('d')}</div>
												<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{i18n('在不适合实时监测的情况下请临时关闭此功能')}</div>
											</div>
										)}
									>
										<div className={`w-5 h-5 justify-center rounded-[6px] select-none inline-flex items-center cursor-pointer ml-1`}>
											<svg className="w-4 h-4 will-change-transform" viewBox="0 0 1024 1024" version="1.1"
												 xmlns="http://www.w3.org/2000/svg" width="32" height="32">
												<path
													d="M432.877037 518.755668a88.046876 88.046876 0 0 0 175.973139 0 85.755245 85.755245 0 0 0-10.734482-42.093643l353.031788-180.918238a21.951413 21.951413 0 0 0 12.061216-14.111623 24.122432 24.122432 0 0 0-1.567958-18.333048c-31.359161-59.341182-82.619329-116.631957-152.212544-170.063143S649.978922 8.325013 546.252466 0.123386a22.554474 22.554474 0 0 0-18.333048 6.513057A24.122432 24.122432 0 0 0 520.320852 24.245818v406.462974a88.2881 88.2881 0 0 0-87.443815 88.046876z m88.046876 39.922624A39.922624 39.922624 0 1 1 560.846537 518.755668a39.802012 39.802012 0 0 1-39.922624 39.922624z"
													className="fill-[#444] dark:fill-[#ababab]" />
												<path
													d="M253.285533 358.100273a312.626715 312.626715 0 0 0 267.035319 473.402722 334.095679 334.095679 0 0 0 76.106272-9.166524 312.867939 312.867939 0 0 0 227.836367-378.963402 24.122432 24.122432 0 0 0-10.975706-14.714684 24.122432 24.122432 0 0 0-35.459975 26.655288 264.502464 264.502464 0 1 1-483.654755-72.367296 261.004711 261.004711 0 0 1 162.464577-119.888485 23.157534 23.157534 0 0 0 14.714684-10.975707 24.122432 24.122432 0 0 0-8.322239-32.927119 24.122432 24.122432 0 0 0-18.212436-2.532855A307.922841 307.922841 0 0 0 253.285533 358.100273z"
													className="fill-[#444] dark:fill-[#ababab]" />
												<path
													d="M1015.916211 413.220029a24.122432 24.122432 0 0 0-10.131421-15.07652 24.122432 24.122432 0 0 0-17.971212-3.618364 24.122432 24.122432 0 0 0-15.197132 10.131421 23.157534 23.157534 0 0 0-3.618364 17.971212A464.598035 464.598035 0 1 1 423.710513 54.157633a24.122432 24.122432 0 0 0 15.317744-10.010809 24.122432 24.122432 0 0 0 3.618365-17.971212 24.122432 24.122432 0 0 0-10.131422-15.317744 24.122432 24.122432 0 0 0-17.971211-3.618364 511.878001 511.878001 0 0 0-326.497113 217.101885 512.239837 512.239837 0 0 0 138.100921 711.611735 510.310043 510.310043 0 0 0 285.609592 88.046876 522.491871 522.491871 0 0 0 98.781357-9.769585 512.601674 512.601674 0 0 0 405.377465-601.010386z"
													className="fill-[#444] dark:fill-[#ababab]" />
												<path
													d="M567.842042 50.418656a429.982345 429.982345 0 0 1 211.674339 80.930759 511.395552 511.395552 0 0 1 126.763378 133.397047L566.877145 438.548582V50.418656z"
													fill="var(--swe-color-primary)" />
											</svg>
										</div>
									</Tooltip>
								</div>
							</Input>
						</div>
						{
							setting.isShowClose &&
							<div className="flex items-center">
								<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer">
									<CloseSvg className="icon w-2.5 h-2.5" />
								</Button>
							</div>
						}
					</div>
				</div>
			</div>
			<pre ref={textRef} className="mt-[110px] rounded-2xl p-[12px] bg-[#e8e8e88c] text-[14px] whitespace-pre-wrap select-none border-solid border-2 border-[#e1e1e1]">
				{text}
			</pre>

			<Alert message={i18n('设置项自动保存，但需要重新打开面板才能生效')} description={i18n('修改高亮样式后，可能需要刷新页面才能生效')} type="warning" showIcon />
			<div className="flex justify-end mt-2">
				<Button type="primary" danger shape="round" onClick={onReset}>
					<div className="px-[12px]">{i18n('重置设置项')}</div>
				</Button>
			</div>
		</div>
	)
}
