let treeWalker, allNodes, currentNode, setting = {}, activeHighlightIndex = 0, filteredRangeList = [], rangesFlat;

const observer = new MutationObserver(() => {
    console.log('懂了')
    reCheckTree();
    doSearch();
})

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

    setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg']); // 缓存值

    if (setting.searchValue) {
        searchInput.value = setting.searchValue;
    }
    if (setting.isMatchCase) {
        matchCaseButton.classList.add('active')
    }
    if (setting.isWord) {
        wordButton.classList.add('active')
    }

    searchInput.oninput = (e) => {
        const value = e.target.value.trim();

        // 向背景脚本发送消息以获取当前标签信息
        chrome?.runtime?.sendMessage({
            action: 'saveData',
            data: {
                searchValue: value
            }
        });

        setting.searchValue = value;
        doSearch()
    }

    document.querySelector('#searchWhateverPopup #searchwhatever_result .prev').onclick = () => {
        if (activeHighlightIndex > 1) {
            activeHighlightIndex--;
        } else {
            activeHighlightIndex = rangesFlat.length;
        }
        observer.disconnect()

        document.querySelector('#searchWhateverPopup #searchwhatever_result .current').innerText = activeHighlightIndex;
        console.log(filteredRangeList[activeHighlightIndex - 1])
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

    matchCaseButton.addEventListener('click', (e) => {
        const { classList } = e.currentTarget
        const isActive = classList.contains('active')
        if (isActive) {
            classList.remove('active')
            chrome.runtime.sendMessage({
                action: 'saveData',
                data: {
                    isMatchCase: false
                }
            });
            setting.isMatchCase = false
        } else {
            classList.add('active')
            chrome.runtime.sendMessage({
                action: 'saveData',
                data: {
                    isMatchCase: true
                }
            });
            setting.isMatchCase = true
        }

        doSearch()
    })

    wordButton.onclick = (e) => {
        const { classList } = e.currentTarget
        const isActive = classList.contains('active')
        if (isActive) {
            classList.remove('active')
            chrome.runtime.sendMessage({
                action: 'saveData',
                data: {
                    isWord: false
                }
            });
            setting.isWord = false
        } else {
            classList.add('active')
            chrome.runtime.sendMessage({
                action: 'saveData',
                data: {
                    isWord: true
                }
            });
            setting.isWord = true
        }

        doSearch()
    }

    // 启动后立即进行一次搜索
    doSearch()
}

async function doSearch() {
    const { isMatchCase, searchValue, isWord } = setting

    if (!CSS.highlights) {

        window.postMessage({
            type: '__find_whatever__searchChange__back__',
            value: '不支持 CSS highlights'
        })
        return;
    }

    CSS.highlights.clear();

    if (!searchValue) {
        return
    }

    const allRangeList = allNodes.map(el => ({ el, text: el.textContent }));
    filteredRangeList = []

    rangesFlat = allRangeList.map(({ el, text }) => {
        const indices = [];
        let startPos = 0;
        while (startPos < text.length) {
            let index;

            if (isMatchCase) {
                index = text.indexOf(searchValue, startPos)
            } else {
                index = text.toLowerCase().indexOf(searchValue.toLowerCase(), startPos)
            }

            if (index === -1) {
                break;
            }
            indices.push(index);
            startPos = index + searchValue.length;
        }

        return indices.map((index) => {
            const range = new Range();
            filteredRangeList.push(el.parentElement)
            range.setStart(el, index);
            range.setEnd(el, index + searchValue.length);
            return range;
        })
    }).flat()

    const searchResultsHighlight = new Highlight(...rangesFlat)
    console.log(searchResultsHighlight)

    // 先断开再连接，否则会引起观察者的变动，导致无限循环
    observer.disconnect()
    document.querySelector('#searchWhateverPopup #searchwhatever_result .total').innerText = searchResultsHighlight.size;
    if (searchResultsHighlight.size > 0) {
        activeHighlightIndex = 1
        document.querySelector('#searchWhateverPopup #searchwhatever_result .current').innerText = activeHighlightIndex;
    }
    observer.observe(document.body, {
        subtree: false, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
        childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
        attributes: false, // 不监听属性值
        characterData: true // 监听声明的 target 节点上所有字符的变化。
    })
    CSS.highlights.set('search-results', searchResultsHighlight)
    CSS.highlights.set('search-results-active', new Highlight(rangesFlat[activeHighlightIndex - 1]))
}
