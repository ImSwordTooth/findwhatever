import React, { useRef, useState, useEffect } from 'react'
import { Input } from '../../components/Input'
import { reCheckTree, closePop, observerAllExceptMe, doSearchOutside, useDebounce } from './features'
import { i18n } from '../i18n'
import { Tooltip, Button, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Rnd } from 'react-rnd'
import '../../output.css'
import { FrameList } from "./Parts/FrameList";
import { FindResult } from "./Parts/FindResult";
import { RecentList } from "./Parts/RecentList";
import { ExtraArea } from "./Parts/ExtraArea";
import * as motion from 'motion/react-client'
import ClearSvg from '../../assets/svg/clear.svg'
import UpArrowSvg from '../../assets/svg/upArrow.svg'
import DownArrowSvg from '../../assets/svg/downArrow.svg'
import LiveSvg from '../../assets/svg/live.svg'
import CloseSvg from '../../assets/svg/close.svg'

export const Pop = () => {
	const [ frames, setFrames ] = useState([])
	const [ searchValue, setSearchValue ] = useState('') // 搜索词
	const [ isMatchCase, setIsMatchCase ] = useState(false) // 是否大小写敏感
	const [ isWord, setIsWord ] = useState(false) // 是否为整个单词
	const [ isReg, setIsReg ] = useState(false) // 是否为正则模式
	const [ isLive, setIsLive ] = useState(false) // 是否实时监听DOM
	const [ current, setCurrent ] = useState(0) // 当前结果的下标
	const [ total, setTotal ] = useState([]) // 当前结果，格式为 { sum, frameId }
	const [ tabIndex, setTabIndex ] = useState('0') // tab 的key，值为 frame 的 id，默认为 0
	const [ isHidePanel, setIsHidePanel ] = useState(false) // 是否把面板半透明
	const [ isHidePanelTemporarily, setIsHidePanelTemporarily ] = useState(false) // 是否临时把面板半透明
	const [ isReady, setIsReady ] = useState(false)
	const [ recentList, setRecentList ] = useState([])
	const [ fixList, setFixList ] = useState([])
	const [ x, setX ] = useState(parseInt(window.innerWidth * 0.9 - 400))
	const [ y, setY ] = useState(parseInt(window.innerHeight * 0.1))
	const [ debounceDuration, setDebounceDuration ] = useState(200)
	const [ regexDebounceDuration, setRegexDebounceDuration ] = useState(1000)
	const [ sweSetting, setSweSetting ] = useState({})

	const {debouncedValue, isDebounceOk} = useDebounce(searchValue, isReg ? regexDebounceDuration : debounceDuration)


	const popContainerRef = useRef(null)
	const searchInputRef = useRef(null)

	useEffect(() => {

		const init = async () => {
			const [ sessionStorage, syncStorage ] = await Promise.all([
				chrome.storage.session.get(['frames']),
				chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive', 'x', 'y', 'recent', 'fix', 'swe_setting'])
			])
			setFrames(sessionStorage.frames)
			setSearchValue(syncStorage.searchValue)
			setIsMatchCase(syncStorage.isMatchCase)
			setIsWord(syncStorage.isWord)
			setIsReg(syncStorage.isReg)
			setIsLive(syncStorage.isLive)
			setX(syncStorage.x || parseInt(window.innerWidth * 0.9 - 400))
			setY(syncStorage.y || parseInt(window.innerHeight * 0.1))
			setRecentList(syncStorage.recent || [])
			setFixList(syncStorage.fix || [])
			setDebounceDuration(syncStorage.swe_setting?.debounceDuration || 200)
			setRegexDebounceDuration(syncStorage.swe_setting?.regexDebounceDuration || 2000)
			setSweSetting(syncStorage.swe_setting || { tempOpacity: 0.3 })
			setIsReady(true)

			if (window.innerHeight < syncStorage.y + 94 || window.innerWidth < syncStorage.x + 400) { // 如果在当前视口不能完全显示，临时重置位置(右下)
				setX(parseInt(window.innerWidth * 0.9 - 400))
				setY(parseInt(window.innerHeight * 0.1))

				if (window.screen.height < syncStorage.y + 94 || window.screen.width < syncStorage.x + 400) { // 继续判断，如果在当前设备都不能完全显示，重置位置
					chrome.storage.sync.remove(['x', 'y'])
				}
			} else if (syncStorage.y < 0 || syncStorage.x < 0) { // 如果在当前视口不能完全显示(左上)，重置位置并直接删除存储
				setX(parseInt(window.innerWidth * 0.9 - 400))
				setY(parseInt(window.innerHeight * 0.1))
				chrome.storage.sync.remove(['x', 'y'])
			} else { // 如果能完全显示，就使用用户上次保存的位置
				setX(syncStorage.x || parseInt(window.innerWidth * 0.9 - 400))
				setY(syncStorage.y || parseInt(window.innerHeight * 0.1))
			}

			window.__swe_observer = new MutationObserver((mutationsList, observer) => {
				// 遍历 mutationsList 数组，处理每个变化
				// for (const mutation of mutationsList) {
				// 	console.log(mutation.type); // 输出变化类型
				// 	console.log(mutation.target); // 输出发生变化的节点
				// }

				// 重新生成节点树
				reCheckTree().then(() => {
					doSearchOutside(true, (response) => {
						setCurrent(response.current)
						setTotal(response.total)
					}) // 然后执行搜索
				})
			})
		}

		window.addEventListener('message', handleMessage)

		init()


		return () => {
			window.removeEventListener('message', handleMessage)
		}
	}, []);

	useEffect(() => {
		// 防止输入时触发页面的全局快捷键
		const pressedKeys = new Set();

		// 检测操作系统
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
					 navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

		const handleKeyDown = (e) => {
			if (e.target.parentElement?.id === "__swe_container") {

				// 根据操作系统判断快捷键组合
				const isValidModifier = isMac ?
					(e.ctrlKey && !e.shiftKey) : // macOS: Ctrl (不包含Shift)
					(e.ctrlKey && e.shiftKey);   // 其他系统: Ctrl + Shift

				if (isValidModifier && !e.repeat) {
					const keyId = `${e.ctrlKey}-${e.shiftKey}-${e.key.toLowerCase()}`;

					if (!pressedKeys.has(keyId)) {
						pressedKeys.add(keyId);

						if (e.key === "c" || e.key === "C") {
							e.preventDefault();
							e.stopPropagation();
							handleIsMatchCaseChange();
							return;
						}
						if (e.key === "w" || e.key === "W") {
							e.preventDefault();
							e.stopPropagation();
							handleIsWordChange();
							return;
						}
						if (e.key === "d" || e.key === "D") {
							e.preventDefault();
							e.stopPropagation();
							handleIsLiveChange();
							return;
						}
						if (e.key === "r" || e.key === "R") {
							e.preventDefault();
							e.stopPropagation();
							handleIsRegChange();
							return;
						}
					}
				}
				if (!["Escape", "Shift", "Enter"].includes(e.key)) {
					e.stopPropagation();
				}
			}
		};

		const handleKeyUp = (e) => {
			const keyId = `${e.ctrlKey}-${e.shiftKey}-${e.key.toLowerCase()}`;
			pressedKeys.delete(keyId);
		};

		const handleKeyPress = (e) => {
			if (e.target.parentElement?.id === "__swe_container") {
				if (!["Escape", "Shift", "Enter"].includes(e.key)) {
					e.stopPropagation();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown, true);
		window.addEventListener("keypress", handleKeyPress, true);
		window.addEventListener("keyup", handleKeyUp, true);
		return () => {
			window.removeEventListener("keydown", handleKeyDown, true);
			window.removeEventListener("keypress", handleKeyPress, true);
			window.removeEventListener("keyup", handleKeyUp, true);
		};
	}, [isMatchCase, isWord, isReg, isLive]);

	// isLive 变更后，更新监听器
	useEffect(() => {
		if (!isReady) {
			return
		}
		if (isLive) {
			observerAllExceptMe()
		} else {
			window.__swe_observer?.disconnect()
		}
	}, [isLive]);

	useEffect(() => {
		chrome.storage.sync.set({ recent: recentList, fix: fixList })
	}, [recentList, fixList]);

	useEffect(() => {
		if (!isReady) {
			return
		}
		chrome.storage.sync.set({ isWord, isMatchCase, isReg, isLive }, () => {
			chrome?.runtime?.sendMessage({
				action: 'search',
				data: {
					searchValue,
					isWord,
					isMatchCase,
					isReg,
					isLive
				}
			})
		})

	}, [isWord, isMatchCase, isReg, isLive]);

	useEffect(() => {
		if (!isReady) {
			return
		}
		chrome.storage.sync.set({ searchValue: debouncedValue }, () => {
			chrome?.runtime?.sendMessage({
				action: 'search',
				data: {
					searchValue: debouncedValue,
					isWord,
					isMatchCase,
					isReg,
					isLive
				}
			})
		})

	}, [debouncedValue]);

	// pop再次出现时，自动选中文本，方便直接下一轮直接输入关键字检索
	useEffect(() => {
		if (isReady && searchInputRef.current) {
			setTimeout(() => {
				if (searchInputRef.current) {
					searchInputRef.current.select();
				}
			}, 10);
		}
	}, [isReady]);

	const handleMessage = async (e) => {
		if (e.data.type === 'swe_updateSearchResult') {
			setCurrent(e.data.data.current)
			setTotal(e.data.data.total)
		}
		if (e.data.type === 'swe_updateSettings') {
			const [ sessionStorage, syncStorage ] = await Promise.all([
				chrome.storage.session.get(['frames']),
				chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive'])
			])
			setFrames(sessionStorage.frames)
			setSearchValue(syncStorage.searchValue)
			setIsMatchCase(syncStorage.isMatchCase)
			setIsWord(syncStorage.isWord)
			setIsReg(syncStorage.isReg)
			setIsLive(syncStorage.isLive)
		}
	}

	const handleSearchValueChange = (e) => {
		const value = e.target.value
		setSearchValue(value)
	}

	const handleEnter = e => {
		if (e.key === 'Enter') {
			if (e.shiftKey) {
				goPrev()
			} else {
				goNext()
			}
		}
		if (e.key === 'Escape') {
			closePop()
		}
	}

	const handleIsMatchCaseChange = () => setIsMatchCase(!isMatchCase)
	const handleIsWordChange = () => setIsWord(!isWord)
	const handleIsRegChange = () => setIsReg(!isReg)
	const handleIsLiveChange = () => setIsLive(!isLive)

	const goPrev = async () => {
		let { activeResult, resultSum } = await chrome.storage.session.get(['activeResult', 'resultSum']);
		const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
		activeResult = activeResult || 0;
		activeResult--;
		if (activeResult <= 0) {
			activeResult = sum
		}
		await chrome.storage.session.set({ activeResult: activeResult}, () => {
			let temp = 0
			for (let i in resultSum) {
				temp += resultSum[i].sum
				if (activeResult <= temp) {
					setTabIndex(resultSum[i].frameId.toString())
					break;
				}
			}

			addToRecent()
			setCurrent(activeResult)
		})
	}

	const goNext = async () => {
		let { activeResult, resultSum } = await chrome.storage.session.get(['activeResult', 'resultSum']);
		const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
		if (sum === 0) {
			return;
		}
		activeResult = activeResult || 0;
		activeResult++;
		if (activeResult > sum) {
			activeResult = 1
		}
		chrome.storage.session.set({ activeResult: activeResult}, () => {
			let temp = 0
			for (let i in resultSum) {
				temp += resultSum[i].sum
				if (activeResult <= temp) {
					setTabIndex(resultSum[i].frameId.toString())
					break;
				}
			}

			addToRecent()
			setCurrent(activeResult)
		})
	}

	const clearInput = () => {
		chrome.storage.sync.set({ searchValue: '' }).then(() => {
			setSearchValue('')
			searchInputRef.current.focus()
		})
	}

	const handleDragStop = (e, d) => {
		setX(d.x)
		setY(d.y)
		chrome.storage.sync.set({ x: d.x, y: d.y })
	}

	const addToRecent = () => {
		if (!searchValue) {
			return
		}
		const newRecent = recentList.slice()
		if (!newRecent.includes(searchValue)) { // 没有就直接新增
			newRecent.unshift(searchValue)
			if (newRecent.length > 50) { // 不超过50条
				newRecent.shift()
			}
		} else { // 有就提到最新
			const index = newRecent.findIndex(r => r === searchValue);
			if (index > 0) {
				newRecent.unshift(newRecent.splice(index, 1)[0])
			}
		}
		setRecentList(newRecent)
	}

	const fillSearchValue = (e, text, isReg = undefined) => {
		e.stopPropagation()
		setSearchValue(text)
		if (isReg) {
			setIsReg(true)
		}
	}

	const getShortcutText = (key, isBottom = false) => {
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
		let text = `Ctrl + Shift + ${key.toUpperCase()}`
		if (isMac) {
			text = `Ctrl + ${key.toUpperCase()}`
		}
		return <span className={`italic scale-90 origin-${isBottom ? 'bottom' : 'center'} text-[#ffd700] inline-block opacity-90`}>{text}</span>
	}

	return (
		<div className="fixed z-[10000] top-0 left-0">
			{
				isReady &&
				<Rnd
					dragHandleClassName={sweSetting.dragArea === 'total' ? '' : 'searchWhateverMoveHandler'}
					onDragStop={handleDragStop}
					cancel="#swe_searchInput"
					position={{ x, y }}
					bounds='window'
					enableResizing={false}
					enableUserSelectHack={true}
					style={{
						transition: 'opacity 0.3s ease',
						opacity: isHidePanel ? sweSetting.tempOpacity : (isHidePanelTemporarily ? sweSetting.tempOpacity : 1)
					}}
				>
					<motion.div initial={{ opacity: 0, scale: 0.7,  }}
								animate={{ opacity: 1, scale: 1, }}
								transition={{
									type: "spring",
									duration: 0.3
								}}
								className={`mainPanel ${sweSetting.isUseGlassEffect ? 'glass' : ''} ${!sweSetting.isShowSetting && !sweSetting.isShowOpacity && !sweSetting.isShowStatus && sweSetting.dragArea === 'total' ? 'lessPT' : ''}`}
					>
						<div id="searchWhateverPopup" ref={popContainerRef}>
							{
								sweSetting.dragArea !== 'total' &&
								<div className="flex justify-center absolute top-[7px] left-0 right-0 m-auto z-10 w-full">
									<div className="searchWhateverMoveHandler w-[50px] h-[3px] bg-[#888888] rounded opacity-30 transition-all duration-300 cursor-move hover:w-20 hover:opacity-100 relative before:content-[''] before:px-5 before:py-1 before:w-full before:absolute before:-top-1 before:h-[3px] before:box-content before:-left-5 before:-left-[20px]"/>
								</div>
							}
							<div className="flex items-center justify-between h-[24px] border-b-1 border-[#f5f5f5] mb-1">
								<FrameList tabIndex={tabIndex} frames={frames} total={total} updateCurrent={setCurrent} updateTabIndex={setTabIndex} />
								<div id="searchwhatever_result" className="text-xs flex items-center select-none text-[#333] justify-end">
									<FindResult total={total} current={current} isShowResultText={sweSetting.isShowResultText} />
								</div>
								<ExtraArea isHidePanel={isHidePanel} isHidePanelTemporarily={isHidePanelTemporarily} isShowSetting={sweSetting.isShowSetting ?? true} isShowOpacity={sweSetting.isShowOpacity ?? true} isShowStatus={sweSetting.isShowStatus ?? true} updateIsHidePanel={setIsHidePanel} updateIsHidePanelTemporarily={setIsHidePanelTemporarily} />
							</div>
							<div className="flex items-center w-full">
								<div className="swe_search relative">
									{
										(sweSetting.isShowHistory ?? true) &&
										<RecentList recentList={recentList} fixList={fixList} openHistoryMode={sweSetting.openHistoryMode ?? 'hover'} updateFixList={setFixList} updateRecentList={setRecentList} fillSearchValue={fillSearchValue} popupContainer={popContainerRef.current} />
									}
									<Input
										ref={searchInputRef}
										id="swe_searchInput"
										autoFocus
										placeholder={i18n('输入文本以查找')}
										className={(sweSetting.isShowHistory??true) ? '' : 'pl-[8px]'}
										value={searchValue}
										onChange={handleSearchValueChange}
										onKeyDown={handleEnter}
										isShowRing={sweSetting.isShowRing ?? true}
										ringColor={sweSetting.ringColor ?? '#3b82f6'}
										textWidth={sweSetting.textWidth}
									>
										<div className="flex items-center bg-[rgba(255,255,255,0.9)] rounded-lg p-0.5 absolute right-[6px] top-[6px]">
											{
												isReg && !isDebounceOk &&
												<div className="absolute -left-[36px] top-[0px] h-full flex items-center"><Spin size="small" indicator={<LoadingOutlined style={{ fontSize: 12 }} spin />} /></div>
											}
											{
												searchValue &&
												<ClearSvg className="absolute -left-[18px] w-3 h-3 opacity-25 hover:opacity-45 cursor-pointer"  onClick={clearInput} />
											}
											<Button type="text" className="w-5 !h-5 min-w-5 cursor-pointer rounded-[6px] !inline-flex items-center justify-center" onClick={goPrev}>
												<UpArrowSvg className="w-3.5 h-3.5 peer/svg" />
											</Button>
											<Button type="text" className="w-5 !h-5 min-w-5 ml-1 cursor-pointer rounded-[6px] !inline-flex items-center justify-center" onClick={goNext}>
												<DownArrowSvg className="w-3.5 h-3.5" />
											</Button>
											<div className="w-[1px] h-3.5 bg-[#dfdfdf] mx-1.5"></div>
											<Tooltip
												arrowPointAtCenter={true}
												placement="bottom"
												getPopupContainer={(e) => e.parentElement}
												title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('大小写敏感')} {getShortcutText('c', true)}</div>}
											>
												<button
													className={`normalButton ${isMatchCase ? 'activeButton' : ''}`}
													onClick={handleIsMatchCaseChange}
												>
													<span className="text-[11px] select-none">Cc</span>
												</button>
											</Tooltip>
											<Tooltip
												arrowPointAtCenter={true}
												placement="bottom"
												getPopupContainer={(e) => e.parentElement}
												title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('匹配单词')} {getShortcutText('w', true)}</div>}
											>
												<button
													className={`normalButton ${isWord ? 'activeButton' : ''}`}
													onClick={handleIsWordChange}
												>
													<span className="text-[11px] select-none">W</span>
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
													className={`normalButton ${isReg ? 'activeButton' : ''}`}
													onClick={handleIsRegChange}
												>
													<span className="text-[11px] select-none">.*</span>
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
												<div
													className={`w-5 h-5 justify-center rounded-[6px] cursor-pointer select-none inline-flex items-center ml-1 ${isLive ? 'activeButton' : ''}`}
													onClick={handleIsLiveChange}
												>
													<LiveSvg className="w-4 h-4 will-change-transform" />
												</div>
											</Tooltip>
										</div>
									</Input>
								</div>
								{
									sweSetting.isShowClose &&
									<div className="flex items-center">
										<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer" onClick={closePop}>
											<CloseSvg className="icon w-2.5 h-2.5" />
										</Button>
									</div>
								}
							</div>
						</div>
					</motion.div>
				</Rnd>
			}
		</div>
	)
}
