// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener((tab, x, b) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['action.js']
    })
})

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ searchValue: '', isMatchCase: false, isWord: false, isReg: false })
})
