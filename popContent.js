let isFrame,
    treeWalker,
    allNodes,
    currentNode,
    setting = {},
    filteredRangeList = [],
    rangesFlat;

isFrame = window !== window.top;

// 创建 DOM 监听器
const observer = new MutationObserver(() => {
    reCheckTree(); // 重新生成节点数
    doSearch(true); // 然后执行搜索
})

// 创建一个自定义的弹出窗口
const createPopup = async () => {
    const popup = document.createElement('div');
    const { top, right, normalColor, activeColor } = await chrome.storage.sync.get(['top', 'right', 'normalColor', 'activeColor'])
    popup.id = 'searchWhateverPopup';
    popup.style.position = 'fixed';
    popup.style.top = top ? top + 'px' : '10%';
    popup.style.right = right ? right + 'px' : '10%';
    popup.style.backgroundColor = '#fff';
    popup.style.boxShadow = '0px 0px 5px 0px rgba(0,0,0,.02),0px 2px 10px 0px rgba(0,0,0,.06),0px 0px 1px 0px rgba(0,0,0,.3)';
    popup.style.zIndex = '10000';
    popup.style.padding = '16px 12px 10px 12px';
    popup.style.borderRadius = '8px';

    // 添加内容
    const content = document.createElement('div');
    content.innerHTML = `
<div class="swe_moveWp">
<div class="swe_moveBar"></div>
</div>
<div class="swe_tabsWp">
                            <div class="swe_tabs"></div>
                            <div id="searchwhatever_result">
                                <div class="swe_visible">
                                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M764.394366 588.97307c-93.111887 0-170.503211 64.930254-190.69476 151.667381-47.118423-20.148282-90.861972-14.552338-123.399212-0.562479C429.546366 653.340845 352.155042 588.97307 259.605634 588.97307c-108.255549 0-196.305127 87.862085-196.305127 195.886874C63.300507 892.87031 151.350085 980.732394 259.605634 980.732394c103.207662 0 186.771831-79.468169 194.61769-180.209577 16.831099-11.754366 61.151549-33.575662 115.553352 1.124958C578.747493 901.826704 661.749183 980.732394 764.394366 980.732394c108.255549 0 196.305127-87.862085 196.305127-195.87245 0-108.024789-88.049577-195.886873-196.305127-195.886874z m-504.788732 55.959437c77.405746 0 140.215887 62.694761 140.215887 139.927437 0 77.232676-62.810141 139.898592-140.215887 139.898591-77.405746 0-140.215887-62.665915-140.215888-139.898591 0-77.232676 62.810141-139.927437 140.215888-139.927437z m504.788732 0c77.405746 0 140.215887 62.694761 140.215888 139.927437 0 77.232676-62.810141 139.898592-140.215888 139.898591-77.405746 0-140.215887-62.665915-140.215887-139.898591 0-77.232676 62.810141-139.927437 140.215887-139.927437zM1016.788732 475.943662H7.211268v57.690141h1009.577464v-57.690141zM697.675718 77.016338c-11.538028-26.249014-41.334986-40.094648-69.011831-30.907493L512 85.294873l-117.226366-39.186028-2.769127-0.836507c-27.806648-7.687211-57.026704 7.355493-67.338817 34.426592L196.78107 418.253521h630.43786L698.771831 79.69893l-1.096113-2.682592z"></path></svg>
                                    <div class="swe_visibleStatus"></div>
                                </div>
                                查找结果：<span class="swe_current">0</span> / <span class="swe_total">0</span>
                            </div>
                         </div>
                         <div class="swe_searchWp">
                            <div class="swe_search">
                                <svg class="swe_search_icon" version="1.1" width="13px" height="13px" viewBox="0 0 13.0 13.0" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="i0"><path d="M1440,0 L1440,900 L0,900 L0,0 L1440,0 Z"></path></clipPath><clipPath id="i1"><path d="M5.90691349,0 C9.16926707,0 11.813827,2.64455992 11.813827,5.90691349 C11.813827,7.30893678 11.3252905,8.59699139 10.5094415,9.60985333 C10.5767785,9.62280035 10.6386524,9.6557352 10.6869964,9.70436393 L12.8982668,11.9156344 C13.0339111,12.0513196 13.0339111,12.2712654 12.8982668,12.4069506 L12.4069506,12.8982668 C12.2712654,13.0339111 12.0513196,13.0339111 11.9156344,12.8982668 L9.70436393,10.6869964 C9.65570541,10.6385756 9.62256273,10.5767657 9.60915839,10.5094415 C8.560957,11.3555423 7.25398733,11.8160176 5.90691349,11.813827 C2.6445599,11.813827 0,9.16926707 0,5.90691349 C0,2.6445599 2.64455992,0 5.90691349,0 Z M5.90691349,1.38986199 C3.4121112,1.38986199 1.38986199,3.4121112 1.38986199,5.90691349 C1.38986199,8.40171577 3.4121112,10.423965 5.90691349,10.423965 C8.40171577,10.423965 10.423965,8.40171579 10.423965,5.90691349 C10.423965,3.41211119 8.40171579,1.38986199 5.90691349,1.38986199 Z"></path></clipPath></defs><g transform="translate(-928.0 -186.0)"><g clip-path="url(#i0)"><g transform="translate(928.0 186.0)"><g clip-path="url(#i1)"><polygon points="0,0 13,0 13,13 0,13 0,0" stroke="none" fill="#999999"></polygon></g></g></g></g></svg>
                                <input id="swe_searchInput" autofocus type="text" placeholder="查找" />
                                <div class="swe_toolbar">
                                    <div class="swe_prev"><svg version="1.1" width="20px" height="20px" viewBox="0 0 20.0 20.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="i0"><path d="M1440,0 L1440,900 L0,900 L0,0 L1440,0 Z"></path></clipPath><clipPath id="i1"><path d="M14,0 C17.3137085,-6.08718376e-16 20,2.6862915 20,6 L20,14 C20,17.3137085 17.3137085,20 14,20 L6,20 C2.6862915,20 2.02906125e-16,17.3137085 0,14 L0,6 C-4.05812251e-16,2.6862915 2.6862915,4.05812251e-16 6,0 L14,0 Z"></path></clipPath><clipPath id="i2"><path d="M4.5020472,0 C4.82798928,0 5.09221754,0.273589457 5.09221754,0.611079156 L5.09221754,8.82601993 L7.97578979,5.59137427 C8.0819496,5.47222765 8.22948131,5.40163948 8.38591546,5.39514515 C8.5423496,5.38865082 8.69486567,5.44678256 8.8098972,5.55674646 C8.92510133,5.66660878 8.99333655,5.81943154 8.9995374,5.98147342 C9.00573824,6.1435153 8.9493947,6.30144908 8.84294673,6.42040499 L4.93562567,10.8038795 C4.82378408,10.9289211 4.66664452,11 4.50204719,11 C4.33744987,11 4.18031031,10.9289211 4.06846872,10.8038795 L0.16114767,6.42040499 C0.0152688428,6.26049369 -0.0363473832,6.03174004 0.0260001978,5.82145616 C0.0883477788,5.61117228 0.25503685,5.45181202 0.462444477,5.404201 C0.669852104,5.35658997 0.885968354,5.42807616 1.02830462,5.59137427 L3.91187687,8.82561254 L3.91187687,0.611079156 C3.91187687,0.273589457 4.17610513,0 4.5020472,0 Z"></path></clipPath></defs><g transform="translate(-1156.0 -182.0)"><g clip-path="url(#i0)"><g transform="translate(1156.0 182.0)"><g clip-path="url(#i1)"><polygon points="0,0 20,0 20,20 0,20 0,0" stroke="none" fill="#F5F5F5" opacity="3.78781273%"></polygon></g><g transform="translate(5.5 15.0) scale(1.0 -1.0)"><g clip-path="url(#i2)"><polygon points="-7.10741886e-17,0 9,0 9,11 -7.10741886e-17,11 -7.10741886e-17,0" stroke="none" fill="#888888"></polygon></g></g></g></g></g></svg></div>
                                    <div class="swe_next"><svg version="1.1" width="20px" height="20px" viewBox="0 0 20.0 20.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="i0"><path d="M1440,0 L1440,900 L0,900 L0,0 L1440,0 Z"></path></clipPath><clipPath id="i1"><path d="M14,0 C17.3137085,-6.08718376e-16 20,2.6862915 20,6 L20,14 C20,17.3137085 17.3137085,20 14,20 L6,20 C2.6862915,20 2.02906125e-16,17.3137085 0,14 L0,6 C-4.05812251e-16,2.6862915 2.6862915,4.05812251e-16 6,0 L14,0 Z"></path></clipPath><clipPath id="i2"><path d="M4.5020472,0 C4.82798928,0 5.09221754,0.273589457 5.09221754,0.611079156 L5.09221754,8.82601993 L7.97578979,5.59137427 C8.0819496,5.47222765 8.22948131,5.40163948 8.38591546,5.39514515 C8.5423496,5.38865082 8.69486567,5.44678256 8.8098972,5.55674646 C8.92510133,5.66660878 8.99333655,5.81943154 8.9995374,5.98147342 C9.00573824,6.1435153 8.9493947,6.30144908 8.84294673,6.42040499 L4.93562567,10.8038795 C4.82378408,10.9289211 4.66664452,11 4.50204719,11 C4.33744987,11 4.18031031,10.9289211 4.06846872,10.8038795 L0.16114767,6.42040499 C0.0152688428,6.26049369 -0.0363473832,6.03174004 0.0260001978,5.82145616 C0.0883477788,5.61117228 0.25503685,5.45181202 0.462444477,5.404201 C0.669852104,5.35658997 0.885968354,5.42807616 1.02830462,5.59137427 L3.91187687,8.82561254 L3.91187687,0.611079156 C3.91187687,0.273589457 4.17610513,0 4.5020472,0 Z"></path></clipPath></defs><g transform="translate(-1156.0 -182.0)"><g clip-path="url(#i0)"><g transform="translate(1156.0 182.0)"><g clip-path="url(#i1)"><polygon points="0,0 20,0 20,20 0,20 0,0" stroke="none" fill="#F5F5F5" opacity="3.78781273%"></polygon></g><g transform="translate(5.5 15.0) scale(1.0 -1.0)"><g clip-path="url(#i2)"><polygon points="-7.10741886e-17,0 9,0 9,11 -7.10741886e-17,11 -7.10741886e-17,0" stroke="none" fill="#888888"></polygon></g></g></g></g></g></svg></div>
                                    <span id="matchCase">
                                    Cc
                                    <div class="tooltip">
                                        <div>大小写敏感</div>
                                        <div class="desc">Match Case</div>
                                        </div>
                                    </span>
                                    <span id="word">
                                    W
                                    <div class="tooltip">
                                    <div>匹配单词</div>
                                    <div class="desc">Words</div>
                                     </div>
                                    </span>
                                    <span id="reg">
                                    .*
                                    <div class="tooltip">
                                    <div>正则表达式</div>
                                    <div class="desc">Regex</div>
                                     </div>
                                    
                                    </span>
                                    <span id="live">
                                    <svg class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2617" width="32" height="32"><path d="M432.877037 518.755668a88.046876 88.046876 0 0 0 175.973139 0 85.755245 85.755245 0 0 0-10.734482-42.093643l353.031788-180.918238a21.951413 21.951413 0 0 0 12.061216-14.111623 24.122432 24.122432 0 0 0-1.567958-18.333048c-31.359161-59.341182-82.619329-116.631957-152.212544-170.063143S649.978922 8.325013 546.252466 0.123386a22.554474 22.554474 0 0 0-18.333048 6.513057A24.122432 24.122432 0 0 0 520.320852 24.245818v406.462974a88.2881 88.2881 0 0 0-87.443815 88.046876z m88.046876 39.922624A39.922624 39.922624 0 1 1 560.846537 518.755668a39.802012 39.802012 0 0 1-39.922624 39.922624z" fill="#444444" p-id="2618"></path><path d="M253.285533 358.100273a312.626715 312.626715 0 0 0 267.035319 473.402722 334.095679 334.095679 0 0 0 76.106272-9.166524 312.867939 312.867939 0 0 0 227.836367-378.963402 24.122432 24.122432 0 0 0-10.975706-14.714684 24.122432 24.122432 0 0 0-35.459975 26.655288 264.502464 264.502464 0 1 1-483.654755-72.367296 261.004711 261.004711 0 0 1 162.464577-119.888485 23.157534 23.157534 0 0 0 14.714684-10.975707 24.122432 24.122432 0 0 0-8.322239-32.927119 24.122432 24.122432 0 0 0-18.212436-2.532855A307.922841 307.922841 0 0 0 253.285533 358.100273z" fill="#444444" p-id="2619"></path><path d="M1015.916211 413.220029a24.122432 24.122432 0 0 0-10.131421-15.07652 24.122432 24.122432 0 0 0-17.971212-3.618364 24.122432 24.122432 0 0 0-15.197132 10.131421 23.157534 23.157534 0 0 0-3.618364 17.971212A464.598035 464.598035 0 1 1 423.710513 54.157633a24.122432 24.122432 0 0 0 15.317744-10.010809 24.122432 24.122432 0 0 0 3.618365-17.971212 24.122432 24.122432 0 0 0-10.131422-15.317744 24.122432 24.122432 0 0 0-17.971211-3.618364 511.878001 511.878001 0 0 0-326.497113 217.101885 512.239837 512.239837 0 0 0 138.100921 711.611735 510.310043 510.310043 0 0 0 285.609592 88.046876 522.491871 522.491871 0 0 0 98.781357-9.769585 512.601674 512.601674 0 0 0 405.377465-601.010386z" fill="#444444" p-id="2620"></path><path d="M567.842042 50.418656a429.982345 429.982345 0 0 1 211.674339 80.930759 511.395552 511.395552 0 0 1 126.763378 133.397047L566.877145 438.548582V50.418656z" fill="#50B3EA"></path></svg>
                                    <div class="tooltip" style="width: 254px;padding-right: 0;box-sizing: content-box;">
                                        <div>实时监测 DOM 变化 </div>
                                        <div>Listen for DOM changes in real time</div>
                                        <div class="desc">在不适合实时监测的情况下请临时关闭此功能</div>
                                        <div class="desc">Please temporarily disable this function when it is not suitable for real-time monitoring</div>
                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div class="swe_setting">
                                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M439.264 208a16 16 0 0 0-16 16v67.968a239.744 239.744 0 0 0-46.496 26.896l-58.912-34a16 16 0 0 0-21.856 5.856l-80 138.56a16 16 0 0 0 5.856 21.856l58.896 34a242.624 242.624 0 0 0 0 53.728l-58.88 34a16 16 0 0 0-6.72 20.176l0.848 1.68 80 138.56a16 16 0 0 0 21.856 5.856l58.912-34a239.744 239.744 0 0 0 46.496 26.88V800a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16v-67.968a239.744 239.744 0 0 0 46.512-26.896l58.912 34a16 16 0 0 0 21.856-5.856l80-138.56a16 16 0 0 0-4.288-20.832l-1.568-1.024-58.896-34a242.624 242.624 0 0 0 0-53.728l58.88-34a16 16 0 0 0 6.72-20.176l-0.848-1.68-80-138.56a16 16 0 0 0-21.856-5.856l-58.912 34a239.744 239.744 0 0 0-46.496-26.88V224a16 16 0 0 0-16-16h-160z m32 48h96v67.376l28.8 12.576c13.152 5.76 25.632 12.976 37.184 21.52l25.28 18.688 58.448-33.728 48 83.136-58.368 33.68 3.472 31.2a194.624 194.624 0 0 1 0 43.104l-3.472 31.2 58.368 33.68-48 83.136-58.432-33.728-25.296 18.688c-11.552 8.544-24.032 15.76-37.184 21.52l-28.8 12.576V768h-96v-67.376l-28.784-12.576c-13.152-5.76-25.632-12.976-37.184-21.52l-25.28-18.688-58.448 33.728-48-83.136 58.368-33.68-3.472-31.2a194.624 194.624 0 0 1 0-43.104l3.472-31.2-58.368-33.68 48-83.136 58.432 33.728 25.296-18.688a191.744 191.744 0 0 1 37.184-21.52l28.8-12.576V256z m47.28 144a112 112 0 1 0 0 224 112 112 0 0 0 0-224z m0 48a64 64 0 1 1 0 128 64 64 0 0 1 0-128z" fill="#5A626A"></path></svg>
                                
                               <div class="swe_popover" style="width: 160px; left: -76px; display: none;">
                                    <div class="swe_rows">
                                        <span class="prop">高亮颜色</span>
                                        <div class="swe_colors">
                                            <div>
                                             <span class="active" data-color="#ff8b3a" style="background-color: #ff8b3a"></span>
                                             <span class="normal" data-color="#ffff37" style="background-color: #ffff37"></span>
                                            </div>
                                            <div>
                                             <span class="active" data-color="#f00" style="background-color: #f00"></span>
                                             <span class="normal" data-color="#ffbbbb" style="background-color: #ffbbbb"></span>
                                            </div>
                                            <div>
                                             <span class="active" data-color="#00a700" style="background-color: #00a700"></span>
                                             <span class="normal" data-color="#b4ffb4" style="background-color: #b4ffb4"></span>
                                            </div>
                                            <div>
                                             <span class="active" data-color="#ba25ff" style="background-color: #ba25ff"></span>
                                             <span class="normal" data-color="#f3b4ff" style="background-color: #f3b4ff"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="swe_close">
                                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M12.47232 12.51328C26.74688-1.76128 49.5104-2.90816 65.15712 9.84064l2.93888 2.70336L1009.664 955.37152c14.96064 14.80704 15.62624 38.76864 1.51552 54.38464-14.12096 15.616-38.02112 17.3568-54.26176 3.95264l-2.9696-2.70336L12.41088 68.17792c-15.34976-15.39072-15.31904-40.30464 0.06144-55.66464z m0 0" fill="#2C2C2C" /><path d="M1009.67424 12.51328c-14.2848-14.27456-37.04832-15.42144-52.69504-2.67264l-2.99008 2.70336L12.41088 955.37152c-14.96064 14.80704-15.62624 38.76864-1.51552 54.38464 14.12096 15.616 38.02112 17.3568 54.25152 3.95264l2.9696-2.70336 941.568-942.82752c15.34976-15.38048 15.32928-40.30464-0.0512-55.66464h0.04096z m0 0" fill="#2C2C2C" /></svg>
                            </div>
                         </div>
`
    const { frames } = await chrome.storage.session.get(['frames']);
    for (let i=0; i<frames.length; i++) {
        content.querySelector('.swe_tabs').innerHTML +=`<button class="${i === 0 ? 'active' : ''}" data-frameid="${frames[i].frameId}">
            <div>${ i === 0 ? '当前页' : `iframe${i}` }</div>
        </button>`
    }

    popup.appendChild(content);
    popup.getElementsByClassName('swe_close')[0].onclick = async () => {
        observer.disconnect()
        CSS.highlights.clear();
        document.body.removeChild(popup);
        chrome.storage.onChanged.removeListener(handleStorageChange)
        chrome.storage.session.set({ resultSum: [], frames: [] }) // 重置
        await chrome?.runtime?.sendMessage({ // chrome.scripting 只能在 background.js 里使用，所以不直接在这写了
            action: 'closeAction'
        });
    }
    document.body.appendChild(popup);

    const colorList = document.querySelectorAll('#searchWhateverPopup .swe_colors>div');
    for (let i=0; i<colorList.length; i++) {
        colorList[i].addEventListener('click', (e) => {
            chrome.storage.sync.set({
                activeColor: colorList[i].querySelector('.active').dataset.color,
                normalColor: colorList[i].querySelector('.normal').dataset.color
            })
            for (let j=0; j<colorList.length; j++) {
                colorList[j].classList.remove('active');
            }
            colorList[i].classList.add('active');
            document.querySelector('#searchWhateverPopup .swe_setting .swe_popover').style.display = 'none';
        })

        colorList[i].classList.remove('active');
        if (colorList[i].querySelector('.active').dataset.color === activeColor && colorList[i].querySelector('.normal').dataset.color === normalColor) {
            colorList[i].classList.add('active');
        }
    }

    document.querySelector('#searchWhateverPopup .swe_moveBar').addEventListener('mousedown', (downEvent) => {
        downEvent.preventDefault();
        const { top: popTop, right: popRight } = popup.getBoundingClientRect()
        const { clientX: startX, clientY: startY } = downEvent

        const handleMove = (e) => {
            e.preventDefault();
            const { clientX, clientY } = e
            popup.style.top = popTop + (clientY - startY) + 'px';
            popup.style.right = window.innerWidth - (popRight + (clientX - startX)) + 'px';
        }
        const handleUp = async () => {
            document.removeEventListener('mousemove', handleMove)
            document.removeEventListener('mouseup', handleUp)
            await chrome.storage.sync.set({ top: parseFloat(popup.style.top), right: parseFloat(popup.style.right) })
        }

        document.addEventListener('mousemove', handleMove)
        document.addEventListener('mouseup', handleUp)
    })

    document.querySelector('#searchWhateverPopup .swe_setting svg').addEventListener('click', () => {
        const popover = document.querySelector('#searchWhateverPopup .swe_setting .swe_popover');

        const hide = (e) => {
            if (!document.querySelector('#searchWhateverPopup .swe_setting').contains(e.target)) {
                popover.style.display = 'none';
                document.removeEventListener('click', hide, true)
            }
        }

        if (popover.style.display === 'none') {
            popover.style.display = 'block';
            document.addEventListener('click', hide, true)
        } else {
            popover.style.display = 'none';
        }
    })
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
        allNodes.push({ el: currentNode, text: currentNode.textContent })
        currentNode = treeWalker.nextNode();
    }
}

