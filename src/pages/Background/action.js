import { reCheckTree, closePop } from '../Content/features'
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

const startInPage = async () => {
	await reCheckTree()
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
};

(async function () {
    // 每次点击的时候才开始创建 dom 查找树，否则会 dom 节点过旧
    if (!window.isFrame) {
        if (document.getElementById('__swe_container')) {
            closePop()
        } else {
			if (document.readyState === 'complete') {
				startInPage()
			} else {
				document.onreadystatechange = () => {
					if (document.readyState === 'complete') {
						startInPage()
						document.onreadystatechange = null
					}
				}
			}
        }
    } else {
		if (document.readyState === 'complete') {
			reCheckTree() // todo 更完美一点是判断主窗口有没有 __swe_container 元素，没有再执行
		} else {
			document.onreadystatechange = () => {
				if (document.readyState === 'complete') {
					reCheckTree()
					document.onreadystatechange = null
				}
			}
		}
    }
})()
