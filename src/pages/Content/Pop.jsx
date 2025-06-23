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

		const handleKeyDown = (e) => {
			if (e.target.parentElement?.id === '__swe_container') {
				if (!['Escape', 'Shift', 'Enter'].includes(e.key)) {
					e.stopPropagation()
				}
			}
		}

		window.addEventListener("keydown", handleKeyDown, true);
		window.addEventListener("keypress", handleKeyDown, true);
		window.addEventListener("keyup", handleKeyDown, true);
		return () => {
			window.removeEventListener("keydown", handleKeyDown, true);
			window.removeEventListener("keypress", handleKeyDown, true);
			window.removeEventListener("keyup", handleKeyDown, true);
		};
	}, [])

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

	const handleIsMatchCaseChange = () => {
		const value = !isMatchCase
		setIsMatchCase(value)
	}
	const handleIsWordChange = () => {
		const value = !isWord
		setIsWord(value)
	}
	const handleIsRegChange = () => {
		const value = !isReg
		setIsReg(value)
	}
	const handleIsLiveChange = () => {
		const value = !isLive
		setIsLive(value)
	}

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

	return (
		<div className="fixed z-[10000] top-0 left-0">
			{
				isReady &&
				<Rnd
					dragHandleClassName={sweSetting.dragArea === 'total' ? '' : 'searchWhateverMoveHandler'}
					onDragStop={handleDragStop}
					position={{ x, y }}
					bounds='window'
					enableResizing={false}
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
								style={{
									padding:'18px 12px 10px',
									background: '#fff',
									borderRadius: '14px',
									boxShadow: '0px 0px 5px 0px rgba(0,0,0,.02),0px 2px 10px 0px rgba(0,0,0,.06),0px 0px 1px 0px rgba(0,0,0,.3),0px 0px 16px 1px rgba(233,233,233,0.58) ',
								}}
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
									<FindResult total={total} current={current}/>
								</div>
								<ExtraArea isHidePanel={isHidePanel} isHidePanelTemporarily={isHidePanelTemporarily} isShowSetting={sweSetting.isShowSetting ?? true} updateIsHidePanel={setIsHidePanel} updateIsHidePanelTemporarily={setIsHidePanelTemporarily} />
							</div>
							<div className="flex items-center w-full">
								<div className="swe_search relative">
									<RecentList recentList={recentList} fixList={fixList} openHistoryMode={sweSetting.openHistoryMode ?? 'hover'} updateFixList={setFixList} updateRecentList={setRecentList} fillSearchValue={fillSearchValue} popupContainer={popContainerRef.current} />
									<svg className="absolute w-[8px] h-[8px] left-[24px] top-[14px] z-10"
										 viewBox="0 0 1024 1024" version="1.1"
										 xmlns="http://www.w3.org/2000/svg" p-id="7932" width="200" height="200">
										<path
											d="M500.2 721.4l1 1 424.2-424.2-56.6-56.6-369 369-368.6-368.7-56.6 56.6 424.2 424.3z"
											fill="#696969" p-id="7933"></path>
									</svg>

									<Input
										ref={searchInputRef}
										id="swe_searchInput"
										autoFocus
										placeholder={i18n('输入文本以查找')}
										value={searchValue}
										onChange={handleSearchValueChange}
										onKeyDown={handleEnter}
									>
										<div className="flex items-center bg-white rounded-lg p-0.5 absolute right-[6px] top-[6px]">
											{
												isReg && !isDebounceOk &&
												<div className="absolute -left-[36px] top-[0px] h-full flex items-center"><Spin size="small" indicator={<LoadingOutlined style={{ fontSize: 12 }} spin />} /></div>
											}
											{
												searchValue &&
												<svg
													className="absolute -left-[18px] w-3 h-3 opacity-25 hover:opacity-45 cursor-pointer"
													viewBox="64 64 896 896" focusable="false" data-icon="close-circle"
													width="1em"
													height="1em" fill="#000000" aria-hidden="true" onClick={clearInput}>
													<path
														d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
												</svg>
											}
											<Button type="text"
													className="w-5 !h-5 min-w-5 cursor-pointer rounded-[6px] !inline-flex items-center justify-center"
													onClick={goPrev}>
												<svg className="w-3.5 h-3.5 peer/svg" viewBox="0 0 1024 1024"
													 version="1.1"
													 xmlns="http://www.w3.org/2000/svg" p-id="1466" width="32" height="32">
													<path
														d="M512.00988746 141.21142578c10.45623779 0 19.24145531 3.50024414 26.37542748 10.71331811l259.5421145 259.55200196C805.03668189 418.58105492 808.63085938 427.33660865 808.63085938 437.84228516c0 10.60949731-3.53485132 19.46887183-10.56994606 26.46936011-7.02026391 7.00543237-15.88952661 10.60949731-26.50891137 10.60949731-10.44140625 0-19.22167969-3.60900903-26.35565185-10.71331811L549.09863305 267.79370094V845.7097168c0 10.19915748-3.62384057 18.94976782-10.89624071 26.16284179-7.23284888 7.31195068-15.97357177 10.91601563-26.2122798 10.91601563-10.23376465 0-18.959656-3.60900903-26.22216796-10.91601563-7.24273705-7.21307397-10.87646508-15.96862769-10.87646508-26.16284179V267.79370094l-196.10760522 196.41906761C271.65484619 471.31213355 262.87951684 474.92114258 252.41833496 474.92114258c-10.61938477 0-19.45898438-3.60900903-26.4990232-10.60949731C218.86444068 457.31115699 215.36914062 448.45178247 215.36914062 437.84228516c0-10.50567651 3.55462623-19.26123023 10.69354248-26.36553931l259.53717042-259.55200196C492.7288816 144.71166992 501.52398658 141.21142578 511.97033691 141.21142578h0.03955055z"
														p-id="1467"></path>
												</svg>
											</Button>
											<Button type="text"
													className="w-5 !h-5 min-w-5 ml-1 cursor-pointer rounded-[6px] !inline-flex items-center justify-center"
													onClick={goNext}>
												<svg className="w-3.5 h-3.5" viewBox="0 0 1024 1024"
													 version="1.1"
													 xmlns="http://www.w3.org/2000/svg" width="32" height="32">
													<path d="M511.99011254 141.21142578c10.23376465 0 18.95471191 3.60900903 26.2122798 10.81713891 7.25262451 7.20812988 10.86657691 15.96862769 10.86657763 26.2666626v577.89129615l196.1619873-196.43884254c7.099365-7.00543237 15.90435815-10.61444068 26.34082031-10.61444139 10.61938477 0 19.43426538 3.50518822 26.51385474 10.51062059 7.04498291 7.10430908 10.54522705 15.96862769 10.54522706 26.57318092 0 10.40679908-3.54473877 19.16235352-10.69354248 26.37542748l-259.55694604 259.48278761C531.23156714 879.28833008 522.44635033 882.78857422 512.00988746 882.78857422c-10.45623779 0-19.24145531-3.50024414-26.3704834-10.71331811l-259.55200195-259.48278761C218.94848656 605.37939453 215.36914062 596.62384009 215.36914062 586.21704102c0-10.60949731 3.52496314-19.46887183 10.56994606-26.57318092C232.99395776 552.63842773 241.82861328 549.12829614 252.44799805 549.12829614c10.42163062 0 19.2167356 3.60900903 26.36553931 10.61444068l196.1125493 196.43884253V178.29522729c0-10.30297828 3.60900903-19.05853271 10.88635255-26.2666626C493.05517555 144.81549073 501.80084252 141.21142578 512.02966309 141.21142578h-0.03955055z"></path>
												</svg>
											</Button>
											<div className="w-[1px] h-3.5 bg-[#dfdfdf] mx-1.5"></div>
											<Tooltip
												arrowPointAtCenter={true}
												placement="bottom"
												getPopupContainer={(e) => e.parentElement}
												title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('大小写敏感')}</div>}
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
												title={<div className="scale-90" style={{ padding: '4px' }}>{i18n('匹配单词')}</div>}
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
														<div>{i18n('正则表达式')}</div>
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
														<div>{i18n('实时监测 DOM 变化')}</div>
														<div className="text-[#cccccc]" style={{ lineHeight: '16px' }}>{i18n('在不适合实时监测的情况下请临时关闭此功能')}</div>
													</div>
												)}
											>
												<div
													className={`w-5 h-5 justify-center rounded-[6px] cursor-pointer select-none inline-flex items-center cursor-pointer ml-1 ${isLive ? 'activeButton' : ''}`}
													onClick={handleIsLiveChange}
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
									<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer" onClick={closePop}>
										<svg className="icon w-2.5 h-2.5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
											<path d="M12.47232 12.51328C26.74688-1.76128 49.5104-2.90816 65.15712 9.84064l2.93888 2.70336L1009.664 955.37152c14.96064 14.80704 15.62624 38.76864 1.51552 54.38464-14.12096 15.616-38.02112 17.3568-54.26176 3.95264l-2.9696-2.70336L12.41088 68.17792c-15.34976-15.39072-15.31904-40.30464 0.06144-55.66464z m0 0" fill="red"/>
											<path d="M1009.67424 12.51328c-14.2848-14.27456-37.04832-15.42144-52.69504-2.67264l-2.99008 2.70336L12.41088 955.37152c-14.96064 14.80704-15.62624 38.76864-1.51552 54.38464 14.12096 15.616 38.02112 17.3568 54.25152 3.95264l2.9696-2.70336 941.568-942.82752c15.34976-15.38048 15.32928-40.30464-0.0512-55.66464h0.04096z m0 0" fill="red"/>
										</svg>
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				</Rnd>
			}
		</div>
	)
}
