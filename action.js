

// 每次点击的时候才开始创建 dom 查找树，否则会 dom 节点过旧
reCheckTree()
chrome.storage.local.set({ frameList: [] })

console.log({ isFrame })
if (!isFrame) {
    if (document.getElementById('searchWhateverPopup')) {
        // 如果已存在相同的弹出窗口，将其移除
        observer.disconnect()
        CSS.highlights.clear();
        document.getElementById('searchWhateverPopup').remove();
    } else {

        // 创建新的弹出窗口
        createPopup().then(() => {
            start()
            observer.observe(document.body, {
                subtree: false, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                attributes: false, // 不监听属性值
                characterData: true // 监听声明的 target 节点上所有字符的变化。
            })
        });

    }

} else {
    start()
    observer.observe(document.body, {
        subtree: false, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
        childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
        attributes: false, // 不监听属性值
        characterData: true // 监听声明的 target 节点上所有字符的变化。
    })
}