const start = async () => {
    const searchInput = document.querySelector('#searchWhateverPopup #swe_searchInput'); // 搜索框
    const matchCaseButton = document.querySelector('#searchWhateverPopup #matchCase');
    const wordButton = document.querySelector('#searchWhateverPopup #word');
    const regButton = document.querySelector('#searchWhateverPopup #reg');
    const liveButton = document.querySelector('#searchWhateverPopup #live');

    chrome.storage.onChanged.addListener(handleStorageChange)
    setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive']); // 缓存值

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
        } else {
            matchCaseButton.classList.remove('active')
        }
        if (setting.isWord) {
            wordButton.classList.add('active')
        } else {
            wordButton.classList.remove('active')
        }
        if (setting.isReg) {
            regButton.classList.add('active')
        } else {
            regButton.classList.remove('active')
        }
        if (setting.isLive) {
            liveButton.classList.add('active')
            observer.observe(document.body, {
                subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                attributes: false, // 不监听属性值
                characterData: true // 监听声明的 target 节点上所有字符的变化。
            })
        } else {
            liveButton.classList.remove('active')
            observer.disconnect()
        }

        searchInput.oninput = async (e) => {
            const value = e.target.value.trim();
            // 向背景脚本发送消息以获取当前标签信息
            await chrome.storage.sync.set({ searchValue: value })
            setting.searchValue = value;
        }
        searchInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                doNext();
            }
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
        }

        liveButton.onclick = async (e) => {
            const { classList } = e.currentTarget
            const isActive = classList.contains('active')
            if (isActive) {
                observer.disconnect()
                classList.remove('active')
            } else {
                observer.observe(document.body, {
                    subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                    childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                    attributes: false, // 不监听属性值
                    characterData: true // 监听声明的 target 节点上所有字符的变化。
                })
                classList.add('active')
            }
            await chrome.storage.sync.set({ isLive: !isActive })
            setting.isLive = !isActive
        }

        document.querySelector('#searchWhateverPopup .swe_toolbar .swe_prev').onclick = async () => {
            let { activeResult, resultSum } = await chrome.storage.session.get(['activeResult', 'resultSum']);
            const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
            activeResult = activeResult || 0;
            activeResult--;
            if (activeResult <= 0) {
                activeResult = sum
            }
            await chrome.storage.session.set({ activeResult: activeResult})

            observer.disconnect()
            document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_current').innerText = activeResult;
            if (setting.isLive) {
                observer.observe(document.body, {
                    subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                    childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                    attributes: false, // 不监听属性值
                    characterData: true // 监听声明的 target 节点上所有字符的变化。
                })
            }
        }

        document.querySelector('#searchWhateverPopup .swe_toolbar .swe_next').onclick = doNext;

        let tabButton = document.querySelectorAll('.swe_tabs button')
        for (let i in tabButton) {
            tabButton[i].onclick = async (e) => {
                if (e.currentTarget.querySelector('.swe_sum').innerText === '0') {
                    return;
                }
                const { frameid } = e.currentTarget.dataset
                const { resultSum } = await chrome.storage.session.get(['resultSum'])

                let current = 0;
                for (let item of resultSum) {
                    if (item.frameId !== +frameid) {
                        current += item.sum;
                    } else {
                        break;
                    }
                }
                await chrome.storage.session.set({ activeResult: current + 1})
                observer.disconnect()
                document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_current').innerText = current + 1;
                if (setting.isLive) {
                    observer.observe(document.body, {
                        subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                        childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                        attributes: false, // 不监听属性值
                        characterData: true // 监听声明的 target 节点上所有字符的变化。
                    })
                }
            }
        }
    }

    // 启动后立即进行一次搜索
    doSearch()
}

