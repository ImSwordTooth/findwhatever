let resultSum = []
// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab, x, b) => {
    const frames = await chrome.webNavigation.getAllFrames({ tabId: tab.id })
    resultSum = []
    await chrome.storage.session.set({ resultSum: [], frames })

    for (let i of frames) {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id, frameIds: [i.frameId] },
            files: ['action.js']
        })
    }
})

chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.sync.set({ searchValue: '', isMatchCase: false, isWord: false, isReg: false })
    chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })
})

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const { action, data } = message
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (action === 'saveResult') {
        const currentResultIndex = resultSum.findIndex(r => r.frameId === sender.frameId);
        if (sender.tab.active) { // 只取当前 active 的标签页
            if (currentResultIndex > -1) {
                resultSum[currentResultIndex].sum = data.resultNum
            } else {
                resultSum.push({ sum: data.resultNum, frameId: sender.frameId })
            }
            // resultSum[sender.frameId] = data.resultNum
        } else {
            resultSum.splice(currentResultIndex, 1)
        }

        const finalSession = { resultSum, force: new Date().toString() }
        const totalSum = resultSum.map(a => a.sum).reduce((a, b) => a + b, 0)
        if (totalSum > 0) {
            finalSession.activeResult = 1
        } else {
            finalSession.activeResult = 0
        }
        chrome.storage.session.set(finalSession);
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id, frameIds: [0] },
            args: [finalSession.activeResult, resultSum, totalSum],
            func: (current, resultSum, totalSum) => {
                for (let sumItem of resultSum) {
                    const { sum, frameId } = sumItem;
                    const currentButton = document.querySelector(`#searchWhateverPopup .swe_tabs button[data-frameid="${frameId}"]`);
                    if (currentButton) {
                        if (currentButton.querySelector(`.swe_sum`)) {
                            currentButton.querySelector(`.swe_sum`).innerText = sum;
                        } else {
                            currentButton.innerHTML += `<span class="swe_sum">${sum}</span>`;
                        }
                    }
                }

                // 先断开再连接，否则会引起观察者的变动，导致无限循环
                observer.disconnect()
                if (document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_total')) {
                    document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_total').innerText = totalSum;
                }
                document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_current').innerText = current;
                observer.observe(document.body, {
                    subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                    childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                    attributes: false, // 不监听属性值
                    characterData: true // 监听声明的 target 节点上所有字符的变化。
                })
            }
        })
    }
});

const handleStorageChange = async (changes, areaName) => {
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (areaName === 'session') {
        if (changes.activeResult || changes.force) {
            const { resultSum, activeResult: activeResultFromStorage } = await chrome.storage.session.get(['resultSum', 'activeResult']);
            const activeResult = changes.activeResult ? changes.activeResult.newValue : activeResultFromStorage
            const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
            if (activeResult > sum) {
                chrome.storage.session.set({ activeResult: 1 });
                return;
            }
            if (activeResult === 0) {
                chrome.storage.session.set({ activeResult: sum });
                return;
            }

            await chrome.scripting.executeScript({
                target: {tabId: currentTab.id, allFrames: true},
                func: () => {
                    CSS.highlights.delete('search-results-active')
                }
            })

            let temp = 0;
            for (let i in resultSum) {
                temp += resultSum[i].sum;
                if (activeResult <= temp) {
                    await chrome.scripting.executeScript({
                        target: { tabId: currentTab.id, frameIds: [0] },
                        args: [resultSum[i].frameId],
                        func: (currentFrameId) => {
                            const buttons = document.querySelectorAll('#searchWhateverPopup .swe_tabs button');
                            for (let btn of buttons) {
                                btn.classList.remove('active');

                                if (btn.dataset.frameid === currentFrameId.toString()) {
                                    btn.classList.add('active');
                                }
                            }
                        }
                    })
                    await chrome.scripting.executeScript({
                        target: { tabId: currentTab.id, frameIds: [Number(resultSum[i].frameId)] },
                        args: [activeResult - temp + resultSum[i].sum],
                        func: (realIndex) => {
                            CSS.highlights.set('search-results-active', new Highlight(rangesFlat[realIndex - 1]))
                            filteredRangeList[realIndex - 1].scrollIntoView({ behavior: 'instant', block: 'center' })
                            chrome.storage.session.set({ visibleStatus: isElementVisible(filteredRangeList[realIndex - 1]) })
                        }
                    })
                    return;
                }
            }
        }
    }

    if (areaName === 'sync') {
        await chrome.scripting.executeScript({
            target: {tabId: currentTab.id, allFrames: true},
            func: async () => {
                setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg']);
                doSearch()
            }
        })
    }
}

chrome.storage.onChanged.addListener(handleStorageChange)

chrome.tabs.onActivated.addListener(async () => {
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const frames = await chrome.webNavigation.getAllFrames({ tabId: currentTab.id })
    resultSum = []
    await chrome.storage.session.set({ resultSum: [], frames })
    await chrome.scripting.executeScript({
        target: { tabId: currentTab.id, allFrames: true },
        func: () => {
            start();
        }
    })
})
