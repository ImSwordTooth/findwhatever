let resultSum = []
let activeTabIdHistoryList = ['',''] // 当前活跃的标签页的id的历史记录，chrome api 不提供旧的标签页信息，只能获取新的，所以自己保存一下。[0] 是旧的， [1] 是新的
let pageFrames = [] // 当前页面中的 frames
// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab) => {
    const frames = (await chrome.webNavigation.getAllFrames({ tabId: tab.id })).filter(a => !a.errorOccurred).filter(f => f.url.indexOf('http') > -1); // 获取当前标签页下的所有 iframe，去除无效的，去除报错的
	activeTabIdHistoryList[1] = tab.id
	let visibleFrames = [] // 有内容的 frames

    for (let i of frames.sort((a, b) => a.frameId > b.frameId ? 1 : -1 )) {
		const res = await chrome.scripting.executeScript({
			target: { tabId: tab.id, frameIds: [i.frameId] },
			func: () => {
				function hasVisibleText() {
					const treeWalker = document.createTreeWalker(
						document.body,
						NodeFilter.SHOW_TEXT
					);

					while (treeWalker.nextNode()) {
						const text = treeWalker.currentNode.textContent.trim();
						const parent = treeWalker.currentNode.parentElement; // 检查文本节点是否在可见元素内

						if (text.length > 0 &&
							parent.tagName !== 'SCRIPT' &&
							parent.tagName !== 'STYLE' &&
							parent.tagName !== 'NOSCRIPT') {
							return true;
						}
					}
					return false;
				}
				return hasVisibleText()
			}
		})

		if (res[0].result) {
			visibleFrames.push(i)
		}
    }

	const index = visibleFrames.findIndex(r => r.frameId === 0);
	if (index > 0) {
		visibleFrames.unshift(visibleFrames.splice(index, 1)[0])
	}

	pageFrames = visibleFrames
	resultSum = visibleFrames.map((f) => ({  // 提前定义好结构，有助于后续操作
		frameId: f.frameId,
		sum: 0,
		matchText: []
	}))

	// 重置查找总数，并设置 frames
	await chrome.storage.session.set({
		frames: pageFrames,
		resultSum
	})

	for (let i of visibleFrames) {
		// 插入脚本
		await chrome.scripting.executeScript({
			target: { tabId: tab.id, frameIds: [i.frameId] },
			files: ['./action.bundle.js']
		})
	}
})

chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.sync.set({ searchValue: '', isMatchCase: false, isWord: false, isReg: false, isLive: true })
    chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, data } = message

	if (action === 'saveResult') {
		const currentResultIndex = resultSum.findIndex(r => r.frameId === sender.frameId);
		const isAuto = data.isAuto;
		if (sender.tab.active) { // 只取当前 active 的标签页，保存查找总数
			if (currentResultIndex > -1) {
				resultSum[currentResultIndex].sum = data.resultNum
				resultSum[currentResultIndex].matchText = data.matchText
			} else {
				resultSum.push({ sum: data.resultNum, frameId: sender.frameId, matchText: data.matchText })
			}
		} else { // 不在当前标签页的，删掉
			resultSum.splice(currentResultIndex, 1)
		}

		const finalSession = { resultSum }

		chrome.storage.session.get(['activeResult'], (res) => {
			if (isAuto) {
				finalSession.activeResult = res.activeResult
				finalSession.force = Math.random() + 1 // 加个 force，意味 activeResult 虽然没变，但是我要重新渲染一下高亮
			} else {
				finalSession.activeResult = 0;
			}
			chrome.storage.session.set(finalSession);
			sendResponse({ current: finalSession.activeResult, total: resultSum })
		})
		return true;
	}

	if (action === 'search') {
		for (let i in pageFrames) {
			chrome.scripting.executeScript({
				target: {tabId: activeTabIdHistoryList[1], frameIds: [pageFrames[i].frameId]},
				func: async () => {
					window.__swe_doSearchOutside(false, (response) => {
						if (window.isFrame) {
							window.parent.postMessage({ type: 'swe_updateSearchResult', data: response }, '*')
						} else {
							window.postMessage({ type: 'swe_updateSearchResult', data: response }, '*')
						}
					})
				}
			})
		}
	}

	if (action === 'closeAction') {
		chrome.storage.sync.get('styleText', (res) => {
			chrome.scripting.removeCSS({
				target: { tabId: activeTabIdHistoryList[1], allFrames: true },
				css: res?.styleText || `
            ::highlight(search-results) {
    			background-color: #ffff37;
    			color: black;
			}
			::highlight(search-results-active) {
    			background-color: #ff8b3a;
    			color: black;
			}
		`
			})
		})
	}

	if (action === 'openAction') {
		chrome.storage.sync.get('styleText', (res) => {
			chrome.scripting.insertCSS({
				target: { tabId: activeTabIdHistoryList[1], allFrames: true },
				css: res?.styleText || `
            ::highlight(search-results) {
    			background-color: #ffff37;
    			color: black;
			}
			::highlight(search-results-active) {
    			background-color: #ff8b3a;
    			color: black;
			}
		`
			})
		})
	}

	if (action === 'openOptionsPage') {
		chrome.runtime.openOptionsPage()
	}
});

