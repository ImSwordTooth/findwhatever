// 每次点击的时候才开始创建 dom 查找树，否则会 dom 节点过旧
reCheckTree()


// 创建一个自定义的弹出窗口
function createPopup() {
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
    popup.appendChild(content);

    popup.getElementsByClassName('close')[0].onclick = () => {
        observer.disconnect()
        CSS.highlights.clear();
        document.body.removeChild(popup);
    }

    // 插入到页面
    document.body.appendChild(popup);
}

if (document.getElementById('searchWhateverPopup')) {
    // 如果已存在相同的弹出窗口，将其移除
    observer.disconnect()
    CSS.highlights.clear();
    document.getElementById('searchWhateverPopup').remove();
} else {
    // 创建新的弹出窗口
    createPopup();
    start()
    observer.observe(document.body, {
        subtree: false, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
        childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
        attributes: false, // 不监听属性值
        characterData: true // 监听声明的 target 节点上所有字符的变化。
    })
}


