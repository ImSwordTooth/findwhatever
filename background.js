// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener((tab, x, b) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['action.js']
    })

    // chrome.scripting.registerContentScripts([{
    //     id: 'popContent',
    //     js: ['popContent.js'],
    //     matches: ['<all_urls>']
    // }])
})

chrome.runtime.onInstalled.addListener(() => {
    console.log('插件已安裝')
    chrome.storage.sync.set({ searchValue: '', isMatchCase: false, isWord: false, isReg: false })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    const { action, data } = message
    if (action === 'saveData') {
        console.log(data)
        chrome.storage.sync.set(data)
    }
});

// chrome.storage.sync.get(['isMatchCase', 'isWord', 'isReg']).then(res => {
//     console.log(res)
//     chrome.runtime.sendMessage({ action: 'init', data: res  });
// })