async function doSearch(isAuto = false) {
    const { isMatchCase, searchValue, isWord, isReg } = setting; // 从本地获取 setting，比 storage 里获取快很多
    CSS.highlights.clear(); // 清除所有高亮

    if (searchValue) { // 如果有搜索词
        filteredRangeList = [] // 清除之前搜索到的匹配结果的 dom 集合

        rangesFlat = allNodes.map(({ el, text }) => {
            const indices = [];
            let startPos = 0;

            // 根据筛选项，设置正则表达式
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
                reg.lastIndex = 0;
                const res = reg.exec(text.substring(startPos));

                if (res) {
                    index = res.indices[0][0]
                    execResLength = res.indices[0][1] - res.indices[0][0]
                    indices.push(startPos + index);
                    startPos += index + execResLength;
                } else {
                    break;
                }
            }

            return indices.map((index) => {
                const range = new Range();
                filteredRangeList.push(el.parentElement)
                range.setStart(el, index);
                range.setEnd(el, index + execResLength);
                return range;
            })
        }).flat()
    } else {
        rangesFlat = []
    }

    const searchResultsHighlight = new Highlight(...rangesFlat)
    CSS.highlights.set('search-results', searchResultsHighlight)

    // 向背景脚本发送消息以获取当前标签信息
    chrome?.runtime?.sendMessage({
        action: 'saveResult',
        data: {
            isFrame,
            resultNum: rangesFlat.length,
            isAuto
        }
    });
}

