(async function () {
    // 每次点击的时候才开始创建 dom 查找树，否则会 dom 节点过旧
    reCheckTree()

    if (!isFrame) {
        if (document.getElementById('searchWhateverPopup')) {
            // 如果已存在相同的弹出窗口，将其移除
            observer.disconnect() // 关闭监听器
            CSS.highlights.clear(); // 清除 highlights
            document.getElementById('searchWhateverPopup').remove(); // 移除面板
            chrome.storage.onChanged.removeListener(handleStorageChange) // 关闭监听器
            chrome.storage.session.set({ resultSum: [], frames: [] }) // 重置
            await chrome?.runtime?.sendMessage({ // chrome.scripting 只能在 background.js 里使用，所以不直接在这写了
                action: 'closeAction'
            });
        } else {
            // 创建新的弹出窗口
            await createPopup();
            await chrome?.runtime?.sendMessage({ // chrome.scripting 只能在 background.js 里使用，所以不直接在这写了
                action: 'openAction'
            });
            const selection = window.getSelection().toString()
            if (selection) {
                await chrome.storage.sync.set({ searchValue: window.getSelection().toString() });
            }
            start()
            document.getElementById('swe_searchInput').focus()
        }
    } else {
        start()
    }
})()