const handleStorageChange = async (changes, areaName) => {
    if (areaName === 'session') {
        if (changes.activeResult || changes.force) {
            const { resultSum, activeResult: activeResultFromStorage } = await chrome.storage.session.get(['resultSum', 'activeResult']);
            const activeResult = changes.activeResult ? changes.activeResult.newValue : activeResultFromStorage

			for (let i in pageFrames) {
				await chrome.scripting.executeScript({
					target: {tabId: activeTabIdHistoryList[1], frameIds: [pageFrames[i].frameId]},
					func: () => {
						CSS.highlights.delete('search-results-active')
					}
				})
			}

			if (activeResult === 0) {
				return;
			}

			let temp = 0;
			for (let i in resultSum) {
				temp += resultSum[i].sum;
				if (activeResult <= temp) {
					chrome.scripting.executeScript({
						target: { tabId: activeTabIdHistoryList[1], frameIds: [Number(resultSum[i].frameId)] },
						args: [activeResult - temp + resultSum[i].sum, !changes.force],
						func: (realIndex, isAuto) => {
							if (!window.rangesFlat) {
								return
							}
							CSS.highlights.set('search-results-active', new Highlight(window.rangesFlat[realIndex - 1]))
							if (isAuto) {
								let parents = [filteredRangeList.value[realIndex - 1]];
								let currentDom = filteredRangeList.value[realIndex - 1].parentElement;
								while (currentDom) {
									parents.unshift(currentDom);
									currentDom = currentDom.parentElement;
								}
								for (let dom of parents) {
									if (dom.tagName === 'DETAILS') {
										dom.setAttribute('open', true)
									}
									dom.scrollIntoView({ behavior: 'instant', block: 'center' })
								}
							}
							chrome.storage.session.set({ visibleStatus: window.__swe_isElementVisible(filteredRangeList.value[realIndex - 1]) })
						}
					})
					break;
				}
			}
        }
    }
}

chrome.storage.onChanged.addListener(handleStorageChange)

chrome.tabs.onActivated.addListener(async () => {
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
	if (activeTabIdHistoryList[1]) {
		activeTabIdHistoryList[0] = activeTabIdHistoryList[1]
	}
	activeTabIdHistoryList[1] = currentTab.id
	if (currentTab.url.indexOf('http') < 0) {
		return;
	}
    let frames = await chrome.webNavigation.getAllFrames({ tabId: currentTab.id })
	frames = frames.filter(a => !a.errorOccurred).filter(f => f.url.indexOf('http') > -1)
    resultSum = []
	pageFrames = frames
    await chrome.storage.session.set({ resultSum: [], frames })

	// 停用旧的标签页的isLive
	if (activeTabIdHistoryList[0]) {
		await chrome.scripting.executeScript({
			target: { tabId: activeTabIdHistoryList[0], allFrames: true },
			func: async () => {
				window.__swe_observer.disconnect()
			}
		})
	}

    const res = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id, frameIds: [0] },
        func: async () => {
            return !!document.getElementById('__swe_container')
        }
    })

    if (res[0].result) {
		for (let i in frames) {
			chrome.scripting.executeScript({
				target: {tabId: currentTab.id, frameIds: [frames[i].frameId]},
				func: async () => {
					window.__swe_doSearchOutside(false, (response) => {
						if (window.isFrame) {
							window.parent.postMessage({ type: 'swe_updateSettings', data: response }, '*')
						} else {
							window.postMessage({ type: 'swe_updateSettings', data: response }, '*')
						}
					})
					window.observerAllExceptMe()
				}
			})
		}
    }
})