const doNext = async () => {
    let { activeResult, resultSum } = await chrome.storage.session.get(['activeResult', 'resultSum']);
    const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
    if (sum === 0) {
        return;
    }
    activeResult = activeResult || 0;
    activeResult++;
    if (activeResult > sum) {
        activeResult = 1
    }
    await chrome.storage.session.set({ activeResult: activeResult})

    observer.disconnect()
    document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_current').innerText = activeResult;
    if (setting.isLive) {
        observer.observe(document.body, {
            subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
            childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
            attributes: false, // 不监听属性值
            characterData: true // 监听声明的 target 节点上所有字符的变化。
        })
    }
}

const handleStorageChange = async (changes, areaName) => {
    if (areaName === 'session') {
        if (!isFrame && changes.visibleStatus !== undefined) {
            document.querySelector('#searchWhateverPopup .swe_visible .swe_visibleStatus').innerText = changes.visibleStatus.newValue;
            document.querySelector('#searchWhateverPopup .swe_visible').style.opacity = changes.visibleStatus.newValue ? 1 : 0;
        }
    }
}

// 获取元素的隐藏状态，返回一个描述元素不可见的原因的字符串，如果不为空，说明元素不可见
const isElementVisible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
        return '隐藏中'
    } else {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const topElement = document.elementFromPoint(centerX, centerY);
        if (topElement && el !== topElement && !el.contains(topElement) && !topElement.contains(el)) {
            return '被遮盖'
        }
    }
    return '';
}
