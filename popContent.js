let isFrame,
    treeWalker,
    allNodes,
    currentNode,
    setting = {},
    activeHighlightIndex = 0,
    filteredRangeList = [],
    rangesFlat;

isFrame = window !== window.top;

const observer = new MutationObserver(() => {
    reCheckTree();
    doSearch();
})

// 生成匹配节点树
const reCheckTree = () => {
    treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, (node) => {
        // 父元素是 svg、script、script 的时候，不置入范围
        if (['svg', 'STYLE', 'SCRIPT'].includes(node.parentNode.nodeName)) {
            return NodeFilter.FILTER_REJECT
        } else {
            return NodeFilter.FILTER_ACCEPT
        }
    })

    allNodes = [];
    currentNode = treeWalker.nextNode();
    while (currentNode) {
        allNodes.push(currentNode)
        currentNode = treeWalker.nextNode();
    }
}

const start = async () => {
    const searchInput = document.querySelector('#searchWhateverPopup #searchInput'); // 搜索框
    const matchCaseButton = document.querySelector('#searchWhateverPopup #matchCase');
    const wordButton = document.querySelector('#searchWhateverPopup #word');
    const regButton = document.querySelector('#searchWhateverPopup #reg');

    setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg']); // 缓存值

    // 仅在主界面进行一些 dom 的操作，frame 内的只搜索
    if (!isFrame) {
        // 获取用户选中的文本，有就立即填进去
        const selection = window.getSelection().toString();
        if (selection) {
            searchInput.value = selection;
            chrome.storage.sync.set({ searchValue: selection })
            setting.searchValue = selection;
        } else if (setting.searchValue) {
            searchInput.value = setting.searchValue;
        }
        if (setting.isMatchCase) {
            matchCaseButton.classList.add('active')
        }
        if (setting.isWord) {
            wordButton.classList.add('active')
        }
        if (setting.isReg) {
            regButton.classList.add('active')
        }

        searchInput.oninput = async (e) => {
            const value = e.target.value.trim();
            // 向背景脚本发送消息以获取当前标签信息
            await chrome.storage.sync.set({ searchValue: value })
            await chrome.storage.local.set({ frameList: [] })
            setting.searchValue = value;
            // 主界面执行完搜索之后，通知 frame 可以搜索了
            await doSearch()
            chrome.storage.local.set({ searchInFrame: Math.random() })
        }


        matchCaseButton.onclick = async (e) => {
            const { classList } = e.currentTarget
            const isActive = classList.contains('active')
            if (isActive) {
                classList.remove('active')
            } else {
                classList.add('active')
            }
            await chrome.storage.sync.set({ isMatchCase: !isActive })
            await chrome.storage.local.set({ frameList: [] })
            setting.isMatchCase = !isActive
            await doSearch()
            chrome.storage.local.set({ searchInFrame: Math.random() })
        }

        wordButton.onclick = async (e) => {
            const { classList } = e.currentTarget
            const isActive = classList.contains('active')
            if (isActive) {
                classList.remove('active')
            } else {
                classList.add('active')
            }

            await chrome.storage.sync.set({ isWord: !isActive })
            await chrome.storage.local.set({ frameList: [] })
            setting.isWord = !isActive
            await doSearch()
            chrome.storage.local.set({ searchInFrame: Math.random() })
        }

        regButton.onclick = async (e) => {
            const { classList } = e.currentTarget
            const isActive = classList.contains('active')
            if (isActive) {
                classList.remove('active')
            } else {
                classList.add('active')
            }

            await chrome.storage.sync.set({ isReg: !isActive })
            await chrome.storage.local.set({ frameList: [] })
            setting.isReg = !isActive
            await doSearch()
            chrome.storage.local.set({ searchInFrame: Math.random() })
        }

        document.querySelector('#searchWhateverPopup #searchwhatever_result .prev').onclick = () => {
            if (activeHighlightIndex > 1) {
                activeHighlightIndex--;
            } else {
                activeHighlightIndex = rangesFlat.length;
            }
            observer.disconnect()

            document.querySelector('#searchWhateverPopup #searchwhatever_result .current').innerText = activeHighlightIndex;
            filteredRangeList[activeHighlightIndex - 1].scrollIntoView({ behavior: 'instant', block: 'center' })
            observer.observe(document.body, {
                subtree: false, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                attributes: false, // 不监听属性值
                characterData: true // 监听声明的 target 节点上所有字符的变化。
            })
            CSS.highlights.set('search-results-active', new Highlight(rangesFlat[activeHighlightIndex - 1]))
        }

        document.querySelector('#searchWhateverPopup #searchwhatever_result .next').onclick = () => {
            if (activeHighlightIndex < rangesFlat.length) {
                activeHighlightIndex++;
            } else {
                activeHighlightIndex = 1;
            }
            observer.disconnect()

            document.querySelector('#searchWhateverPopup #searchwhatever_result .current').innerText = activeHighlightIndex;
            filteredRangeList[activeHighlightIndex - 1].scrollIntoView({ behavior: 'instant', block: 'center' })
            observer.observe(document.body, {
                subtree: false, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                attributes: false, // 不监听属性值
                characterData: true // 监听声明的 target 节点上所有字符的变化。
            })
            CSS.highlights.set('search-results-active', new Highlight(rangesFlat[activeHighlightIndex - 1]))
        }
    }

    // 启动后立即进行一次搜索
    doSearch()
}

