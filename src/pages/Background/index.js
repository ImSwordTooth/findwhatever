const getVisibleFrames = async (tabId, frames) => {
	const promises = frames.map(f => {
		return chrome.scripting.executeScript({
			target: { tabId, frameIds: [f.frameId] },
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
	})

	const results = await Promise.all(promises);

	let visibleFrames = [];
	results.forEach((res, index) => {
		if (res && res[0] && res[0].result) {
			visibleFrames.push(frames[index]);
		}
	});

	const index = visibleFrames.findIndex(r => r.frameId === 0);
	if (index > 0) {
		visibleFrames.unshift(visibleFrames.splice(index, 1)[0]);
	}
	return visibleFrames;
}

// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab) => {
    const frames = (await chrome.webNavigation.getAllFrames({ tabId: tab.id })).filter(a => !a.errorOccurred); // 获取当前标签页下的所有 iframe，去除无效的，去除报错的

	const visibleFrames = await getVisibleFrames(tab.id, frames.sort((a, b) => a.frameId > b.frameId ? 1 : -1 ))
	const resultSum = visibleFrames.map((f) => ({  // 提前定义好结构，有助于后续操作
		frameId: f.frameId,
		sum: 0,
		matchText: []
	}))

	// 重置查找总数，并设置 frames
	await chrome.storage.session.set({
		frames: visibleFrames,
		resultSum,
		activeTabId: tab.id
	})

	if (visibleFrames.length > 0) {

		const injectPromises = visibleFrames.map(i =>
			chrome.scripting.executeScript({
				target: { tabId: tab.id, frameIds: [i.frameId] },
				files: ['./action.bundle.js']
			})
		);
		await Promise.all(injectPromises);
	} else {
		await chrome.scripting.executeScript({
			target: { tabId: tab.id, frameIds: [0] },
			files: ['./action.bundle.js']
		})
	}
})

chrome.runtime.onInstalled.addListener(async (res) => {
	if (res.reason === 'install') {
		chrome.storage.sync.set({ searchValue: '', isMatchCase: false, isWord: false, isReg: false, isLive: true })
		chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })
		chrome.runtime.openOptionsPage()
	}
})

chrome.runtime.onMessage.addListener(async (message, sender) => {
    const { action, data } = message

	if (action === 'search') {
		const { frames, activeTabId, activeResult } = await chrome.storage.session.get(['frames', 'activeTabId', 'activeResult'])
		const currentTabId = activeTabId || sender.tab.id;
		const regRes = await chrome.scripting.executeScript({
			target: { tabId: currentTabId, frameIds: [0] },
			func: async () => {
				// 调用搜索并返回结果
				return await window?.__swe_getSearchReg();
			}
		}) // 容错处理

		const { error, errorType, regContent } = regRes[0].result

		if (error) {
			await chrome.scripting.executeScript({
				target: { tabId: currentTabId, frameIds: [0] },
				args: [error, errorType],
				func: async (e, eT) => {
					window.postMessage({ type: 'swe_updateSearchResult', data: {
							error: e,
							errorType: eT
						} }, '*')
				}
			}) // 容错处理
		} else {
			const searchPromises = frames.map(f =>
				chrome.scripting.executeScript({
					target: { tabId: currentTabId, frameIds: [f.frameId] },
					args: [f.frameId, regContent],
					func: async (frameId, rC) => {
						// 调用搜索并返回结果
						const res = await window?.__swe_doSearchOutside(rC, false);
						return { ...res, frameId: frameId };
					}
				}) // 容错处理
			);
			const executionResults = await Promise.all(searchPromises);

			const newResultSum = executionResults
				.filter(r => r && r[0] && r[0].result)
				.map(r => ({
					frameId: r[0].result.frameId,
					sum: r[0].result.resultNum,
					matchText: r[0].result.matchText
				}));
			//

			const isAuto = data.isAuto;
			// 记录下上次搜索的时间，打开面板后判断超过一定时间后清除查找条件
			const finalSession = { resultSum: newResultSum, lastSearchTime: Date.now() }

			if (isAuto) {
				finalSession.activeResult = activeResult
				finalSession.force = Math.random() + 1 // 加个 force，意味 activeResult 虽然没变，但是我要重新渲染一下高亮
			} else {
				finalSession.activeResult = 0;
			}
			await chrome.storage.session.set(finalSession);

			await chrome.scripting.executeScript({
				target: { tabId: currentTabId, frameIds: [0] },
				args: [finalSession.activeResult, newResultSum],
				func: async (a, r) => {
					window.postMessage({ type: 'swe_updateSearchResult', data: {
							current: a,
							total: r
						} }, '*')
				}
			})
		}
		return true
	}

	if (action === 'closeAction' || action === 'openAction') {
		const currentTabId = sender?.tab?.id;
		if (!currentTabId) return;

		chrome.storage.sync.get('styleText', (res) => {
			const cssParam = {
				target: { tabId: currentTabId, allFrames: true },
				css: res?.styleText || `::highlight(search-results) { background-color: #ffff37; color: black; } ::highlight(search-results-active) { background-color: #ff8b3a; color: black; }`
			};

			if (action === 'closeAction') {
				chrome.scripting.removeCSS(cssParam).catch(()=>null);
			} else {
				chrome.scripting.insertCSS(cssParam).catch(()=>null);
			}
		})

		return true
	}

	if (action === 'openOptionsPage') {
		chrome.runtime.openOptionsPage()
	}
});

