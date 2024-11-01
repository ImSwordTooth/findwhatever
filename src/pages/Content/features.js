import { destroyPopup } from "./index";

// 生成匹配节点树
export const reCheckTree = () => {
    window.treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, (node) => {
        // 父元素是 svg、script、script 的时候，不置入范围
        if (['svg', 'STYLE', 'SCRIPT', 'NOSCRIPT'].includes(node.parentNode.nodeName)) {
            return NodeFilter.FILTER_REJECT
        } else {
            return NodeFilter.FILTER_ACCEPT
        }
    })

    window.allNodes = [];
    window.currentNode = window.treeWalker.nextNode();
    while (window.currentNode) {
        if (window.currentNode.textContent && !/^\s+$/g.test(window.currentNode.textContent)) { // 如果一个元素的有内容，并且内容全都是空白，跳过之
			if (isElementVisible(window.currentNode.parentElement) !== '隐藏中') {
				window.allNodes.push({ el: window.currentNode, text: window.currentNode.textContent })
			}
        }
        window.currentNode = window.treeWalker.nextNode();
    }
}

export const closePop = () => {
	window.__swe_observer.disconnect()
	CSS.highlights.clear()
	destroyPopup()
	chrome.storage.session.set({ resultSum: [], frames: [] })
	chrome?.runtime?.sendMessage({
		action: 'closeAction'
	})
}

export const observerAllExceptMe = () => {
	for (let child of document.body.children) {
		if (child.tagName === 'SCRIPT' || child.id === '__swe_container') {
			continue
		}
		window.__swe_observer.observe(child, {
			subtree: true,
			childList: true,
			attributes: false,
			characterData: true
		})
	}
}

export const doSearchOutside = async (isAuto = false, cb) => {
	CSS.highlights.clear() // 清除所有高亮

	const { searchValue, isMatchCase, isWord, isReg } = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive'])

	if (searchValue) { // 如果有搜索词
		window.filteredRangeList = [] // 清除之前搜索到的匹配结果的 DOM 集合
		window.rangesFlat = window.allNodes.map(({ el, text }) => {
			const indices = []
			let startPosition = 0

			// 根据筛选项，设置正则表达式
			let regContent = searchValue
			if (!isReg) {
				regContent = regContent.replace(/([^a-zA-Z0-9_ \n])/g, '\\$1')
			}
			if (isWord) {
				regContent = `\\b${regContent}\\b`
			}
			let execResLength = searchValue.value // 匹配结果的长度，一般情况下等于字符串长度，如果是正则，就得是正则结果的长度
			let reg
			try {
				reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dg`);
			} catch (e) {
				// 正则表达式不合法
				return []
			}

			while (startPosition < text.length) {
				let index
				reg.lastIndex = 0
				const res = reg.exec(text.substring(startPosition))

				if (res) {
					index = res.indices[0][0]
					execResLength = res.indices[0][1] - res.indices[0][0]
					indices.push(startPosition + index)
					startPosition += index + execResLength
				} else {
					break
				}
			}

			return indices.map(index => {
				const range = new Range()
				window.filteredRangeList.push(el.parentElement)
				range.setStart(el, index)
				range.setEnd(el, index + execResLength)
				return range
			})
		}).flat()
	} else {
		window.rangesFlat = []
	}

	const searchResultsHighlight = new Highlight(...window.rangesFlat)
	CSS.highlights.set('search-results', searchResultsHighlight)

	// 向背景脚本发送消息以获取当前标签信息
	chrome?.runtime?.sendMessage({
		action: 'saveResult',
		data: {
			isFrame: window.isFrame,
			resultNum: window.rangesFlat.length,
			isAuto
		}
	}, cb ? cb : () => {})
}

export const isElementVisible = (el) => {
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

window.__swe_doSearchOutside = doSearchOutside

// 获取元素的隐藏状态，返回一个描述元素不可见的原因的字符串，如果不为空，说明元素不可见
window.__swe_isElementVisible = isElementVisible
