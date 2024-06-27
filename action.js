// 每次点击的时候才开始创建 dom 查找树，否则会 dom 节点过旧
reCheckTree()
chrome.storage.local.set({ frameList: [] })

if (!isFrame) {
    if (document.getElementById('searchWhateverPopup')) {
        // 如果已存在相同的弹出窗口，将其移除
        observer.disconnect()
        CSS.highlights.clear();
        document.getElementById('searchWhateverPopup').remove();
    } else {

        // 创建新的弹出窗口
        createPopup().then(() => {
            document.getElementById('swe_searchInput').focus()
            start()
        });
    }
} else {
    start()
}

