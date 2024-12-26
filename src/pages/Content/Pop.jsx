import React, {useRef, useState, useEffect} from 'react'
import { Input } from '../../components/Input'
import { reCheckTree, closePop, observerAllExceptMe, doSearchOutside } from './features'
import { Tabs, Tooltip, Button } from 'antd'

import '../../output.css'

export const Pop = () => {
	const [ containerStyle, setContainerStyle ] = useState({
		position: 'fixed',
		backgroundColor: '#ffffff',
		boxShadow: '0px 0px 5px 0px rgba(0,0,0,.02),0px 2px 10px 0px rgba(0,0,0,.06),0px 0px 1px 0px rgba(0,0,0,.3)',
		zIndex: '10000',
		padding: '18px 12px 10px',
		borderRadius: '12px'
	})

	const [ frames, setFrames ] = useState([])
	const [ visibleStatus, setVisibleStatus ] = useState('') // 当前搜索结果的可见性，有三个值，''||'隐藏中'||'被遮盖'
	const [ searchValue, setSearchValue ] = useState('') // 搜索词
	const [ isMatchCase, setIsMatchCase ] = useState(false) // 是否大小写敏感
	const [ isWord, setIsWord ] = useState(false) // 是否为整个单词
	const [ isReg, setIsReg ] = useState(false) // 是否为正则模式
	const [ isLive, setIsLive ] = useState(false) // 是否实时监听DOM
	const [ current, setCurrent ] = useState(0) // 当前结果的下标
	const [ total, setTotal ] = useState([]) // 当前结果，格式为 { sum, frameId }
	const [ tabIndex, setTabIndex ] = useState('0') // tab 的key，值为 frame 的 id，默认为 0

	const popContainerRef = useRef(null)
	const searchInputRef = useRef(null)
	const isChinese = useRef(navigator.language === 'zh' || navigator.language === 'zh-CN')

	useEffect(() => {

		const init = async () => {
			chrome.storage.onChanged.addListener(handleSessionChange)
			const [ sessionStorage, syncStorage ] = await Promise.all([
				chrome.storage.session.get(['frames']),
				chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive', 'top', 'right'])
			])
			setFrames(sessionStorage.frames)
			setSearchValue(syncStorage.searchValue)
			setIsMatchCase(syncStorage.isMatchCase)
			setIsWord(syncStorage.isWord)
			setIsReg(syncStorage.isReg)
			setIsLive(syncStorage.isLive)

			setContainerStyle({
				...containerStyle,
				top: syncStorage.top ? `${syncStorage.top}px` : '10%',
				right: syncStorage.right? `${syncStorage.right}px` : '10%'
			})

			window.__swe_observer = new MutationObserver((mutationsList, observer) => {
				// 遍历 mutationsList 数组，处理每个变化
				// for (const mutation of mutationsList) {
				// 	console.log(mutation.type); // 输出变化类型
				// 	console.log(mutation.target); // 输出发生变化的节点
				// }

				reCheckTree() // 重新生成节点树
				doSearchOutside(true, (response) => {
					setCurrent(response.current)
					setTotal(response.total)
				}) // 然后执行搜索
			})

			// 启动后立即进行一次搜索
			doSearch()
		}

		window.addEventListener('message', handleMessage)

		init()

		return () => {
			chrome.storage.onChanged.removeListener(handleSessionChange)
			window.removeEventListener('message', handleMessage)
		}
	}, []);

	// isLive 变更后，更新监听器
	useEffect(() => {
		if (isLive) {
			observerAllExceptMe()
		} else {
			window.__swe_observer?.disconnect()
		}
	}, [isLive]);

	useEffect(() => {
		chrome.storage.sync.set({ searchValue, isWord, isMatchCase, isReg, isLive }, () => {
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

	}, [searchValue, isWord, isMatchCase, isReg, isLive]);

	const handleMessage = async (e) => {
		if (e.data.type === 'swe_updateSearchResult') {
			setCurrent(e.data.data.current)
			setTotal(e.data.data.total)


		}
		if (e.data.type === 'swe_updateSettings') {
			const [ sessionStorage, syncStorage ] = await Promise.all([
				chrome.storage.session.get(['frames']),
				chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive', 'top', 'right'])
			])
			setFrames(sessionStorage.frames)
			setSearchValue(syncStorage.searchValue)
			setIsMatchCase(syncStorage.isMatchCase)
			setIsWord(syncStorage.isWord)
			setIsReg(syncStorage.isReg)
			setIsLive(syncStorage.isLive)
		}
	}

	const handleSessionChange = async (changes, areaName) => {
		if (areaName === 'session') {
			if (!window.isFrame && changes.visibleStatus !== undefined) {
				setVisibleStatus(changes.visibleStatus.newValue)
			}
		}
	}

	const startMove = (downEvent) => {
		downEvent.preventDefault();
		const { top, right } = popContainerRef.current.getBoundingClientRect()
		const { clientX: startX, clientY: startY } = downEvent
		let endX, endY

		const handleMove = (e) => {
			e.preventDefault()
			const { clientX, clientY } = e
			setContainerStyle({
				...containerStyle,
				top: top + (clientY - startY) + 'px',
				right: window.innerWidth - (right + (clientX - startX)) + 'px'
			})
			endX = clientX
			endY = clientY
		}

		const handleUp = async () => {
			document.removeEventListener('mousemove', handleMove)
			document.removeEventListener('mouseup', handleUp)
			await chrome.storage.sync.set({ top: parseFloat( top + (endY - startY)), right: parseFloat(window.innerWidth - (right + (endX - startX))) })
		}

		document.addEventListener('mousemove', handleMove)
		document.addEventListener('mouseup', handleUp)
	}

	const handleSearchValueChange = (e) => {
		const value = e.target.value.trim()
		setSearchValue(value)
	}

	const handleEnter = e => {
		e.stopPropagation()

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

	const doSearch = async (isAuto = false) => {
		CSS.highlights.clear() // 清除所有高亮

		if (searchValue) { // 如果有搜索词
			window.filteredRangeList = [] // 清除之前搜索到的匹配结果的 DOM 集合
			// 根据筛选项，设置正则表达式
			let regContent = searchValue
			if (!isReg) {
				regContent = regContent.replace(/([^a-zA-Z0-9_ \n])/g, '\\$1')
			}
			if (isWord) {
				regContent = `\\b${regContent}\\b`
			}
			let execResLength = searchValue.length // 匹配结果的长度，一般情况下等于字符串长度，如果是正则，就得是正则结果的长度
			let reg
			try {
				reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dg`);

				window.rangesFlat = window.allNodes.map(({ el, text }) => {
					const indices = []
					let startPosition = 0

					while (startPosition < text.length) {
						let index
						reg.lastIndex = 0
						const res = reg.exec(text.substring(startPosition))

						if (res) {
							index = res.indices[0][0]
							execResLength = res.indices[0][1] - res.indices[0][0]
							indices.push(startPosition + index)
							startPosition += index + execResLength
						} else {
							break
						}
					}

					return indices.map(index => {
						const range = new Range()
						window.filteredRangeList.push(el.parentElement)
						range.setStart(el, index)
						range.setEnd(el, index + execResLength)
						return range
					})
				}).flat()
			} catch (e) {
				// 正则表达式不合法
				window.rangesFlat = []
			}
		} else {
			window.rangesFlat = []
		}

		const searchResultsHighlight = new Highlight(...rangesFlat)
		CSS.highlights.set('search-results', searchResultsHighlight)

		// 向背景脚本发送消息以获取当前标签信息
		chrome?.runtime?.sendMessage({
			action: 'saveResult',
			data: {
				isFrame: window.isFrame,
				resultNum: window.rangesFlat.length,
				isAuto
			}
		}, response => {
			setCurrent(response.current)
			setTotal(response.total)
		})
	}

	const goPrev = async () => {
		let { activeResult, resultSum } = await chrome.storage.session.get(['activeResult', 'resultSum']);
		const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
		activeResult = activeResult || 0;
		activeResult--;
		if (activeResult <= 0) {
			activeResult = sum
		}
		await chrome.storage.session.set({ activeResult: activeResult})

		let temp = 0
		for (let i in resultSum) {
			temp += resultSum[i].sum
			if (activeResult <= temp) {
				setTabIndex(resultSum[i].frameId.toString())
				break;
			}
		}

		setCurrent(activeResult)
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

			setCurrent(activeResult)
		})
	}

	const handleTabChange = async (frameid) => {
		const { resultSum } = await chrome.storage.session.get(['resultSum'])
		setTabIndex(frameid)

		let currentNum = 0;
		for (let item of resultSum) {
			if (item.frameId !== +frameid) {
				currentNum += item.sum;
			} else {
				break;
			}
		}
		await chrome.storage.session.set({ activeResult: currentNum + 1})
		setCurrent(currentNum + 1)
	}

	const clearInput = () => {
		chrome.storage.sync.set({ searchValue: '' }).then(() => {
			setSearchValue('')
			searchInputRef.current.focus()
		})
	}

	const i18n = (text) => {
		if (isChinese.current) {
			return text
		}
		switch (text) {
			case '当前页': return 'Page'
			case '查找结果': return 'Result'
			case '输入文本以查找': return 'Enter text to find'
			case '大小写敏感': return 'Match Case'
			case '匹配单词': return 'Words'
			case '正则表达式': return 'Regex'
			case '实时监测 DOM 变化': return 'Listen for DOM changes in real time'
			case '在不适合实时监测的情况下请临时关闭此功能': return 'Please temporarily disable this function when it is not suitable for real-time monitoring'
			case '隐藏中': return 'Hidden'
			case '被遮盖': return 'Be covered'
		}
	}

	const BottomGradient = () => {
		return (
			<>
				<span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
				<span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
			</>
		);
	};

	return (
		<div id="searchWhateverPopup" style={containerStyle} ref={popContainerRef}>
			<div className="flex justify-center absolute top-[7px] left-0 right-0 m-auto z-10 w-full">
				<div className="w-[50px] h-[3px] bg-[#888888] rounded opacity-30 transition-all duration-300 cursor-move hover:w-20 hover:opacity-100" onMouseDown={startMove}/>
			</div>
			<div className="flex items-center justify-between -mt-0.5 h-7 border-b-1 border-[#f5f5f5] mb-1">
				<Tabs className="w-[262px] !mr-[4px]" activeKey={tabIndex} items={frames.map((f, index) => {
					return {
						disabled: total.find(a => a.frameId === f.frameId) && total.find(a => a.frameId === f.frameId).sum === 0,
						key: f.frameId.toString(),
						label: (
							<div className="flex items-baseline select-none">
								{index === 0 ? i18n('当前页') : `iframe${index}`}
								<div
									className="bg-[#f4f4f4] py-[1px] px-[5px] rounded-[7px] ml-0.5 h-[13px] leading-[14px] box-content">
									{total.find(a => a.frameId === f.frameId) ? total.find(a => a.frameId === f.frameId).sum : 0}
								</div>
							</div>
						)
					}
				})}
					  onChange={handleTabChange}
					  size={'small'}
					  getPopupContainer={e => e.parentElement}
				>
				</Tabs>
				<div id="searchwhatever_result" className="text-xs flex items-center select-none text-[#333] w-[110px] justify-end">
					{
						visibleStatus &&
						<div className="flex items-center text-xs text-[#a0a0a0] cursor-grabbing opacity-60 absolute right-[5px] top-[7px]">
							<svg className="mr-1 w-2.5 h-2.5" viewBox="0 0 1024 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" width="200"
								 height="200">
								<path
									d="M764.394366 588.97307c-93.111887 0-170.503211 64.930254-190.69476 151.667381-47.118423-20.148282-90.861972-14.552338-123.399212-0.562479C429.546366 653.340845 352.155042 588.97307 259.605634 588.97307c-108.255549 0-196.305127 87.862085-196.305127 195.886874C63.300507 892.87031 151.350085 980.732394 259.605634 980.732394c103.207662 0 186.771831-79.468169 194.61769-180.209577 16.831099-11.754366 61.151549-33.575662 115.553352 1.124958C578.747493 901.826704 661.749183 980.732394 764.394366 980.732394c108.255549 0 196.305127-87.862085 196.305127-195.87245 0-108.024789-88.049577-195.886873-196.305127-195.886874z m-504.788732 55.959437c77.405746 0 140.215887 62.694761 140.215887 139.927437 0 77.232676-62.810141 139.898592-140.215887 139.898591-77.405746 0-140.215887-62.665915-140.215888-139.898591 0-77.232676 62.810141-139.927437 140.215888-139.927437z m504.788732 0c77.405746 0 140.215887 62.694761 140.215888 139.927437 0 77.232676-62.810141 139.898592-140.215888 139.898591-77.405746 0-140.215887-62.665915-140.215887-139.898591 0-77.232676 62.810141-139.927437 140.215887-139.927437zM1016.788732 475.943662H7.211268v57.690141h1009.577464v-57.690141zM697.675718 77.016338c-11.538028-26.249014-41.334986-40.094648-69.011831-30.907493L512 85.294873l-117.226366-39.186028-2.769127-0.836507c-27.806648-7.687211-57.026704 7.355493-67.338817 34.426592L196.78107 418.253521h630.43786L698.771831 79.69893l-1.096113-2.682592z"
									fill="#a0a0a0"/>
							</svg>
							<div
								className="inline-block scale-[0.8] origin-left text-xs cursor-grabbing text-[#a0a0a0]">{i18n(visibleStatus)}</div>
						</div>
					}
					{i18n('查找结果')}：<span id="__swe_current" className="mr-1 ml-0.5 inline-block min-w-2.5 text-right">{current}</span> / <span
					className="ml-1 inline-block min-w-2.5 text-left" id="__swe_total">{total.map(a => a.sum).reduce((a, b) => a + b, 0)}</span>
				</div>
			</div>
			<div className="flex items-center w-full">
				<div className="swe_search relative">
					<svg t="1729653477485" className="absolute left-3 top-0 bottom-0 m-auto w-4 h-4 z-10"
						 viewBox="0 0 1024 1024" version="1.1"
						 xmlns="http://www.w3.org/2000/svg" p-id="3578" width="32" height="32">
						<path
							d="M924.352 844.256l-163.968-163.968c44.992-62.912 71.808-139.648 71.808-222.72 0-211.776-172.224-384-384-384s-384 172.224-384 384 172.224 384 384 384c82.56 0 158.912-26.432 221.568-70.912l164.16 164.16c12.416 12.416 38.592 15.04 51.072 2.624l45.248-45.248c12.416-12.544 6.592-35.392-5.888-47.936zM128.128 457.568c0-176.448 143.552-320 320-320s320 143.552 320 320-143.552 320-320 320-320-143.552-320-320z"
							fill="#272636" p-id="3579"></path>
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
						<div className="flex items-center bg-white rounded-lg p-0.5 absolute right-1 top-[6px]">
							{
								searchValue &&
								<svg
									className="absolute -left-[18px] w-3 h-3 opacity-25 hover:opacity-45 cursor-pointer"
									viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em"
									height="1em" fill="currentColor" aria-hidden="true" onClick={clearInput}>
									<path
										d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
								</svg>
							}
							<Button type="text" className="w-5 !h-5 min-w-5 cursor-pointer rounded-[6px] !inline-flex items-center justify-center"
									onClick={goPrev}>
								<svg t="1729650340592" className="w-3.5 h-3.5 peer/svg" viewBox="0 0 1024 1024"
									 version="1.1"
									 xmlns="http://www.w3.org/2000/svg" p-id="1466" width="32" height="32">
									<path
										d="M512.00988746 141.21142578c10.45623779 0 19.24145531 3.50024414 26.37542748 10.71331811l259.5421145 259.55200196C805.03668189 418.58105492 808.63085938 427.33660865 808.63085938 437.84228516c0 10.60949731-3.53485132 19.46887183-10.56994606 26.46936011-7.02026391 7.00543237-15.88952661 10.60949731-26.50891137 10.60949731-10.44140625 0-19.22167969-3.60900903-26.35565185-10.71331811L549.09863305 267.79370094V845.7097168c0 10.19915748-3.62384057 18.94976782-10.89624071 26.16284179-7.23284888 7.31195068-15.97357177 10.91601563-26.2122798 10.91601563-10.23376465 0-18.959656-3.60900903-26.22216796-10.91601563-7.24273705-7.21307397-10.87646508-15.96862769-10.87646508-26.16284179V267.79370094l-196.10760522 196.41906761C271.65484619 471.31213355 262.87951684 474.92114258 252.41833496 474.92114258c-10.61938477 0-19.45898438-3.60900903-26.4990232-10.60949731C218.86444068 457.31115699 215.36914062 448.45178247 215.36914062 437.84228516c0-10.50567651 3.55462623-19.26123023 10.69354248-26.36553931l259.53717042-259.55200196C492.7288816 144.71166992 501.52398658 141.21142578 511.97033691 141.21142578h0.03955055z"
										p-id="1467"></path>
								</svg>
							</Button>
							<Button type="text" className="w-5 !h-5 min-w-5 ml-1 cursor-pointer rounded-[6px] !inline-flex items-center justify-center"
									onClick={goNext}>
								<svg t="1729650383779" className="w-3.5 h-3.5" viewBox="0 0 1024 1024" version="1.1"
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
								title={<div className="scale-90 origin-left">{i18n('大小写敏感')}</div>}
							>
								<button
									className={`relative cursor-pointer group/btn justify-center flex w-5 h-5 items-center text-black rounded-[6px] dark:bg-zinc-900 bg-white ml-1 px-[0px] ${isMatchCase ? 'activeButton' : ''}`}
									onClick={handleIsMatchCaseChange}
								>
									<span className="text-xs select-none">Cc</span>
									<BottomGradient/>
								</button>
							</Tooltip>
							<Tooltip
								arrowPointAtCenter={true}
								placement="bottom"
								getPopupContainer={(e) => e.parentElement}
								title={<div className="scale-90 origin-left">{i18n('匹配单词')}</div>}
							>
								<button
									className={`relative cursor-pointer group/btn justify-center flex w-5 h-5 items-center text-black rounded-[6px] dark:bg-zinc-900 bg-white ml-1 px-[0px] ${isWord ? 'activeButton' : ''}`}
									onClick={handleIsWordChange}
								>
									<span className="text-xs select-none">W</span>
									<BottomGradient/>
								</button>
							</Tooltip>
							<Tooltip
								arrowPointAtCenter={true}
								placement="bottom"
								getPopupContainer={(e) => e.parentElement}
								title={<div className="scale-90 origin-left">{i18n('正则表达式')}</div>}
							>
								<button
									className={`relative cursor-pointer group/btn justify-center flex w-5 h-5 items-center text-black rounded-[6px] dark:bg-zinc-900 bg-white ml-1 px-[0px] ${isReg ? 'activeButton' : ''}`}
									onClick={handleIsRegChange}
								>
									<span className="text-xs select-none">.*</span>
									<BottomGradient/>
								</button>
							</Tooltip>
							<Tooltip
								arrowPointAtCenter={true}
								placement="bottomRight"
								getPopupContainer={(e) => e.parentElement}
								title={(
									<div className="text-xs w-[244px] scale-90 origin-left">
										<div>{i18n('实时监测 DOM 变化')}</div>
										<div>{i18n('在不适合实时监测的情况下请临时关闭此功能')}</div>
									</div>
								)}
								align={{offset: [20, 0]}}
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
					<Button type="text" danger shape="circle" className="w-6 !h-6 min-w-0 ml-2 cursor-pointer"
							onClick={closePop}>
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
	)
}
