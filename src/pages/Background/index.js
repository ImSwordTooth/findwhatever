// 在 Service Worker 顶层设置 session storage 访问权限，确保浏览器重启或扩展更新后内容脚本常态具备读取权限
chrome.storage?.session?.setAccessLevel?.({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' }).catch(() => null);

const getVisibleFrames = async (tabId, frames) => {
	if (!Array.isArray(frames) || frames.length === 0) return [];

	const topFrame = frames.find(f => f.frameId === 0);
	const childFrames = frames.filter(f => f.frameId !== 0);

	// 如果没有子 iframe，直接返回顶层 frame
	if (childFrames.length === 0) {
		return topFrame ? [topFrame] : [];
	}

	// 一次性单次 IPC 调用探测所有子 frame，改用浏览器布局计算的 innerText 与视口尺寸判定真实可见性
	const childResults = await chrome.scripting.executeScript({
		target: { tabId, frameIds: childFrames.map(f => f.frameId) },
		func: () => {
			if (window.innerWidth === 0 || window.innerHeight === 0) return false;
			return Boolean(document.body?.innerText?.trim?.()?.length > 0);
		}
	}).catch(() => null);

	const validChildFrameIds = new Set(
		(childResults || [])
			.filter(r => r && r.result)
			.map(r => r.frameId)
	);

	const visibleChildFrames = childFrames.filter(f => validChildFrameIds.has(f.frameId));
	return topFrame ? [topFrame, ...visibleChildFrames] : visibleChildFrames;
}

const isRestrictedUrl = (url) => {
	if (!url) return true;
	return (
		url.startsWith('chrome://') ||
		url.startsWith('chrome-extension://') ||
		url.startsWith('edge://') ||
		url.startsWith('about:') ||
		url.startsWith('devtools://')
	);
};

const clearUpdateBadge = () => {
	chrome.action?.setBadgeText?.({ text: '' })?.catch?.(() => null);
};

// 手动实现弹出窗口，避免点击空白处自动关闭
chrome.action.onClicked.addListener(async (tab) => {
	clearUpdateBadge();

	if (!tab?.id || isRestrictedUrl(tab?.url)) {
		return;
	}

	const rawFrames = await chrome.webNavigation.getAllFrames({ tabId: tab.id }).catch(() => null)
	const frames = (rawFrames || []).filter(a => !a.errorOccurred); // 获取当前标签页下的所有 iframe，去除无效的，去除报错的

	const visibleFrames = await getVisibleFrames(tab.id, frames.sort((a, b) => a.frameId - b.frameId))
	const resultSum = visibleFrames.map((f) => ({  // 提前定义好结构，有助于后续操作
		frameId: f.frameId,
		sum: 0,
		matchText: []
	}))

	// 重置查找总数，并设置 frames
	await chrome.storage.session.set({
		frames: visibleFrames,
		resultSum,
		activeTabId: tab.id
	})

	const targetFrameIds = visibleFrames.length > 0 ? visibleFrames.map(i => i.frameId) : [0]
	const injectPromises = targetFrameIds.map(frameId =>
		chrome.scripting.executeScript({
			target: { tabId: tab.id, frameIds: [frameId] },
			files: ['./action.bundle.js']
		}).catch(() => null)
	);
	await Promise.all(injectPromises);
})

chrome.runtime.onInstalled.addListener(async (res) => {
	chrome.storage.session?.setAccessLevel?.({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' }).catch(() => null)
	if (res.reason === 'install') {
		chrome.storage.local.set({ searchValue: '' })
		chrome.storage.sync.set({ isMatchCase: false, isWord: false, isReg: false, isLive: true })
		chrome.runtime.openOptionsPage()
	} else if (res.reason === 'update') {
		// 扩展升级后在浏览器工具栏显示一次性 NEW 徽标，用户点击后自动清除
		chrome.action?.setBadgeText?.({ text: 'NEW' })?.catch?.(() => null);
		chrome.action?.setBadgeBackgroundColor?.({ color: '#f43f5e' })?.catch?.(() => null);
		chrome.action?.setBadgeTextColor?.({ color: '#ffffff' })?.catch?.(() => null);
	}
})

const performSearch = async (tabId, isAuto = false) => {
	if (!tabId) return;
	const { frames, activeResult } = await chrome.storage.session.get(['frames', 'activeResult']);

	const regRes = await chrome.scripting.executeScript({
		target: { tabId, frameIds: [0] },
		func: async () => {
			return await window?.__swe_getSearchReg?.();
		}
	}).catch(() => null);

	if (!regRes || !regRes[0] || !regRes[0].result) return;
	const { error, errorType, regContent } = regRes[0].result;

	if (error) {
		await chrome.scripting.executeScript({
			target: { tabId, frameIds: [0] },
			args: [error, errorType],
			func: (e, eT) => {
				window.postMessage({
					type: 'swe_updateSearchResult',
					data: { error: e, errorType: eT }
				}, '*');
			}
		}).catch(() => null);
	} else {
		const targetFrames = (Array.isArray(frames) && frames.length > 0) ? frames : [{ frameId: 0 }];
		const searchPromises = targetFrames.map(f =>
			chrome.scripting.executeScript({
				target: { tabId, frameIds: [f.frameId] },
				args: [f.frameId, regContent],
				func: async (frameId, rC) => {
					const res = await window?.__swe_doSearchOutside?.(rC, false);
					return { ...res, frameId };
				}
			}).catch(() => null)
		);
		const executionResults = await Promise.all(searchPromises);

		const newResultSum = executionResults
			.filter(r => r && r[0] && r[0].result)
			.map(r => ({
				frameId: r[0].result.frameId,
				sum: r[0].result.resultNum,
				matchText: r[0].result.matchText
			}));

		const finalSession = { resultSum: newResultSum, lastSearchTime: Date.now() };

		if (isAuto) {
			finalSession.activeResult = activeResult || 0;
			finalSession.force = Math.random() + 1;
		} else {
			finalSession.activeResult = 0;
		}
		await chrome.storage.session.set(finalSession);

		await chrome.scripting.executeScript({
			target: { tabId, frameIds: [0] },
			args: [finalSession.activeResult, newResultSum],
			func: (a, r) => {
				window.postMessage({
					type: 'swe_updateSearchResult',
					data: { current: a, total: r }
				}, '*');
			}
		}).catch(() => null);
	}
};

chrome.runtime.onMessage.addListener(async (message, sender) => {
    const { action, data } = message

	if (action === 'search') {
		const { activeTabId } = await chrome.storage.session.get(['activeTabId']);
		const currentTabId = sender?.tab?.id || activeTabId;
		await performSearch(currentTabId, data?.isAuto);
		return true;
	}

	if (action === 'closeAction' || action === 'openAction') {
		const currentTabId = sender?.tab?.id;
		if (!currentTabId) return;

		const syncRes = await chrome.storage.sync.get('styleText').catch(() => null);
		const cssParam = {
			target: { tabId: currentTabId, allFrames: true },
			css: syncRes?.styleText || `::highlight(search-results) { background-color: #ffff37; color: black; } ::highlight(search-results-active) { background-color: #ff8b3a; color: black; }`
		};

		// 先移除已有样式，防止重复插入多个注入样式表
		await chrome.scripting.removeCSS(cssParam).catch(() => null);
		if (action === 'openAction') {
			clearUpdateBadge();
			await chrome.scripting.insertCSS(cssParam).catch(() => null);
		}

		return true
	}

	if (action === 'openOptionsPage') {
		chrome.runtime.openOptionsPage()
	}
});

const handleStorageChange = async (changes, areaName) => {
    if (areaName === 'session') {
        if (changes.activeResult || changes.force) {
            const { resultSum, activeResult: activeResultFromStorage, frames, activeTabId } = await chrome.storage.session.get(['resultSum', 'activeResult', 'frames', 'activeTabId']);
            const activeResult = changes.activeResult ? changes.activeResult.newValue : activeResultFromStorage

			if (Array.isArray(frames) && frames.length > 0 && activeTabId) {
				await Promise.all(frames.map(f =>
					chrome.scripting.executeScript({
						target: { tabId: activeTabId, frameIds: [f.frameId] },
						func: () => {
							CSS.highlights?.delete('search-results-active')
						}
					}).catch(() => null)
				))
			}

			if (activeResult === 0) {
				return;
			}

			let temp = 0;

			for (const item of (resultSum || [])) {
				temp += item.sum;
				if (activeResult <= temp) {
					chrome.scripting.executeScript({
						target: { tabId: activeTabId, frameIds: [Number(item.frameId)] },
						args: [activeResult - temp + item.sum, !changes.force],
						func: (realIndex, isAuto) => {
							if (!window.rangesFlat) {
								return
							}
							CSS.highlights.set('search-results-active', new Highlight(window.rangesFlat[realIndex - 1]))

							let currentActiveRangeDOM = window.filteredRangeList?.value?.[realIndex - 1]
							if (!currentActiveRangeDOM) {
								return;
							}
							// dom 有可能是 shadow-dom，好多 dom api 都不能用，所以指向为其父元素
							if (currentActiveRangeDOM instanceof ShadowRoot || currentActiveRangeDOM.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
								currentActiveRangeDOM = currentActiveRangeDOM.host
							}

							if (isAuto) {
								let parents = [currentActiveRangeDOM];
								let currentDom = currentActiveRangeDOM.parentElement;
								while (currentDom) {
									parents.unshift(currentDom);
									currentDom = currentDom.parentElement;
								}
								for (let dom of parents) {
									if (dom.tagName === 'DETAILS') {
										dom.open = true;
									}
								}
								currentActiveRangeDOM.scrollIntoView({ behavior: 'instant', block: 'center' });
							}
							chrome.storage.session.set({ visibleStatus: window.__swe_isElementVisible?.(currentActiveRangeDOM) }).catch(() => null)
						}
					}).catch(() => null)
					break;
				}
			}
        }
    }
}

chrome.storage.onChanged.addListener(handleStorageChange)

chrome.tabs.onActivated.addListener(async () => {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true }).catch(() => []);
    const currentTab = tabs?.[0];

	if (!currentTab?.id || isRestrictedUrl(currentTab?.url)) {
		return;
	}

	const { activeTabId } = await chrome.storage.session.get('activeTabId');
	const oldTabId = activeTabId;

	await chrome.storage.session.set({ activeTabId: currentTab.id });

	// 停用旧的标签页的 isLive 监听
	if (oldTabId && oldTabId !== currentTab.id) {
		await chrome.scripting.executeScript({
			target: { tabId: oldTabId, allFrames: true },
			func: () => {
				window.__swe_observer?.disconnect();
			}
		}).catch(() => null);
	}

    const res = await chrome.scripting.executeScript({
        target: { tabId: currentTab.id, frameIds: [0] },
        func: () => {
            return !!document.getElementById('__swe_container');
        }
    }).catch(() => null);

    if (res?.[0]?.result) {
		const rawFrames = (await chrome.webNavigation.getAllFrames({ tabId: currentTab.id }).catch(() => null)) || [];
		const frames = rawFrames.filter(a => !a.errorOccurred);

		const visibleFrames = await getVisibleFrames(currentTab.id, frames.sort((a, b) => a.frameId - b.frameId));
		// 仅更新 frames 与 activeTabId，切勿清空 resultSum
		await chrome.storage.session.set({ frames: visibleFrames, activeTabId: currentTab.id });

		const { isLive } = await chrome.storage.sync.get('isLive').catch(() => ({}));
		const targetFrameIds = visibleFrames.length > 0 ? visibleFrames.map(f => f.frameId) : [0];

		if (isLive) {
			await Promise.all(targetFrameIds.map(frameId =>
				chrome.scripting.executeScript({
					target: { tabId: currentTab.id, frameIds: [frameId] },
					func: () => {
						window.observerBodyAndOpenShadowRoot?.();
					}
				}).catch(() => null)
			));
		}

		// 通知主界面更新最新帧列表与配置
		await chrome.scripting.executeScript({
			target: { tabId: currentTab.id, frameIds: [0] },
			func: () => {
				window.postMessage({ type: 'swe_updateSettings' }, '*');
			}
		}).catch(() => null);

		// 重新执行一次搜索，重新计算真实 resultSum 并恢复各个 frame 的高亮，上下箭头即可平滑切换
		await performSearch(currentTab.id, true);
    }
});
