import { reCheckTree, doSearchOutside, closePop } from '../Content/features'
import { createOrUpdatePopup } from '../Content/index';
window.isFrame = window !== window.top;

window.handleCloseByEsc = (e) => {
	if (!window.isFrame && e.key === 'Escape') {
		closePop()
		document.removeEventListener('keydown', window.handleCloseByEsc)
	}
};

window.filteredRangeList = new Proxy({ value: [] }, {
	set (target, prop, value) {
		target[prop] = value
		// window.dispatchEvent(new CustomEvent('filteredRangeListChange', { detail: value }))
		return true
	}
});

(async function () {
    // 每次点击的时候才开始创建 dom 查找树，否则会 dom 节点过旧
    await reCheckTree()
    if (!window.isFrame) {
        if (document.getElementById('__swe_container')) {
            closePop()
        } else {
			const selection = window.getSelection().toString()
			if (selection) {
				await chrome.storage.sync.set({ searchValue: window.getSelection().toString() });
			}
            // 创建新的弹出窗口
			createOrUpdatePopup();
            await chrome?.runtime?.sendMessage({ // chrome.scripting 只能在 background.js 里使用，所以不直接在这写了
                action: 'openAction'
            });
			document.addEventListener('keydown', window.handleCloseByEsc)
        }
    } else {
		doSearchOutside()
    }
})()
