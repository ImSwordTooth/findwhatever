let resultSum = []
// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab) => {
    const frames = (await chrome.webNavigation.getAllFrames({ tabId: tab.id })).filter(f => f.url !== 'about:blank'); // 获取当前标签页下的所有 iframe，去除无效的
    resultSum = []
    await chrome.storage.session.set({ resultSum: [], frames }) // 重置查找总数，并设置 frames
    for (let i of frames) {
        // 插入脚本
        await chrome.scripting.executeScript({
            target: { tabId: tab.id, frameIds: [i.frameId] },
            files: ['action.js']
        })
    }
})

chrome.runtime.onInstalled.addListener(async () => {
    chrome.storage.sync.set({ searchValue: '', isMatchCase: false, isWord: false, isReg: false, isLive: true, normalColor: '#ffff37', activeColor: '#ff8b3a' })
    chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })
})

chrome.runtime.onMessage.addListener(async (message, sender) => {
    const { action, data } = message
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const { isLive, normalColor, activeColor } = await chrome.storage.sync.get(['isLive', 'normalColor', 'activeColor']);

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
        const totalSum = resultSum.map(a => a.sum).reduce((a, b) => a + b, 0)

        const { activeResult: activeResultFromStorage } = await chrome.storage.session.get(['activeResult']);

        if (isAuto) {
            finalSession.activeResult = activeResultFromStorage
        } else {
            finalSession.activeResult = 0;
        }
        chrome.storage.session.set(finalSession);
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id, frameIds: [0] },
            args: [finalSession.activeResult, resultSum, totalSum, isLive],
            func: (current, resultSum, totalSum, isLive) => {
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
                if (isLive) {
                    observer.observe(document.body, {
                        subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                        childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                        attributes: false, // 不监听属性值
                        characterData: true // 监听声明的 target 节点上所有字符的变化。
                    })
                }
            }
        })
    }

    if (action === 'closeAction') {
        chrome.scripting.removeCSS({
            target: { tabId: currentTab.id, allFrames: true },
            css: `::highlight(search-results) {
    background-color: ${normalColor};
    color: black;
}
::highlight(search-results-active) {
    background-color: ${activeColor};
    color: black;
}`
        })
    }

    if (action === 'openAction') {
        chrome.scripting.insertCSS({
            target: { tabId: currentTab.id, allFrames: true },
            css: `::highlight(search-results) {
    background-color: ${normalColor};
    color: black;
}
::highlight(search-results-active) {
    background-color: ${activeColor};
    color: black;
}`
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
                            let parents = [filteredRangeList[realIndex - 1]];
                            let currentDom = filteredRangeList[realIndex - 1].parentElement;
                            while (currentDom) {
                                parents.unshift(currentDom);
                                currentDom = currentDom.parentElement;
                            }
                            for (let dom of parents) {
                                dom.scrollIntoView({ behavior: 'instant', block: 'center' })
                            }
                            chrome.storage.session.set({ visibleStatus: isElementVisible(filteredRangeList[realIndex - 1]) })

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
                    setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive']);
                    doSearch()
                }
            })
        }

        // 它俩只能一起改
            if (changes.normalColor !== undefined && changes.activeColor !== undefined) {

                const oldNormal = changes.normalColor.oldValue;
                const newNormal = changes.normalColor.newValue;
                const oldActive = changes.activeColor.oldValue;
                const newActive = changes.activeColor.newValue;

                await chrome.scripting.removeCSS({
                    target: { tabId: currentTab.id, allFrames: true },
                    css: `::highlight(search-results) {
    background-color: ${oldNormal};
    color: black;
}
::highlight(search-results-active) {
    background-color: ${oldActive};
    color: black;
}`
                })

                await chrome.scripting.insertCSS({
                    target: { tabId: currentTab.id, allFrames: true },
                    css: `::highlight(search-results) {
    background-color: ${newNormal};
    color: black;
}
::highlight(search-results-active) {
    background-color: ${newActive};
    color: black;
}`
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
