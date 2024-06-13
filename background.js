// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab, x, b) => {
    const frames = await chrome.webNavigation.getAllFrames({ tabId: tab.id })
    await chrome.storage.session.set({ resultSum: [], frames })

    for (let i = 0; i < frames.length; i++) {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id, frameIds: [frames[i].frameId] },
            files: ['action.js']
        })
    }
})

chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.sync.set({ searchValue: '', isMatchCase: false, isWord: false, isReg: false })
    chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })
})

let resultSum = [];
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, data } = message
    if (action === 'saveResult') {
        // 只取当前 active 的标签页
        const currentResultIndex = resultSum.findIndex(r => r.frameId === sender.frameId);
        if (sender.tab.active) {
            if (currentResultIndex > -1) {
                resultSum[currentResultIndex].sum = data.resultNum
            } else {
                resultSum.push({ sum: data.resultNum, frameId: sender.frameId })
            }
            // resultSum[sender.frameId] = data.resultNum
        } else {
            resultSum.splice(currentResultIndex, 1)
        }
        chrome.storage.session.set({ resultSum })
    }
});

const handleStorageChange = async (changes, areaName) => {
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (areaName === 'session') {
        if (changes.activeResult) {
            const { resultSum } = await chrome.storage.session.get(['resultSum']);
            const activeResult = changes.activeResult.newValue
            console.log(activeResult)
            const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
            if (activeResult > sum) {
                chrome.storage.session.set({ activeResult: 1 });
                return;
            }
            if (activeResult === 0) {
                chrome.storage.session.set({ activeResult: sum });
                return;
            }

            let temp = 0;
            for (let i in resultSum) {
                temp += resultSum[i].sum;
                console.log({ temp, activeResult })
                if (activeResult <= temp) {
                    chrome.scripting.executeScript({
                        target: {tabId: currentTab.id, allFrames: true},
                        func: () => {
                            CSS.highlights.delete('search-results-active')
                        }
                    }).then(async () => {
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
                                console.log(rangesFlat, realIndex)
                                CSS.highlights.set('search-results-active', new Highlight(rangesFlat[realIndex - 1]))
                                filteredRangeList[realIndex - 1].scrollIntoView({ behavior: 'instant', block: 'center' })
                                chrome.storage.session.set({ visibleStatus: isElementVisible(filteredRangeList[realIndex - 1]) })
                            }
                        })
                    })
                    return;
                }
            }
        }
    }
}

chrome.storage.onChanged.addListener(handleStorageChange)

chrome.tabs.onActivated.addListener(async () => {
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    await chrome.scripting.executeScript({
        target: { tabId: currentTab.id, allFrames: true },
        func: () => {
            start();
        }
    })
})
