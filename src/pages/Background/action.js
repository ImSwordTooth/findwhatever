import { reCheckTree, closePop } from '../Content/features'
import { createOrUpdatePopup } from '../Content/index';
window.isFrame = window !== window.top;

window.handleCloseByEsc = (e) => {
	if (!window.isFrame && e.key === 'Escape') {
		closePop()
		document.removeEventListener('keydown', window.handleCloseByEsc)
	}
};

if (!window.filteredRangeList) {
	window.filteredRangeList = new Proxy({ value: [] }, {
		set (target, prop, value) {
			target[prop] = value
			return true
		}
	});
}

(async function () {
	console.log({ isFrame: window.isFrame })
    // 每次点击的时候才开始创建 dom 查找树，否则会 dom 节点过旧
    if (!window.isFrame) {
        if (document.getElementById('__swe_container')) {
            closePop()
			document.removeEventListener('keydown', window.handleCloseByEsc);
        } else {
			const [, { lastSearchTime }, { swe_setting }] = await Promise.all([
				reCheckTree(),
				chrome.storage.session.get(['lastSearchTime']),
				chrome.storage.sync.get(['swe_setting'])
			])

			const selection = window.getSelection().toString()
			const now = Date.now()
			const retentionTime = swe_setting?.retentionTime ?? -1

			if (retentionTime !== -1 && (!lastSearchTime || (now - lastSearchTime)/1000/60 >= retentionTime)) { // 应该重置
				await chrome.storage.sync.set({ searchValue: selection || '', isMatchCase: false, isWord: false, isReg: false, isLive: true });
			} else {
				if (selection) {
					await chrome.storage.sync.set({ searchValue: selection });
				}
			}
			// 创建新的弹出窗口
			createOrUpdatePopup();
			await chrome?.runtime?.sendMessage({ // chrome.scripting 只能在 background.js 里使用，所以不直接在这写了
				action: 'openAction'
			});
			document.addEventListener('keydown', window.handleCloseByEsc)
        }
    } else {
		reCheckTree()
    }
})()
