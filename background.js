// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab, x, b) => {
    await chrome.storage.session.set({ resultSum: {} })
    await chrome.storage.session.set({ frames: [] })
    const [ currentTab ] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const frames = await chrome.webNavigation.getAllFrames({ tabId: currentTab.id })
    await chrome.storage.session.set({ frames })

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

let resultSum = {};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message, sender)
    const { action, data } = message
    if (action === 'saveResult') {
        // 只取当前 active 的标签页
        if (sender.tab.active) {
            resultSum[sender.frameId] = data.resultNum
        } else {
            delete resultSum[sender.frameId]
        }
        console.log(resultSum)
        chrome.storage.session.set({ resultSum })
    }
});
