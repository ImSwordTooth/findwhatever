let resultSum = []
// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab) => {
    const frames = (await chrome.webNavigation.getAllFrames({ tabId: tab.id })).filter(f => f.url !== 'about:blank'); // 获取当前标签页下的所有 iframe，去除无效的
    resultSum = []
    await chrome.storage.session.set({ resultSum: [], frames }) // 重置查找总数，并设置 frames
    for (let i of frames.sort((a, b) => a.frameId > b.frameId ? -1 : 1 )) {
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
			} else {
				resultSum.push({ sum: data.resultNum, frameId: sender.frameId })
			}
		} else { // 不在当前标签页的，删掉
			resultSum.splice(currentResultIndex, 1)
		}

		// 保证【当前页】的总是在第一位
		const index = resultSum.findIndex(r => r.frameId === 0);
		if (index > 0) {
			resultSum.unshift(resultSum.splice(index, 1)[0])
		}

		const finalSession = { resultSum, force: Math.random() + 1 }

		chrome.storage.session.get(['activeResult'], (res) => {
			if (isAuto) {
			    finalSession.activeResult = res.activeResult
			} else {
			    finalSession.activeResult = 0;
			}
			chrome.storage.session.set(finalSession);
			sendResponse({ current: finalSession.activeResult, total: resultSum })
		})
		return true;
	}

	if (action === 'closeAction') {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([currentTab]) => {
			chrome.scripting.removeCSS({
				target: { tabId: currentTab.id, allFrames: true },
				css: `::highlight(search-results) {
    background-color: #ffff37;
    color: black;
}
::highlight(search-results-active) {
    background-color: #ff8b3a;
    color: black;
}`
			})
		})
	}

	if (action === 'openAction') {
		chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([currentTab]) => {
			chrome.scripting.insertCSS({
				target: { tabId: currentTab.id, allFrames: true },
				css: `::highlight(search-results) {
    background-color: #ffff37;
    color: black;
}
::highlight(search-results-active) {
    background-color: #ff8b3a;
    color: black;
}`
			})
		})
	}
});

const handleStorageChange = async (changes, areaName) => {
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (areaName === 'session') {
        if (changes.activeResult || changes.force) {
            const { resultSum, activeResult: activeResultFromStorage } = await chrome.storage.session.get(['resultSum', 'activeResult']);
            const activeResult = changes.activeResult ? changes.activeResult.newValue : activeResultFromStorage
            await chrome.scripting.executeScript({
                target: {tabId: currentTab.id, allFrames: true},
                func: () => {
                    CSS.highlights.delete('search-results-active')
                }
            })

            if (activeResult === 0) {
                return;
            }

            let temp = 0;
            for (let i in resultSum) {
                temp += resultSum[i].sum;
                if (activeResult <= temp) {
                    await chrome.scripting.executeScript({
                        target: { tabId: currentTab.id, frameIds: [Number(resultSum[i].frameId)] },
                        args: [activeResult - temp + resultSum[i].sum],
                        func: (realIndex) => {
                            CSS.highlights.set('search-results-active', new Highlight(rangesFlat[realIndex - 1]))
                            let parents = [filteredRangeList[realIndex - 1]];
                            let currentDom = filteredRangeList[realIndex - 1].parentElement;
                            while (currentDom) {
                                parents.unshift(currentDom);
                                currentDom = currentDom.parentElement;
                            }
                            for (let dom of parents) {
                                dom.scrollIntoView({ behavior: 'instant', block: 'center' })
                            }
                            chrome.storage.session.set({ visibleStatus: window.__swe_isElementVisible(filteredRangeList[realIndex - 1]) })

                        }
                    })
                    return;
                }
            }
        }
    }

    if (areaName === 'sync') {
        if (
            changes.searchValue !== undefined ||
            changes.isMatchCase !== undefined ||
            changes.isWord !== undefined ||
            changes.isReg !== undefined ||
            changes.isLive !== undefined
        ) {
            await chrome.scripting.executeScript({
                target: {tabId: currentTab.id, allFrames: true},
                func: async () => {
					window.__swe_doSearchOutside()
                }
            })
        }
    }
}

chrome.storage.onChanged.addListener(handleStorageChange)

chrome.tabs.onActivated.addListener(async () => {
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (currentTab.url.indexOf('http') !== 0) {
        return;
    }
    const frames = await chrome.webNavigation.getAllFrames({ tabId: currentTab.id })
    resultSum = []
    await chrome.storage.session.set({ resultSum: [], frames })

    const res = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id, frameIds: [0] },
        func: async () => {
            return !!document.getElementById('searchWhateverPopup')
        }
    })

    if (res[0].result) {
        for (let i of frames) {
            await chrome.scripting.executeScript({
                target: { tabId: currentTab.id, frameIds: [i.frameId] },
                func: async () => {
                    start();
                }
            })
        }
    }
})
