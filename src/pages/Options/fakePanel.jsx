import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Divider, Dropdown, Menu, Alert, Tooltip } from "antd";
import { Input } from "../../components/Input";
import { FrameList } from '../Content/Parts/FrameList';
import { i18n } from '../i18n';
import { SettingContext } from './Options'

export const FakePanel = (props) => {
	const { onReset } = props

	const [ isHidePanel, setIsHidePanel ] = useState(false) // 是否把面板半透明
	const [ isHidePanelTemporarily, setIsHidePanelTemporarily ] = useState(false) // 是否临时把面板半透明
	const [ recentList, setRecentList ] = useState(['ref', 'second', 'third'])
	const [ fixList, setFixList ] = useState(['first'])

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

	return (
		<div className="fixed top-[108px] right-[40px] w-[400px]">
			<div style={{ position: 'relative', width: '400px', padding:'18px 12px 10px', background: '#fff', borderRadius: '12px',boxShadow: '0px 0px 5px 0px rgba(0,0,0,.02),0px 2px 10px 0px rgba(0,0,0,.06),0px 0px 1px 0px rgba(0,0,0,.3),0px 0px 16px 1px rgba(233,233,233,0.58)', opacity: (isHidePanel || isHidePanelTemporarily) ? setting.tempOpacity : 1}}>
				<div id="searchWhateverPopup" ref={popContainerRef}>
					<div className="flex justify-center absolute top-[7px] left-0 right-0 m-auto z-10 w-full">
						<div className="searchWhateverMoveHandler w-[50px] h-[3px] bg-[#888888] rounded opacity-30 transition-all duration-300 cursor-move hover:w-20 hover:opacity-100 relative before:content-[''] before:px-5 before:py-1 before:w-full before:absolute before:-top-1 before:h-[3px] before:box-content before:-left-5 before:-left-[20px]"/>
					</div>
					<div className="flex items-center justify-between h-[24px] border-b-1 border-[#f5f5f5] mb-1">
						<FrameList tabIndex={'0'} frames={[{frameId: '0'}, { frameId: '1' }, { frameId: '2' }]} total={[{frameId: '0', sum: 3}]} />
						<div id="searchwhatever_result" className="text-xs flex items-center select-none text-[#333] justify-end">
							<div className="inline-flex items-center absolute right-[12px] top-[6px] gap-[6px]">
								<div className="flex items-center text-xs text-[#a0a0a0] cursor-grabbing opacity-60">
									<div className="inline-flex items-center scale-[0.8] origin-right text-xs cursor-grabbing text-[#a0a0a0]">
										<svg className="mr-1 w-[14px] h-[14px]" viewBox="0 0 1024 1024" version="1.1"
											 xmlns="http://www.w3.org/2000/svg" width="200"
											 height="200">
											<path
												d="M764.394366 588.97307c-93.111887 0-170.503211 64.930254-190.69476 151.667381-47.118423-20.148282-90.861972-14.552338-123.399212-0.562479C429.546366 653.340845 352.155042 588.97307 259.605634 588.97307c-108.255549 0-196.305127 87.862085-196.305127 195.886874C63.300507 892.87031 151.350085 980.732394 259.605634 980.732394c103.207662 0 186.771831-79.468169 194.61769-180.209577 16.831099-11.754366 61.151549-33.575662 115.553352 1.124958C578.747493 901.826704 661.749183 980.732394 764.394366 980.732394c108.255549 0 196.305127-87.862085 196.305127-195.87245 0-108.024789-88.049577-195.886873-196.305127-195.886874z m-504.788732 55.959437c77.405746 0 140.215887 62.694761 140.215887 139.927437 0 77.232676-62.810141 139.898592-140.215887 139.898591-77.405746 0-140.215887-62.665915-140.215888-139.898591 0-77.232676 62.810141-139.927437 140.215888-139.927437z m504.788732 0c77.405746 0 140.215887 62.694761 140.215888 139.927437 0 77.232676-62.810141 139.898592-140.215888 139.898591-77.405746 0-140.215887-62.665915-140.215887-139.898591 0-77.232676 62.810141-139.927437 140.215887-139.927437zM1016.788732 475.943662H7.211268v57.690141h1009.577464v-57.690141zM697.675718 77.016338c-11.538028-26.249014-41.334986-40.094648-69.011831-30.907493L512 85.294873l-117.226366-39.186028-2.769127-0.836507c-27.806648-7.687211-57.026704 7.355493-67.338817 34.426592L196.78107 418.253521h630.43786L698.771831 79.69893l-1.096113-2.682592z"
												fill="#a0a0a0"/>
										</svg>
										{i18n('已隐藏')}
									</div>
								</div>
								<div className="flex items-center text-xs text-[#a0a0a0] cursor-grab opacity-80 active:cursor-grabbing z-30" onMouseEnter={hidePanelTemporarily} onMouseLeave={showPanelTemporarily} onClick={toggleHidePanel}>
									<svg t="1749795998566" viewBox="0 0 1024 1024" version="1.1"
										 xmlns="http://www.w3.org/2000/svg" width="12" height="12">
										<path
											d="M469.333333 681.386667c-36.053333-2.432-71.253333-8.533333-104.96-17.92l-69.802666 149.674666a42.368 42.368 0 0 1-56.533334 20.266667 42.666667 42.666667 0 0 1-20.821333-56.32l66.986667-143.658667a451.712 451.712 0 0 1-148.906667-112.682666 388.693333 388.693333 0 0 1-70.570667-119.338667 42.666667 42.666667 0 1 1 80.128-29.354667 303.445333 303.445333 0 0 0 55.210667 93.098667C270.634667 547.413333 383.018667 597.333333 505.728 597.333333c122.752 0 235.136-49.962667 305.706667-132.181333a303.445333 303.445333 0 0 0 55.210666-93.098667 42.666667 42.666667 0 0 1 80.128 29.354667 388.693333 388.693333 0 0 1-70.570666 119.338667 423.68 423.68 0 0 1-18.773334 20.48l104.362667 104.362666a42.666667 42.666667 0 0 1-0.298667 60.032 42.368 42.368 0 0 1-60.032 0.298667l-109.653333-109.653333c-20.48 14.08-42.24 26.581333-65.024 37.418666l66.901333 143.36a42.666667 42.666667 0 0 1-20.821333 56.362667 42.368 42.368 0 0 1-56.533333-20.266667l-69.717334-149.546666a520.533333 520.533333 0 0 1-91.946666 16.810666v130.645334A42.666667 42.666667 0 0 1 512 853.333333c-23.722667 0-42.666667-18.944-42.666667-42.24v-129.706666z"
											fill="#388CFF"></path>
										<path
											d="M176.128 524.373333a42.368 42.368 0 0 1 60.032 0.256 42.666667 42.666667 0 0 1 0.298667 60.074667l-121.216 121.216a42.368 42.368 0 0 1-60.074667-0.298667 42.666667 42.666667 0 0 1-0.298667-60.032l121.258667-121.258666z"
											fill="#388CFF"></path>
									</svg>
								</div>
								{
									setting.isShowSetting &&
									<div className="flex items-center text-xs text-[#a0a0a0] cursor-pointer opacity-80 z-30">
										<svg className="w-3 h-3" viewBox="0 0 1024 1024" version="1.1"
											 xmlns="http://www.w3.org/2000/svg" width="200" height="200">
											<path
												d="M512.25928 704c-108.8 0-192-83.2-192-192s83.2-192 192-192 192 83.2 192 192-83.2 192-192 192z m0-320c-70.4 0-128 57.6-128 128s57.6 128 128 128 128-57.6 128-128-57.6-128-128-128z"
												fill="#333333"></path>
											<path
												d="M640.25928 1024H384.25928c-19.2 0-32-12.8-32-32v-121.6c-25.6-12.8-51.2-25.6-70.4-38.4l-102.4 64c-12.8 6.4-32 6.4-44.8-12.8l-128-224C-6.14072 640 0.25928 620.8 19.45928 614.4l102.4-64v-76.8l-102.4-64C0.25928 403.2-6.14072 384 6.65928 364.8l128-224c6.4-12.8 25.6-19.2 44.8-6.4l102.4 64c19.2-12.8 44.8-32 70.4-38.4V32c0-19.2 12.8-32 32-32h256c19.2 0 32 12.8 32 32v121.6c25.6 12.8 51.2 25.6 70.4 38.4l102.4-64c12.8-6.4 32-6.4 44.8 12.8l128 224c12.8 19.2 6.4 38.4-12.8 44.8l-102.4 64v76.8l102.4 64c12.8 6.4 19.2 25.6 12.8 44.8l-128 224c-6.4 12.8-25.6 19.2-44.8 12.8l-102.4-64c-19.2 12.8-44.8 32-70.4 38.4V992c0 19.2-12.8 32-32 32z m-224-64h192v-108.8c0-12.8 6.4-25.6 19.2-32 32-12.8 64-32 89.6-51.2 12.8-6.4 25.6-6.4 38.4 0l96 57.6 96-166.4-96-57.6c-12.8-12.8-19.2-25.6-12.8-38.4 0-19.2 6.4-32 6.4-51.2s0-32-6.4-51.2c0-12.8 6.4-25.6 12.8-32l96-57.6-96-166.4-96 57.6c-12.8 6.4-25.6 6.4-38.4 0-25.6-19.2-57.6-38.4-89.6-51.2-12.8-12.8-19.2-25.6-19.2-38.4V64H416.25928v108.8c0 12.8-6.4 25.6-19.2 32-32 12.8-64 32-89.6 51.2-12.8 6.4-25.6 6.4-38.4 0l-96-51.2-96 166.4 96 57.6c12.8 6.4 19.2 19.2 12.8 32 0 19.2-6.4 32-6.4 51.2 0 19.2 0 32 6.4 51.2 6.4 12.8 0 25.6-12.8 32l-96 57.6 96 166.4 96-57.6c12.8-6.4 25.6-6.4 38.4 0 25.6 19.2 57.6 38.4 89.6 51.2 12.8 6.4 19.2 19.2 19.2 32V960z"
												fill="#333333"></path>
										</svg>
									</div>
								}
							</div>
							<div className="flex items-center cursor-grab shrink-0 active:cursor-grabbing hover:text-[#3aa9e3] transition-colors">
								<div className="scale-90 origin-right">{i18n('查找结果')}</div>
								<svg className="w-2.5 h-2.5 ml-[1px]" fill="#3aa9e3" viewBox="64 64 896 896" version="1.1" xmlns="http://www.w3.org/2000/svg">
									<path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
								</svg>
							</div>
							：<span id="__swe_current" className="mr-1 inline-block min-w-[15px] text-right shrink-0 monofont shadowText">1</span> / <span className="ml-1 inline-block min-w-[15px] text-left shrink-0 monofont shadowText" id="__swe_total">3</span>
						</div>
					</div>
					<div className="flex items-center w-full">
						<div className="swe_search relative">
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
												<div className="w-[128px] h-5 text-ellipsis whitespace-nowrap overflow-hidden">{r}</div>
												<div
													className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
													<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popContainerRef.current} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('填入并开启正则模式')}</div>}>
														<div className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2]">.*</div>
													</Tooltip>

													<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popContainerRef.current} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('固定之')}</div>}>
														<div
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
												<div className="font-bold pl-[10px] pt-[10px] select-none">{i18n('固定')}</div>
												<Menu
													style={{boxShadow: 'none'}}
													items={fixList.map((r, i) => ({
														key: i,
														label:
															<div className="relative pr-[32px] group">
																<div className="max-w-10 h-5 text-ellipsis whitespace-nowrap overflow-hidden">{r}</div>
																<div
																	className="hidden group-hover:flex items-center absolute -right-[4px] top-[2px]">
																	<Tooltip arrowPointAtCenter={true} placement="top"
																			 getPopupContainer={() => popContainerRef.current}
																			 align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('填入并开启正则模式')}</div>}>
																		<div className="flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2]">.*</div>
																	</Tooltip>

																	<Tooltip arrowPointAtCenter={true} placement="top" getPopupContainer={() => popContainerRef.current} align={{offset: [0, 4]}} title={<div className="scale-90 p-1">{i18n('取消固定')}</div>}>
																		<div
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
										<div className="flex items-center justify-between pl-[10px] pr-[10px] pt-[10px] h-[20px] box-content">
											<div className="font-bold w-[128px] select-none">{i18n('最近')}</div>
											<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer !inline-flex items-center justify-center">
												<svg className="w-[16px] h-[16px] cursor-pointer" viewBox="0 0 1024 1024"
													 version="1.1" xmlns="http://www.w3.org/2000/svg"
													 width="200" height="200" fill="#f35a5a">
													<path d="M764 208H656v-56H368v56H152v56h80v580a28 28 0 0 0 28 28h504a28 28 0 0 0 28-28V264h80v-56H764zM736 816H288V264h448v552z"></path>
													<path d="M392 368h56v360h-56zM576 368h56v360h-56z"></path>
												</svg>
											</Button>
										</div>
										<div className="smallScroll max-h-[160px] overflow-auto overscroll-contain">
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
								<svg
									className="absolute left-[5px] top-0 bottom-0 p-1 box-content m-auto w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2]"
									viewBox="0 0 1024 1024" version="1.1"
									xmlns="http://www.w3.org/2000/svg" width="32" height="32"
									fill="#272636">
									<path d="M924.352 844.256l-163.968-163.968c44.992-62.912 71.808-139.648 71.808-222.72 0-211.776-172.224-384-384-384s-384 172.224-384 384 172.224 384 384 384c82.56 0 158.912-26.432 221.568-70.912l164.16 164.16c12.416 12.416 38.592 15.04 51.072 2.624l45.248-45.248c12.416-12.544 6.592-35.392-5.888-47.936zM128.128 457.568c0-176.448 143.552-320 320-320s320 143.552 320 320-143.552 320-320 320-320-143.552-320-320z"></path>
								</svg>
							</Dropdown>

							<svg className="absolute w-[8px] h-[8px] left-[24px] top-[14px] z-10"
								 viewBox="0 0 1024 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" p-id="7932" width="200" height="200">
								<path
									d="M500.2 721.4l1 1 424.2-424.2-56.6-56.6-369 369-368.6-368.7-56.6 56.6 424.2 424.3z"
									fill="#696969" p-id="7933"></path>
							</svg>

							<Input
								id="swe_searchInput"
								placeholder="输入文本以查找"
								value="乙己"
								readOnly
							>
								<div className="flex items-center bg-white rounded-lg p-0.5 absolute right-[6px] top-[6px]">
									<svg
										className="absolute -left-[18px] w-3 h-3 opacity-25 hover:opacity-45 cursor-pointer"
										viewBox="64 64 896 896" focusable="false" data-icon="close-circle"
										width="1em"
										height="1em" fill="currentColor" aria-hidden="true">
										<path
											d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
									</svg>
									<Button type="text"
											className="w-5 !h-5 min-w-5 cursor-pointer rounded-[6px] !inline-flex items-center justify-center">
										<svg className="w-3.5 h-3.5 peer/svg" viewBox="0 0 1024 1024"
											 version="1.1"
											 xmlns="http://www.w3.org/2000/svg" p-id="1466" width="32" height="32">
											<path
												d="M512.00988746 141.21142578c10.45623779 0 19.24145531 3.50024414 26.37542748 10.71331811l259.5421145 259.55200196C805.03668189 418.58105492 808.63085938 427.33660865 808.63085938 437.84228516c0 10.60949731-3.53485132 19.46887183-10.56994606 26.46936011-7.02026391 7.00543237-15.88952661 10.60949731-26.50891137 10.60949731-10.44140625 0-19.22167969-3.60900903-26.35565185-10.71331811L549.09863305 267.79370094V845.7097168c0 10.19915748-3.62384057 18.94976782-10.89624071 26.16284179-7.23284888 7.31195068-15.97357177 10.91601563-26.2122798 10.91601563-10.23376465 0-18.959656-3.60900903-26.22216796-10.91601563-7.24273705-7.21307397-10.87646508-15.96862769-10.87646508-26.16284179V267.79370094l-196.10760522 196.41906761C271.65484619 471.31213355 262.87951684 474.92114258 252.41833496 474.92114258c-10.61938477 0-19.45898438-3.60900903-26.4990232-10.60949731C218.86444068 457.31115699 215.36914062 448.45178247 215.36914062 437.84228516c0-10.50567651 3.55462623-19.26123023 10.69354248-26.36553931l259.53717042-259.55200196C492.7288816 144.71166992 501.52398658 141.21142578 511.97033691 141.21142578h0.03955055z"
												p-id="1467"></path>
										</svg>
									</Button>
									<Button type="text"
											className="w-5 !h-5 min-w-5 ml-1 cursor-pointer rounded-[6px] !inline-flex items-center justify-center">
										<svg t="1729650383779" className="w-3.5 h-3.5" viewBox="0 0 1024 1024"
											 version="1.1"
											 xmlns="http://www.w3.org/2000/svg" p-id="2570" width="32" height="32">
											<path
												d="M511.99011254 141.21142578c10.23376465 0 18.95471191 3.60900903 26.2122798 10.81713891 7.25262451 7.20812988 10.86657691 15.96862769 10.86657763 26.2666626v577.89129615l196.1619873-196.43884254c7.099365-7.00543237 15.90435815-10.61444068 26.34082031-10.61444139 10.61938477 0 19.43426538 3.50518822 26.51385474 10.51062059 7.04498291 7.10430908 10.54522705 15.96862769 10.54522706 26.57318092 0 10.40679908-3.54473877 19.16235352-10.69354248 26.37542748l-259.55694604 259.48278761C531.23156714 879.28833008 522.44635033 882.78857422 512.00988746 882.78857422c-10.45623779 0-19.24145531-3.50024414-26.3704834-10.71331811l-259.55200195-259.48278761C218.94848656 605.37939453 215.36914062 596.62384009 215.36914062 586.21704102c0-10.60949731 3.52496314-19.46887183 10.56994606-26.57318092C232.99395776 552.63842773 241.82861328 549.12829614 252.44799805 549.12829614c10.42163062 0 19.2167356 3.60900903 26.36553931 10.61444068l196.1125493 196.43884253V178.29522729c0-10.30297828 3.60900903-19.05853271 10.88635255-26.2666626C493.05517555 144.81549073 501.80084252 141.21142578 512.02966309 141.21142578h-0.03955055z"
												p-id="2571"></path>
										</svg>
									</Button>
									<div className="w-[1px] h-3.5 bg-[#dfdfdf] mx-1.5"></div>
									<Tooltip
										arrowPointAtCenter={true}
										placement="bottom"
										getPopupContainer={(e) => e.parentElement}
										title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('大小写敏感')}</div>}
									>
										<button className="normalButton">
											<span className="text-xs select-none">Cc</span>
										</button>
									</Tooltip>
									<Tooltip
										arrowPointAtCenter={true}
										placement="bottom"
										getPopupContainer={(e) => e.parentElement}
										title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('匹配单词')}</div>}
									>
										<button className="normalButton">
											<span className="text-xs select-none">W</span>
										</button>
									</Tooltip>
									<Tooltip
										arrowPointAtCenter={true}
										placement="bottom"
										getPopupContainer={(e) => e.parentElement}
										title={
											<div className="scale-90" style={{ padding: '4px 0' }}>
												<div>{i18n('正则表达式')}</div>
												<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{i18n('为了避免输入正则表达式的过程中卡死，开启此选项后的输入防抖会持续数秒')}</div>
											</div>
										}
									>
										<button
											className="normalButton"
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
												<div>{i18n('实时监测 DOM 变化')}</div>
												<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{i18n('在不适合实时监测的情况下请临时关闭此功能')}</div>
											</div>
										)}
									>
										<div
											className={`w-5 h-5 justify-center rounded-[6px] cursor-pointer select-none inline-flex items-center cursor-pointer ml-1`}
										>
											<svg className="w-4 h-4" viewBox="0 0 1025 1024" version="1.1"
												 xmlns="http://www.w3.org/2000/svg" p-id="2617" width="32" height="32">
												<path
													d="M432.877037 518.755668a88.046876 88.046876 0 0 0 175.973139 0 85.755245 85.755245 0 0 0-10.734482-42.093643l353.031788-180.918238a21.951413 21.951413 0 0 0 12.061216-14.111623 24.122432 24.122432 0 0 0-1.567958-18.333048c-31.359161-59.341182-82.619329-116.631957-152.212544-170.063143S649.978922 8.325013 546.252466 0.123386a22.554474 22.554474 0 0 0-18.333048 6.513057A24.122432 24.122432 0 0 0 520.320852 24.245818v406.462974a88.2881 88.2881 0 0 0-87.443815 88.046876z m88.046876 39.922624A39.922624 39.922624 0 1 1 560.846537 518.755668a39.802012 39.802012 0 0 1-39.922624 39.922624z"
													fill="#444444" p-id="2618"></path>
												<path
													d="M253.285533 358.100273a312.626715 312.626715 0 0 0 267.035319 473.402722 334.095679 334.095679 0 0 0 76.106272-9.166524 312.867939 312.867939 0 0 0 227.836367-378.963402 24.122432 24.122432 0 0 0-10.975706-14.714684 24.122432 24.122432 0 0 0-35.459975 26.655288 264.502464 264.502464 0 1 1-483.654755-72.367296 261.004711 261.004711 0 0 1 162.464577-119.888485 23.157534 23.157534 0 0 0 14.714684-10.975707 24.122432 24.122432 0 0 0-8.322239-32.927119 24.122432 24.122432 0 0 0-18.212436-2.532855A307.922841 307.922841 0 0 0 253.285533 358.100273z"
													fill="#444444" p-id="2619"></path>
												<path
													d="M1015.916211 413.220029a24.122432 24.122432 0 0 0-10.131421-15.07652 24.122432 24.122432 0 0 0-17.971212-3.618364 24.122432 24.122432 0 0 0-15.197132 10.131421 23.157534 23.157534 0 0 0-3.618364 17.971212A464.598035 464.598035 0 1 1 423.710513 54.157633a24.122432 24.122432 0 0 0 15.317744-10.010809 24.122432 24.122432 0 0 0 3.618365-17.971212 24.122432 24.122432 0 0 0-10.131422-15.317744 24.122432 24.122432 0 0 0-17.971211-3.618364 511.878001 511.878001 0 0 0-326.497113 217.101885 512.239837 512.239837 0 0 0 138.100921 711.611735 510.310043 510.310043 0 0 0 285.609592 88.046876 522.491871 522.491871 0 0 0 98.781357-9.769585 512.601674 512.601674 0 0 0 405.377465-601.010386z"
													fill="#444444" p-id="2620"></path>
												<path
													d="M567.842042 50.418656a429.982345 429.982345 0 0 1 211.674339 80.930759 511.395552 511.395552 0 0 1 126.763378 133.397047L566.877145 438.548582V50.418656z"
													fill="#50B3EA"></path>
											</svg>
										</div>
									</Tooltip>
								</div>
							</Input>
						</div>
						<div className="flex items-center">
							<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer">
								<svg className="icon w-2.5 h-2.5" viewBox="0 0 1024 1024" version="1.1"
									 xmlns="http://www.w3.org/2000/svg" width="32" height="32">
									<path
										d="M12.47232 12.51328C26.74688-1.76128 49.5104-2.90816 65.15712 9.84064l2.93888 2.70336L1009.664 955.37152c14.96064 14.80704 15.62624 38.76864 1.51552 54.38464-14.12096 15.616-38.02112 17.3568-54.26176 3.95264l-2.9696-2.70336L12.41088 68.17792c-15.34976-15.39072-15.31904-40.30464 0.06144-55.66464z m0 0"
										fill="red"/>
									<path
										d="M1009.67424 12.51328c-14.2848-14.27456-37.04832-15.42144-52.69504-2.67264l-2.99008 2.70336L12.41088 955.37152c-14.96064 14.80704-15.62624 38.76864-1.51552 54.38464 14.12096 15.616 38.02112 17.3568 54.25152 3.95264l2.9696-2.70336 941.568-942.82752c15.34976-15.38048 15.32928-40.30464-0.0512-55.66464h0.04096z m0 0"
										fill="red"/>
								</svg>
							</Button>
						</div>
					</div>
				</div>
			</div>
			<pre ref={textRef} className="mt-[20px] rounded-2xl p-[12px] bg-[#f1f1f1] text-[14px] whitespace-pre-wrap select-none">
				{text}
			</pre>

			<Alert message="设置项自动保存，但需要重新打开面板才能生效" description="修改高亮样式后，可能需要刷新页面才能生效" type="warning" showIcon />
			<div className="flex justify-end mt-2">
				<Button type="primary" danger shape="round" onClick={onReset}>
					<div className="px-[12px]">重置设置项</div>
				</Button>
			</div>
		</div>
	)
}
