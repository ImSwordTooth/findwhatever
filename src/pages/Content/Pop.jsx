import { useRef, useState, useEffect } from 'preact/compat'
import { Input } from '../../components/Input'
import { reCheckTree, closePop, observerBodyAndOpenShadowRoot, useDebounce, debounce } from './features'
import { Tooltip } from '../../components/Tooltip'
import { Rnd } from 'react-rnd'
import { applyAppLanguage } from '../../i18n'
import { useTranslation } from 'react-i18next'
import '../../global.css'
import { FrameList } from "./Parts/FrameList";
import { FindResult } from "./Parts/FindResult";
import { RecentList } from "./Parts/RecentList";
import { ExtraArea } from "./Parts/ExtraArea";
import * as motion from 'motion/react-client'
import ClearSvg from '../../assets/svg/clear.svg'
import UpArrowSvg from '../../assets/svg/upArrow.svg'
import DownArrowSvg from '../../assets/svg/downArrow.svg'
import CloseSvg from '../../assets/svg/close.svg'
import WarnSvg from '../../assets/svg/warn.svg'
import SearchSvg from '../../assets/svg/search.svg'
import LoadingSvg from '../../assets/svg/loading.svg'

export const Pop = () => {
	const [ frames, setFrames ] = useState([])
	const [ searchValue, setSearchValue ] = useState('') // 搜索词
	const [ options, setOptions ] = useState({
		isMatchCase: false, // 是否大小写敏感
		isWord: false,      // 是否为整个单词
		isReg: false,       // 是否为正则模式
		isLive: false       // 是否实时监听DOM
	})
	const { isMatchCase, isWord, isReg, isLive } = options
	const [ current, setCurrent ] = useState(0) // 当前结果的下标
	const [ total, setTotal ] = useState([]) // 当前结果，格式为 { sum, frameId }
	const [ tabIndex, setTabIndex ] = useState('0') // tab 的key，值为 frame 的 id，默认为 0
	const [ isHidePanel, setIsHidePanel ] = useState(false) // 是否把面板半透明
	const [ isHidePanelTemporarily, setIsHidePanelTemporarily ] = useState(false) // 是否临时把面板半透明
	const [ isExiting, setIsExiting ] = useState(false) // 退出动画进行中
	const [ isReady, setIsReady ] = useState(false)
	const [ recentList, setRecentList ] = useState([])
	const [ isShowWarn, setIsShowWarn ] = useState(false)
	const [ warnReason, setWarnReason ] = useState(false)
	const [ x, setX ] = useState(parseInt(window.innerWidth * 0.9 - 440))
	const [ y, setY ] = useState(parseInt(window.innerHeight * 0.1))
	const [ debounceDuration, setDebounceDuration ] = useState(200)
	const [ regexDebounceDuration, setRegexDebounceDuration ] = useState(1000)
	const [ colorMode, setColorMode ] = useState('light')
	const [ sweSetting, setSweSetting ] = useState({})
	const [ isHistoryOpen, setIsHistoryOpen ] = useState(false)
	const [ selectedHistoryIndex, setSelectedHistoryIndex ] = useState(-1)
	const [ loopNotice, setLoopNotice ] = useState(null)
	const loopTimerRef = useRef(null)
	const searchContainerRef = useRef(null)

	useEffect(() => {
		if (!isHistoryOpen) return

		const rootNode = searchContainerRef.current?.getRootNode()
		const isShadow = rootNode instanceof ShadowRoot || (rootNode && rootNode.nodeType === 11)
		const host = isShadow ? rootNode.host : null

		// 1. 处理 Shadow DOM 内部点击：精确判断是否在搜索容器/历史列表内部
		const handleShadowMouseDown = (e) => {
			if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
				setIsHistoryOpen(false)
				setSelectedHistoryIndex(-1)
			}
		}

		// 2. 处理宿主页面点击：如果点击落在扩展容器外部，立即收起历史面板
		const handleDocMouseDown = (e) => {
			const container = document.getElementById('__swe_container')
			const path = e.composedPath ? e.composedPath() : []
			if (
				(host && (path.includes(host) || e.target === host || host.contains(e.target))) ||
				(container && (path.includes(container) || e.target === container || container.contains(e.target)))
			) {
				return
			}
			setIsHistoryOpen(false)
			setSelectedHistoryIndex(-1)
		}

		if (rootNode && rootNode.addEventListener) {
			rootNode.addEventListener('mousedown', handleShadowMouseDown)
		}
		document.addEventListener('mousedown', handleDocMouseDown)

		return () => {
			if (rootNode && rootNode.removeEventListener) {
				rootNode.removeEventListener('mousedown', handleShadowMouseDown)
			}
			document.removeEventListener('mousedown', handleDocMouseDown)
		}
	}, [isHistoryOpen])

	const handleCloseWithAnimation = () => {
		if (isExiting) return
		setIsExiting(true)
	}

	const executeDirectClose = () => {
		window.__swe_isDirectClosing = true;
		closePop();
	};

	const [pressingBtn, setPressingBtn] = useState(null)
	const pressTimerRef = useRef(null)

	const triggerBtnPress = (btnKey) => {
		setPressingBtn(btnKey)
		if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
		pressTimerRef.current = setTimeout(() => {
			setPressingBtn(null)
		}, 140)
	}

	const toggleOption = (key) => {
		triggerBtnPress(key)
		setOptions(prev => {
			const nextVal = !prev[key]
			chrome.storage.sync.set({ [key]: nextVal }).catch(() => null)
			return { ...prev, [key]: nextVal }
		})
	}

	const {debouncedValue, isDebounceOk} = useDebounce(searchValue, isReg ? regexDebounceDuration : debounceDuration, !isReady)
	const { t } = useTranslation()

	const popContainerRef = useRef(null)
	const searchInputRef = useRef(null)
	const isFirstRender = useRef(true);

	const handleUpdate = () => {
		reCheckTree().then(() => {
			chrome?.runtime?.sendMessage({
				action: 'search',
				data: {
					isAuto: true
				}
			});

		})
	}

	useEffect(() => {

		const init = async () => {
			const [ sessionStorage, syncStorage, locStorage ] = await Promise.all([
				chrome.storage.session.get(['frames']),
				chrome.storage.sync.get(['isMatchCase', 'isWord', 'isReg', 'isLive', 'recent', 'swe_setting']),
				chrome.storage.local.get(['x', 'y', 'searchValue'])
			])
			setFrames(sessionStorage.frames || [])
			setSearchValue(locStorage.searchValue || '')
			setOptions({
				isMatchCase: Boolean(syncStorage.isMatchCase),
				isWord: Boolean(syncStorage.isWord),
				isReg: Boolean(syncStorage.isReg),
				isLive: Boolean(syncStorage.isLive)
			})
			setRecentList(syncStorage.recent || [])
			setDebounceDuration(syncStorage.swe_setting?.debounceDuration || 200)
			setRegexDebounceDuration(syncStorage.swe_setting?.regexDebounceDuration || 2000)
			setSweSetting(syncStorage.swe_setting || { tempOpacity: 0.3 })

			// 设定语言
			applyAppLanguage(syncStorage.swe_setting?.language)

			let color = ''
			if (syncStorage.swe_setting?.colorMode === 'auto') {
				color = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
			} else {
				color = syncStorage.swe_setting?.colorMode || 'dark'
			}
			setColorMode(color)

			const dom = document.querySelector('#__swe_container > div')
			if (dom) {
				const primaryColor = color === 'light'
					? (syncStorage.swe_setting?.primaryColor || '#1677ff')
					: (syncStorage.swe_setting?.primaryColor_dark || '#44d62c')
				dom.style.setProperty('--swe-color-primary', primaryColor)
			}

			// 坐标精准校验与单次设置（支持 0 坐标边界贴靠）
			const defaultX = Math.round(window.innerWidth * 0.9 - 440)
			const defaultY = Math.round(window.innerHeight * 0.1)
			const hasSavedX = typeof locStorage.x === 'number'
			const hasSavedY = typeof locStorage.y === 'number'
			const savedX = hasSavedX ? locStorage.x : defaultX
			const savedY = hasSavedY ? locStorage.y : defaultY

			let targetX = savedX
			let targetY = savedY

			if (window.innerHeight < savedY + 94 || window.innerWidth < savedX + 440) {
				// 如果在当前视口不能完全显示，重置到默认位置
				targetX = defaultX
				targetY = defaultY
				if (window.screen.height < savedY + 94 || window.screen.width < savedX + 440) {
					chrome.storage.local.remove(['x', 'y'])
				}
			} else if (savedX < 0 || savedY < 0) {
				// 如果超出左上边界负值，重置并清理存储
				targetX = defaultX
				targetY = defaultY
				chrome.storage.local.remove(['x', 'y'])
			}

			setX(targetX)
			setY(targetY)

			const debouncedUpdate = debounce(handleUpdate, 200)
			window.__swe_observer = new MutationObserver((mutationsList, observer) => {
				debouncedUpdate()
			})

			// 核心保证：在所有配置、颜色、样式、DOM 以及坐标均完整解析并设置完成后，最后才开启 isReady
			setIsReady(true)
		}

		window.addEventListener('message', handleMessage)

		init()

		return () => {
			if (window.__swe_observer) {
				window.__swe_observer.disconnect();
				window.__swe_observer = null;
			}
			window.removeEventListener('message', handleMessage)
		}
	}, []);

	const handleKeyDown = (e) => {
		// 检测操作系统
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 ||
					 navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

		// 根据操作系统判断快捷键组合
		const isValidModifier = isMac ?
			(e.ctrlKey && !e.shiftKey) : // macOS: Ctrl (不包含Shift)
			(e.ctrlKey && e.shiftKey);   // 其他系统: Ctrl + Shift

		if (isValidModifier && !e.repeat) {
			const lowerKey = e.key.toLowerCase();
			if (lowerKey === "c") {
				e.preventDefault();
				e.stopPropagation();
				toggleOption('isMatchCase');
				return;
			}
			if (lowerKey === "w") {
				e.preventDefault();
				e.stopPropagation();
				toggleOption('isWord');
				return;
			}
			if (lowerKey === "d") {
				e.preventDefault();
				e.stopPropagation();
				toggleOption('isLive');
				return;
			}
			if (lowerKey === "r") {
				e.preventDefault();
				e.stopPropagation();
				toggleOption('isReg');
				return;
			}
		}

		if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();
			handleCloseWithAnimation();
			return;
		} else {
			e.stopPropagation();
		}
	};

	// isLive 变更后，更新监听器
	useEffect(() => {
		if (!isReady) {
			return
		}
		if (isLive) {
			observerBodyAndOpenShadowRoot()
		} else {
			window.__swe_observer?.disconnect()
		}
	}, [isLive]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		chrome.storage.sync.set({ recent: recentList }).catch(() => null);
	}, [recentList]);

	useEffect(() => {
		if (!isReady) {
			return
		}
		chrome.storage.local.set({ searchValue: debouncedValue }, () => {
			chrome?.runtime?.sendMessage({
				action: 'search',
				data: {
					isAuto: false
				}
			});
		});

	}, [debouncedValue, isWord, isMatchCase, isReg, isLive, isReady]);

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

	useEffect(() => {
		window.__swe_requestClose = handleCloseWithAnimation;
		return () => {
			if (window.__swe_requestClose === handleCloseWithAnimation) {
				delete window.__swe_requestClose;
			}
		};
	}, [isExiting]);

	useEffect(() => {
		if (isExiting) {
			const timer = setTimeout(() => {
				executeDirectClose();
			}, 250);
			return () => clearTimeout(timer);
		}
	}, [isExiting]);

	const handleMessage = async (e) => {
		if (e.source !== window || typeof e.data !== 'object' || !e.data?.type?.startsWith('swe_')) return;
		if (e.data.type === 'swe_updateSearchResult') {
			if (e.data.data.error) {
				setIsShowWarn(true)
				setWarnReason(e.data.data.errorType)
			} else {
				setIsShowWarn(false)
				setCurrent(e.data.data.current)
				setTotal(e.data.data.total)
			}
		}
		if (e.data.type === 'swe_updateSettings') {
			const [ sessionStorage, syncStorage, locStorage ] = await Promise.all([
				chrome.storage.session.get(['frames']),
				chrome.storage.sync.get(['isMatchCase', 'isWord', 'isReg', 'isLive']),
				chrome.storage.local.get(['searchValue'])
			])
			setFrames(sessionStorage.frames)
			setSearchValue(locStorage.searchValue || '')
			setOptions({
				isMatchCase: Boolean(syncStorage.isMatchCase),
				isWord: Boolean(syncStorage.isWord),
				isReg: Boolean(syncStorage.isReg),
				isLive: Boolean(syncStorage.isLive)
			})
		}
	}

	const handleSearchValueChange = (e) => {
		const value = e.target.value
		setSearchValue(value)
		setSelectedHistoryIndex(-1)
		if (isHistoryOpen) {
			setIsHistoryOpen(false)
		}
	}

	const handleEnter = e => {
		if (e.nativeEvent?.isComposing || e.keyCode === 229) {
			return
		}

		const totalHistoryItems = recentList?.length || 0
		const isHistoryAvailable = (sweSetting.isShowHistory ?? true) && totalHistoryItems > 0

		if (isHistoryOpen) {
			if (e.key === 'Escape') {
				e.preventDefault()
				e.stopPropagation()
				setIsHistoryOpen(false)
				setSelectedHistoryIndex(-1)
				return
			}
			if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSelectedHistoryIndex(prev => (prev + 1) % totalHistoryItems)
				return
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSelectedHistoryIndex(prev => (prev <= 0 ? totalHistoryItems - 1 : prev - 1))
				return
			}
			if (e.key === 'Enter') {
				if (selectedHistoryIndex >= 0 && selectedHistoryIndex < totalHistoryItems) {
					e.preventDefault()
					const targetText = recentList[selectedHistoryIndex]
					if (targetText) {
						fillSearchValue(e, targetText)
						setIsHistoryOpen(false)
						setSelectedHistoryIndex(-1)
						searchInputRef.current?.focus()
						return
					}
				}
				setIsHistoryOpen(false)
				setSelectedHistoryIndex(-1)
			}
		} else {
			if (e.key === 'ArrowDown' && isHistoryAvailable) {
				e.preventDefault()
				setIsHistoryOpen(true)
				setSelectedHistoryIndex(0)
				return
			}
			if (e.key === 'Escape') {
				e.preventDefault()
				e.stopPropagation()
				handleCloseWithAnimation()
				return
			}
		}

		if (e.key === 'Enter') {
			if (e.shiftKey) {
				stepTo(-1)
			} else {
				stepTo(1)
			}
		}
	}

	const stepTo = async (step) => {
		triggerBtnPress(step === -1 ? 'up' : 'down');
		const { activeResult = 0, resultSum = [] } = await chrome.storage.session.get(['activeResult', 'resultSum']);
		const sum = resultSum.reduce((acc, cur) => acc + (cur.sum || 0), 0);
		if (sum === 0) return;

		let nextIndex = activeResult + step;
		if (nextIndex > sum) nextIndex = 1;
		if (nextIndex <= 0) nextIndex = sum;

		// 检查首尾循环边界提示 (1 ↔ n)：看在页面中的相对位置（1 在网页顶端，n 在网页底端）
		if (sum > 1 && (sweSetting.isLoopNotice ?? true)) {
			let direction = null;
			if (step > 0 && activeResult === sum) {
				direction = 'up'; // n -> 1: 从网页底部跳回网页顶端 (UP)
			} else if (step < 0 && activeResult === 1) {
				direction = 'down'; // 1 -> n: 从网页顶端跳到网页底端 (DOWN)
			}
			if (direction) {
				setLoopNotice({ direction, key: Date.now() });
				if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
				loopTimerRef.current = setTimeout(() => {
					setLoopNotice(null);
				}, 450);
			}
		}

		await chrome.storage.session.set({ activeResult: nextIndex });

		let accSum = 0;
		for (const item of resultSum) {
			accSum += item.sum;
			if (nextIndex <= accSum) {
				setTabIndex(item.frameId.toString());
				break;
			}
		}

		addToRecent();
		setCurrent(nextIndex);
	}

	const clearInput = () => {
		setSearchValue('')
		searchInputRef.current?.focus()
		chrome.storage.local.set({ searchValue: '' }).catch(() => null)
	}

	const handleDragStop = (e, d) => {
		setX(d.x)
		setY(d.y)
		chrome.storage.local.set({ x: d.x, y: d.y })
	}

	const addToRecent = () => {
		const trimmed = searchValue?.trim();
		if (!trimmed) {
			return
		}
		const newRecent = recentList.slice()
		if (!newRecent.includes(searchValue)) { // 没有就直接新增
			newRecent.unshift(searchValue)
			if (newRecent.length > 50) { // 不超过50条
				newRecent.pop()
			}
		} else { // 有就提到最新
			const index = newRecent.findIndex(r => r === searchValue);
			if (index === 0) {
				return
			} else if (index > 0) {
				newRecent.unshift(newRecent.splice(index, 1)[0])
			}
		}
		setRecentList(newRecent)
	}

	const fillSearchValue = (e, text, isReg = undefined) => {
		e?.stopPropagation?.()
		setSearchValue(text)
		if (isReg) {
			setOptions(prev => {
				if (!prev.isReg) {
					chrome.storage.sync.set({ isReg: true }).catch(() => null)
					return { ...prev, isReg: true }
				}
				return prev
			})
		}
	}

	const getShortcutText = (key, isBottom = false) => {
		const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
		let text = `Ctrl + Shift + ${key.toUpperCase()}`
		if (isMac) {
			text = `Ctrl + ${key.toUpperCase()}`
		}
		return <span className={`italic scale-90 origin-${isBottom ? 'bottom' : 'center'} rounded-[6px] p-[1px_6px] bg-[rgba(81,81,81,83%)] shadow-[1px_1px_3px_1px_rgba(60,60,60,0.78)] inline-block opacity-90 border-solid border-[1px] border-[rgba(204,204,204,0.38)]`}>{text}</span>
	}

	const getErrorText = () => {
		switch (warnReason) {
			case 'danger reg': return '正则表达式过于宽泛，可能导致查找过程中卡死，已暂停搜索，请重新输入'
			case 'invalid reg': return '不合法的正则表达式'
		}
	}

	const isShowTooltip = sweSetting.isShowTooltip ?? true

	return (
		<div className="fixed z-[10000] top-0 left-0">
			{
				isReady &&
				<Rnd
					dragHandleClassName={sweSetting.dragArea === 'total' ? '' : 'searchWhateverMoveHandler'}
					onDragStop={handleDragStop}
					cancel=".swe_search, #swe_searchInput"
					position={{ x, y }}
					bounds='window'
					enableResizing={false}
					enableUserSelectHack={true}
					style={{
						transition: (isHidePanel || isHidePanelTemporarily) ? 'opacity 0.3s ease' : undefined,
						opacity: isHidePanel ? sweSetting.tempOpacity : (isHidePanelTemporarily ? sweSetting.tempOpacity : 1)
					}}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.92, y: -6 }}
						animate={isExiting ? { opacity: 0, scale: 0.94, y: -6 } : { opacity: 1, scale: 1, y: 0 }}
						transition={isExiting ? {
							duration: 0.16,
							ease: [0.4, 0, 1, 1]
						} : {
							type: "spring",
							damping: 24,
							stiffness: 320,
							mass: 0.8
						}}
						onAnimationComplete={() => {
							if (isExiting) {
								executeDirectClose();
							}
						}}
						className={`mainPanel ${colorMode} ${!sweSetting.isShowSetting && !sweSetting.isShowOpacity && !sweSetting.isShowStatus && sweSetting.dragArea === 'total' ? 'lessPT' : ''}`}
					>
						<div
							id="searchWhateverPopup"
							ref={popContainerRef}
							onKeyDown={handleKeyDown}
							onKeyUp={e => { if (e.key !== 'Escape') e.stopPropagation(); }}
							onKeyPress={e => { if (e.key !== 'Escape') e.stopPropagation(); }}
						>
							{
								sweSetting.dragArea !== 'total' &&
								<div className="flex justify-center absolute top-[7px] left-0 right-0 m-auto z-10 w-full">
									<div className="searchWhateverMoveHandler w-[42px] h-[3.5px] bg-[#888888] rounded-full opacity-35 transition-all duration-300 cursor-move hover:w-16 hover:opacity-80 active:bg-[var(--swe-color-primary)] active:opacity-100 relative before:content-[''] before:px-5 before:py-1 before:w-full before:absolute before:-top-1 before:h-[3px] before:box-content before:-left-[20px]"/>
								</div>
							}
							<ExtraArea
								isHidePanel={isHidePanel}
								isHidePanelTemporarily={isHidePanelTemporarily}
								isShowSetting={sweSetting.isShowSetting ?? true}
								isShowOpacity={sweSetting.isShowOpacity ?? true}
								isShowStatus={sweSetting.isShowStatus ?? true}
								updateIsHidePanel={setIsHidePanel}
								updateIsHidePanelTemporarily={setIsHidePanelTemporarily}
							/>
							<div className="flex items-center justify-between h-[24px] border-b border-black/[0.05] dark:border-white/[0.08] mb-1">
								<FrameList tabIndex={tabIndex} frames={frames} total={total} updateCurrent={setCurrent} updateTabIndex={setTabIndex} />
								<div id="searchwhatever_result" className="text-xs flex items-center select-none text-neutral-700 dark:text-neutral-200 justify-end">
									<FindResult total={total} current={current} isShowResultText={sweSetting.isShowResultText} loopNotice={loopNotice} />
								</div>
							</div>
							<div className="flex items-center w-full">
								<div className="swe_search relative" ref={searchContainerRef}>
									<div
										className={`absolute left-[5px] top-0 bottom-0 m-auto w-[22px] h-[22px] flex items-center justify-center rounded-[5px] cursor-pointer z-10 transition-colors duration-150 hover:bg-[#e4e4e7] dark:hover:bg-[#383838] active:scale-90 ${
											isHistoryOpen
												? 'text-[var(--swe-color-primary)]'
												: 'text-[#666] dark:text-[#fff] hover:text-[var(--swe-color-primary)]'
										}`}
										onClick={() => {
											if (sweSetting.isShowHistory ?? true) {
												setIsHistoryOpen(prev => !prev)
												setSelectedHistoryIndex(-1)
											}
										}}
									>
										<SearchSvg className="w-3.5 h-3.5 fill-current transition-colors duration-150" />
									</div>
									<Input
										ref={searchInputRef}
										id="swe_searchInput"
										autoFocus
										placeholder={
											((recentList?.length > 0) && (sweSetting.isShowHistory ?? true))
												? t('查找或按 ↓ 查历史')
												: t('输入文本...')
										}
										className={(sweSetting.isShowHistory ?? true) ? 'pl-8' : 'pl-[8px]'}
										value={searchValue}
										onChange={handleSearchValueChange}
										onKeyDown={handleEnter}
										isShowRing={sweSetting.isShowRing ?? true}
										textWidth={sweSetting.textWidth}
									>
										<div className="flex items-center bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(58,58,58,0.9)] rounded-lg p-0.5 absolute right-[6px] top-[6px] z-20">
											<div className="absolute right-[calc(100%_+_4px)] top-0 bottom-0 flex items-center gap-[6px]">
												{
													isReg && !isDebounceOk &&
													<div className="h-full flex items-center"><LoadingSvg className="animate-spin w-3 h-3 text-[var(--swe-color-primary)] dark:text-[#fff]" /></div>
												}
												{
													searchValue &&
													<ClearSvg className="w-3 h-3 opacity-35 hover:opacity-85 hover:scale-110 active:scale-90 transition-all cursor-pointer dark:*:fill-[#fff]" onClick={clearInput} />
												}
												{
													isShowWarn &&
													<Tooltip
														placement="bottom"
														title={
															<div className="scale-90" style={{ padding: '4px 0' }}>
																<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{t(getErrorText())}</div>
															</div>
														}
													>
														<WarnSvg className=" w-3 h-3 opacity-80 drop-shadow-[0px_0px_4px_red] hover:opacity-90 cursor-pointer fill-red dark:fill-[#ff4141]" />
													</Tooltip>
												}
											</div>
											<button
												type="button"
												className={`w-5 h-5 min-w-5 p-0 cursor-pointer rounded-[6px] inline-flex items-center justify-center bg-white dark:bg-[#383838] hover:bg-[#f5f5f5] dark:hover:bg-[#484848] active:scale-95 transition-all relative overflow-visible ${
													pressingBtn === 'up' ? 'animate-press' : ''
												} ${
													loopNotice?.direction === 'up' ? 'ring-2 ring-[var(--swe-color-primary)] ring-offset-1 dark:ring-offset-[#282828]' : ''
												}`}
												onClick={() => stepTo(-1)}
											>
												<UpArrowSvg className={`w-3.5 h-3.5 shrink-0 transition-colors ${
													loopNotice?.direction === 'up' ? 'text-[var(--swe-color-primary)] fill-[var(--swe-color-primary)] dark:*:fill-[var(--swe-color-primary)]' : 'dark:*:fill-[#fff]'
												}`} />
												{loopNotice?.direction === 'up' && (
													<UpArrowSvg
														key={loopNotice.key}
														className="w-3.5 h-3.5 shrink-0 absolute inset-0 m-auto pointer-events-none text-[var(--swe-color-primary)] fill-[var(--swe-color-primary)] dark:*:fill-[var(--swe-color-primary)] animate-ghost-up z-20"
													/>
												)}
											</button>
											<button
												type="button"
												className={`w-5 h-5 min-w-5 ml-1 p-0 cursor-pointer rounded-[6px] inline-flex items-center justify-center bg-white dark:bg-[#383838] hover:bg-[#f5f5f5] dark:hover:bg-[#484848] active:scale-95 transition-all relative overflow-visible ${
													pressingBtn === 'down' ? 'animate-press' : ''
												} ${
													loopNotice?.direction === 'down' ? 'ring-2 ring-[var(--swe-color-primary)] ring-offset-1 dark:ring-offset-[#282828]' : ''
												}`}
												onClick={() => stepTo(1)}
											>
												<DownArrowSvg className={`w-3.5 h-3.5 shrink-0 transition-colors ${
													loopNotice?.direction === 'down' ? 'text-[var(--swe-color-primary)] fill-[var(--swe-color-primary)] dark:*:fill-[var(--swe-color-primary)]' : 'dark:*:fill-[#fff]'
												}`} />
												{loopNotice?.direction === 'down' && (
													<DownArrowSvg
														key={loopNotice.key}
														className="w-3.5 h-3.5 shrink-0 absolute inset-0 m-auto pointer-events-none text-[var(--swe-color-primary)] fill-[var(--swe-color-primary)] dark:*:fill-[var(--swe-color-primary)] animate-ghost-down z-20"
													/>
												)}
											</button>
											<div className="w-[1px] h-3.5 bg-[#dfdfdf] mx-1.5"></div>
											<Tooltip
												placement="bottom"
												title={isShowTooltip ? <div className="scale-90" style={{ padding: '4px' }}>{t('大小写敏感')} {getShortcutText('c', true)}</div> : null}
											>
												<button
													className={`normalButton ${isMatchCase ? 'activeButton' : ''} ${pressingBtn === 'isMatchCase' ? 'animate-press' : ''}`}
													onClick={() => toggleOption('isMatchCase')}
												>
													<span className="text-[11px] select-none">Cc</span>
												</button>
											</Tooltip>
											<Tooltip
												placement="bottom"
												title={isShowTooltip ? <div className="scale-90" style={{ padding: '4px' }}>{t('匹配单词')} {getShortcutText('w', true)}</div> : null}
											>
												<button
													className={`normalButton ${isWord ? 'activeButton' : ''} ${pressingBtn === 'isWord' ? 'animate-press' : ''}`}
													onClick={() => toggleOption('isWord')}
												>
													<span className="text-[11px] select-none">W</span>
												</button>
											</Tooltip>
											<Tooltip
												placement="bottom"
												title={
													isShowTooltip ? (
														<div className="scale-90" style={{ padding: '4px 0' }}>
															<div>{t('正则表达式')} {getShortcutText('r')}</div>
															<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{t('为了避免输入正则表达式的过程中卡死，开启此选项后的输入防抖会持续数秒')}</div>
														</div>
													) : null
												}
											>
												<button
													className={`normalButton ${isReg ? 'activeButton' : ''} ${pressingBtn === 'isReg' ? 'animate-press' : ''}`}
													onClick={() => toggleOption('isReg')}
												>
													<span className="text-[11px] select-none">.*</span>
												</button>
											</Tooltip>
											<Tooltip
												placement="bottomRight"
												title={
													isShowTooltip ? (
														<div className="scale-90" style={{ padding: '4px 0' }}>
															<div>{t('实时监测 DOM 变化')} {getShortcutText('d')}</div>
															<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{t('在不适合实时监测的情况下请临时关闭此功能')}</div>
														</div>
													) : null
												}
											>
												<div
													className={`w-5 h-5 justify-center rounded-[6px] cursor-pointer select-none inline-flex items-center ml-1 active:scale-90 transition-transform dark:[path]:fill-[#fff] ${isLive ? 'activeLive' : ''} ${pressingBtn === 'isLive' ? 'animate-press' : ''}`}
													onClick={() => toggleOption('isLive')}
												>
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
									{
										(sweSetting.isShowHistory ?? true) &&
										<RecentList
											isOpen={isHistoryOpen}
											onClose={() => {
												setIsHistoryOpen(false)
												setSelectedHistoryIndex(-1)
												searchInputRef.current?.focus()
											}}
											recentList={recentList}
											selectedIndex={selectedHistoryIndex}
											updateRecentList={(newList) => {
												setRecentList(newList)
												setSelectedHistoryIndex(-1)
											}}
											fillSearchValue={fillSearchValue}
											isShowTooltip={isShowTooltip}
										/>
									}
								</div>
								{
									sweSetting.isShowClose &&
									<div className="flex items-center">
										<button type="button" className="w-6 h-6 min-w-0 ml-2 p-0 bg-transparent cursor-pointer inline-flex items-center justify-center rounded-full hover:bg-[rgba(255,0,0,0.12)] transition-colors text-[#ff4d4f]" onClick={handleCloseWithAnimation}>
											<CloseSvg className="icon w-2.5 h-2.5 shrink-0" />
										</button>
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