const handleStorageChange = async (changes, areaName) => {
    if (areaName === 'session') {
        if (changes.activeResult || changes.force) {
            const { resultSum, activeResult: activeResultFromStorage, frames, activeTabId } = await chrome.storage.session.get(['resultSum', 'activeResult', 'frames', 'activeTabId']);
            const activeResult = changes.activeResult ? changes.activeResult.newValue : activeResultFromStorage

			for (let i in frames) {
				await chrome.scripting.executeScript({
					target: {tabId: activeTabId, frameIds: [frames[i].frameId]},
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
						target: { tabId: activeTabId, frameIds: [Number(resultSum[i].frameId)] },
						args: [activeResult - temp + resultSum[i].sum, !changes.force],
						func: (realIndex, isAuto) => {
							if (!window.rangesFlat) {
								return
							}
							CSS.highlights.set('search-results-active', new Highlight(window.rangesFlat[realIndex - 1]))

							let currentActiveRangeDOM = filteredRangeList.value[realIndex - 1]
							if (!currentActiveRangeDOM) {
								return;
							}
							// dom 有可能是 shadow-dom，好多 dom api 都不能用，所以指向为其父元素
							if (currentActiveRangeDOM instanceof ShadowRoot || currentActiveRangeDOM.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
								currentActiveRangeDOM = currentActiveRangeDOM.host
							}

							if (isAuto) {
								let parents = [currentActiveRangeDOM];
								let currentDom = currentActiveRangeDOM.parentElement;
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
							chrome.storage.session.set({ visibleStatus: window.__swe_isElementVisible(currentActiveRangeDOM) })
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

	if (currentTab.url.indexOf('http') < 0) {
		return;
	}

	const { activeTabId } = await chrome.storage.session.get('activeTabId');
	const oldTabId = activeTabId;

	await chrome.storage.session.set({ activeTabId: currentTab.id });

	// 停用旧的标签页的isLive
	if (oldTabId && oldTabId !== currentTab.id) {
		await chrome.scripting.executeScript({
			target: { tabId: oldTabId, allFrames: true },
			func: async () => {
				window.__swe_observer?.disconnect()
			}
		}).catch(() => null)
	}

    const res = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id, frameIds: [0] },
        func: async () => {
            return !!document.getElementById('__swe_container')
        }
    })

    if (res[0].result) {
		let frames = (await chrome.webNavigation.getAllFrames({ tabId: currentTab.id })).filter(a => !a.errorOccurred)

		const visibleFrames = await getVisibleFrames(currentTab.id, frames)
		await chrome.storage.session.set({ resultSum: [], frames: visibleFrames });

		if (visibleFrames.length > 0) {
			for (let i in visibleFrames) {
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
						window.observerBodyAndOpenShadowRoot()
					}
				})
			}
		} else {
			chrome.scripting.executeScript({
				target: {tabId: currentTab.id, frameIds: [0]},
				func: async () => {
					window.__swe_doSearchOutside(false, (response) => {
						if (window.isFrame) {
							window.parent.postMessage({ type: 'swe_updateSettings', data: response }, '*')
						} else {
							window.postMessage({ type: 'swe_updateSettings', data: response }, '*')
						}
					})
					window.observerBodyAndOpenShadowRoot()
				}
			})
		}
    }
})
