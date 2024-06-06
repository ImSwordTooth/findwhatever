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

const getCurrentTab = async () => {
    console.log('123')
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab)
    return tab;
}

// 创建一个自定义的弹出窗口
const createPopup = async () => {
    const popup = document.createElement('div');
    popup.id = 'searchWhateverPopup';
    popup.style.position = 'fixed';
    popup.style.top = '10%';
    popup.style.right = '10%';
    // popup.style.width = '300px';
    // popup.style.height = '200px';
    popup.style.backgroundColor = '#fff';
    popup.style.boxShadow = '0px 0px 5px 0px rgba(0,0,0,.02),0px 2px 10px 0px rgba(0,0,0,.06),0px 0px 1px 0px rgba(0,0,0,.3)';
    popup.style.zIndex = '10000';
    popup.style.padding = '12px 12px 10px 12px';
    popup.style.borderRadius = '8px';

    // 添加内容
    const content = document.createElement('div');
    content.innerHTML = `<div class="wp">
        <div class="tabs" aria-label="Options">
        
        </div>
        
        <div class="searchWp">
            <div class="search">

        
        <input id="searchInput" autofocus type="text" placeholder="搜索关键字" />

        <div class="toolbar">
            <span id="matchCase">Cc</span>
            <span id="word">W</span>
            <span id="reg">.*</span>
        </div>
    </div>
    
    <div class="close">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M12.47232 12.51328C26.74688-1.76128 49.5104-2.90816 65.15712 9.84064l2.93888 2.70336L1009.664 955.37152c14.96064 14.80704 15.62624 38.76864 1.51552 54.38464-14.12096 15.616-38.02112 17.3568-54.26176 3.95264l-2.9696-2.70336L12.41088 68.17792c-15.34976-15.39072-15.31904-40.30464 0.06144-55.66464z m0 0" fill="#2C2C2C" /><path d="M1009.67424 12.51328c-14.2848-14.27456-37.04832-15.42144-52.69504-2.67264l-2.99008 2.70336L12.41088 955.37152c-14.96064 14.80704-15.62624 38.76864-1.51552 54.38464 14.12096 15.616 38.02112 17.3568 54.25152 3.95264l2.9696-2.70336 941.568-942.82752c15.34976-15.38048 15.32928-40.30464-0.0512-55.66464h0.04096z m0 0" fill="#2C2C2C" /></svg>
    </div>
</div>

</div>
<div id="searchwhatever_result">
搜索结果：<span class="current">0</span> / <span class="total">0</span>

<div class="prev">
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M877.863693 338.744408 557.862219 18.745191c-24.991331-24.993589-65.516166-24.993589-90.509755 0L147.353249 338.744408c-24.989073 24.993589-24.989073 65.516166 0 90.509755 24.993589 24.995847 65.518424 24.995847 90.509755 0l210.745399-210.747656 0 741.49227c0 35.347753 28.653444 64.001198 64.001198 64.001198 35.343237 0 63.99894-28.651187 63.99894-64.001198l0.002257-741.49227 210.747656 210.745399c12.494537 12.496794 28.874707 18.74632 45.25262 18.74632s32.758083-6.247268 45.254877-18.744063C902.855024 404.258316 902.855024 363.740254 877.863693 338.744408z" fill="#707070" p-id="1491"></path></svg>
</div>
<div class="next">
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M877.863693 338.744408 557.862219 18.745191c-24.991331-24.993589-65.516166-24.993589-90.509755 0L147.353249 338.744408c-24.989073 24.993589-24.989073 65.516166 0 90.509755 24.993589 24.995847 65.518424 24.995847 90.509755 0l210.745399-210.747656 0 741.49227c0 35.347753 28.653444 64.001198 64.001198 64.001198 35.343237 0 63.99894-28.651187 63.99894-64.001198l0.002257-741.49227 210.747656 210.745399c12.494537 12.496794 28.874707 18.74632 45.25262 18.74632s32.758083-6.247268 45.254877-18.744063C902.855024 404.258316 902.855024 363.740254 877.863693 338.744408z" fill="#707070" p-id="9149"></path></svg>
</div>



</div>
`
    const { frames } = await chrome.storage.session.get(['frames']);
    console.log({ frames })
    for (let i=0; i<frames.length; i++) {
        console.log('i', i)
        content.querySelector('.wp .tabs').innerHTML +=`<button class="${i === 0 ? 'active' : ''}" data-frameid="${frames[i].frameId}">
            <div>${ i === 0 ? '当前页' : `iframe ${i}` }</div>
        </button>`

    }
    popup.appendChild(content);

    popup.getElementsByClassName('close')[0].onclick = () => {
        observer.disconnect()
        CSS.highlights.clear();
        document.body.removeChild(popup);
        chrome.storage.onChanged.removeListener(handleStorageChange)
    }

    // 插入到页面
    document.body.appendChild(popup);
}


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
            // 暂时去掉记忆功能
            // searchInput.value = setting.searchValue;
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
            setting.searchValue = value;
            // 主界面执行完搜索之后，通知 frame 可以搜索了
            await doSearch()
            chrome.storage.local.set({ searchInFrame: Math.random() })
            console.log('搜了！！')
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

    // 向背景脚本发送消息以获取当前标签信息
    chrome?.runtime?.sendMessage({
        action: 'saveResult',
        data: {
            isFrame,
            resultNum: rangesFlat.length
        }
    });

    if (searchResultsHighlight.size > 0) {
        activeHighlightIndex = 1
        if (!isFrame) {
            document.querySelector('#searchWhateverPopup #searchwhatever_result .current').innerText = activeHighlightIndex;
        }
        CSS.highlights.set('search-results-active', new Highlight(rangesFlat[activeHighlightIndex - 1]))
    }
}
const handleStorageChange = async (changes, areaName) => {
    if(areaName === 'local') {
        if (isFrame && changes.searchInFrame) {
            setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg']);
            doSearch()
        }
    }
    if (areaName === 'session') {
        console.log({ changes })
        if (!isFrame && changes.resultSum) {
            let sum = 0;
            for (let i in changes.resultSum.newValue) {
                sum += changes.resultSum.newValue[i]
                console.log(`#searchWhateverPopup .wp .tabs button[data-frameid="${i}"] .sum`)
                const currentButton = document.querySelector(`#searchWhateverPopup .wp .tabs button[data-frameid="${i}"]`);
                if (currentButton) {
                    if (currentButton.querySelector(`.sum`)) {
                        currentButton.querySelector(`.sum`).innerText = changes.resultSum.newValue[i];
                    } else {
                        currentButton.innerHTML += `<span class="sum">${changes.resultSum.newValue[i]}</span>`;
                    }
                }

            }
            if (document.querySelector('#searchWhateverPopup #searchwhatever_result .total')) {
                document.querySelector('#searchWhateverPopup #searchwhatever_result .total').innerText = sum;

            }
        }
    }
}
chrome.storage.onChanged.addListener(handleStorageChange)