async function doSearch() {
    const { isMatchCase, searchValue, isWord, isReg } = setting

    CSS.highlights.clear();

    if (!searchValue) {
        return
    }

    const allRangeList = allNodes.map(el => ({ el, text: el.textContent }));
    filteredRangeList = []

    rangesFlat = allRangeList.map(({ el, text }) => {
        const indices = [];
        let startPos = 0;

        let regContent = searchValue
        if (!isReg) {
            regContent = regContent.replace(/([^a-zA-Z0-9_ \n])/g, '\\$1')
        }
        if (isWord) {
            regContent = `\\b${regContent}\\b`
        }
        let execResLength = searchValue.value; // 匹配结果的长度，一般情况下等于字符长度，如果是正则，就得是正则结果的长度
        const reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dg`);

        while (startPos < text.length) {
            let index;
            const res = reg.exec(text.substring(startPos));

            if (res) {
                index = res.indices[0][0]
                execResLength = res.indices[0][1] - res.indices[0][0]
            } else {
                index = -1;
                break;
            }

            indices.push(startPos + index);
            startPos += index + execResLength;
        }

        return indices.map((index) => {
            const range = new Range();
            filteredRangeList.push(el.parentElement)
            range.setStart(el, index);
            range.setEnd(el, index + execResLength);
            return range;
        })
    }).flat()

    const searchResultsHighlight = new Highlight(...rangesFlat)

    // 先断开再连接，否则会引起观察者的变动，导致无限循环
    observer.disconnect()
    // document.querySelector('#searchWhateverPopup #searchwhatever_result .total').innerText = searchResultsHighlight.size;
    observer.observe(document.body, {
        subtree: false, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
        childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
        attributes: false, // 不监听属性值
        characterData: true // 监听声明的 target 节点上所有字符的变化。
    })
    CSS.highlights.set('search-results', searchResultsHighlight)
    console.log(searchResultsHighlight)

    let storageFrameList = (await chrome.storage.local.get(['frameList'])).frameList || [];
    console.log({ storageFrameList })
    if (!isFrame) {
        storageFrameList.unshift(rangesFlat.length)
    } else {
        storageFrameList.push(rangesFlat.length)
    }
    await chrome.storage.local.set({ frameList: storageFrameList })

    if (searchResultsHighlight.size > 0) {
        activeHighlightIndex = 1
        if (!isFrame) {
            document.querySelector('#searchWhateverPopup #searchwhatever_result .current').innerText = activeHighlightIndex;
        }
        CSS.highlights.set('search-results-active', new Highlight(rangesFlat[activeHighlightIndex - 1]))
    }
}

chrome.storage.onChanged.addListener(async (changes, areaName) => {

    if(areaName === 'local') {
        if (isFrame && changes.searchInFrame) {
            setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg']);
            doSearch()
        }
        if (!isFrame && changes.frameList) {
            console.log(changes)
            document.querySelector('#searchWhateverPopup #searchwhatever_result .total').innerText = changes.frameList.newValue.reduce((a, b) => a+b, 0);
        }
    }
})
