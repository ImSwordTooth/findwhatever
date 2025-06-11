import { destroyPopup } from "./index";
import { useState, useRef, useEffect } from 'react'
import { i18n } from '../i18n'

// 生成匹配节点树
export const reCheckTree = () => {
	const createTreeWalkerWithShadowDOM = (root) => {

		console.log('sssss', root)

		return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, (node) => {
			console.log('----',node.parentNode.nodeName)
			// 父元素是 svg、script、script 的时候，不置入范围
			if (['svg', 'STYLE', 'SCRIPT', 'NOSCRIPT'].includes(node.parentNode.nodeName)) {
				return NodeFilter.FILTER_REJECT
			} else {
				return NodeFilter.FILTER_ACCEPT
			}
		})
	}

	function* walkTextNodes(node) {
		if (node.nodeName === '#text') {
			// console.log(node, '#text')
			yield node
		} else {
			const treeWalker = createTreeWalkerWithShadowDOM(node)

			if (node.shadowRoot) { // 需要把 shadow-root 里的单独拿出来
				yield* walkTextNodes(node.shadowRoot)
			}

			if (node.childNodes?.length > 0) {

				const arr = ['STRONG','WBR']

				let clonedContainer=node

				let ischanged = false

				// console.log(Array.from(node.childNodes))
				// console.log(Array.from(node.childNodes).every(child => !child.children || child.children.length === 0))

				// 最后一层，并且有可以 normalize 的部分
				if (Array.from(node.childNodes).every(child => !child.children || child.children.length === 0) && Array.from(node.childNodes).some(child => arr.includes(child.nodeName))) {
					clonedContainer = node.cloneNode(true);
					clonedContainer.core = node
					clonedContainer.dataset.test = 'node'
					ischanged = true

					// 在副本上操作：移除所有 <wbr> 标签
					const wbrElements = clonedContainer.querySelectorAll('wbr');
					wbrElements.forEach(wbr => wbr.remove());

					// 调用 normalize() 合并文本节点
					clonedContainer.normalize();

					for (let i=0; i<clonedContainer.childNodes.length; i++) {
						clonedContainer.childNodes[i].isNormalized = true
					}
				}

				if (ischanged) {
					// console.log('11', clonedContainer)
					// console.log('22', clonedContainer.childNodes)
				}


				for (const child of clonedContainer.childNodes) {
					yield* walkTextNodes(child)
				}
			} else {
				while (treeWalker.nextNode()) {
					yield treeWalker.currentNode
				}
			}
		}
	}

    window.allNodes = [];
	return new Promise(resolve => {

		const genReturn = walkTextNodes(document.body)
		let genReturnNext = genReturn.next()
		while (!genReturnNext.done) {
			if (genReturnNext.value.textContent && !/^\s+$/g.test(genReturnNext.value.textContent)) { // 如果一个元素的有内容，并且内容全都是空白，跳过之
				// if (isElementVisible(genReturnNext.value.parentElement) !== i18n('隐藏中')) {
					window.allNodes.push({ el: genReturnNext.value, text: genReturnNext.value.textContent })
				// }
			}
			genReturnNext = genReturn.next()
		}

		// console.log(window.allNodes, '===')
		resolve()
	})
}

export const closePop = () => {
	window.__swe_observer.disconnect()
	document.removeEventListener('keydown', window.handleCloseByEsc)
	CSS.highlights.clear()
	destroyPopup()
	chrome.storage.session.set({ resultSum: [], frames: [] })
	chrome?.runtime?.sendMessage({
		action: 'closeAction'
	})
	chrome.storage.sync.get(['recent', 'searchValue']).then(({ recent, searchValue }) => {
		if (searchValue) {
			const newRecent = recent.slice()
			if (!newRecent.includes(searchValue)) { // 没有就直接新增
				newRecent.unshift(searchValue)
				if (newRecent.length > 50) { // 不超过50条
					newRecent.shift()
				}
			} else { // 有就提到最新
				const index = newRecent.findIndex(r => r === searchValue);
				if (index > 0) {
					newRecent.unshift(newRecent.splice(index, 1)[0])
				}
			}
			chrome.storage.sync.set({ recent: newRecent })
		}
	})
}

export const observerAllExceptMe = () => {
	if (!document) {
		return
	}
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

	const { searchValue, isMatchCase, isWord, isReg, featureObject } = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive', 'featureObject'])
	const matchText = []

	if (searchValue && window.allNodes) { // 如果有搜索词

		if (window.filteredRangeList) {
			window.filteredRangeList.value = [] // 清除之前搜索到的匹配结果的 DOM 集合
		}

		// console.log(window.allNodes, '==============')

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
				reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dg${featureObject?.isOpenUnicode ? 'u' : ''}`);
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
					matchText.push(res[0])
				} else {
					break
				}
			}

			return indices.map(index => {
				const range = new Range()
				if (el.parentElement) {

					// window.filteredRangeList.value = [...window.filteredRangeList.value, el.parentElement]
					window.filteredRangeList.value = [...window.filteredRangeList.value, el.parentNode.core || el.parentElement]
				} else {
					if (el.parentNode?.nodeName === '#document-fragment' && el.parentNode?.host) { // 如果是 shadow-root 的直接文本节点，就把 shadow-root 的宿主元素加上去
						window.filteredRangeList.value = [...window.filteredRangeList.value, el.parentNode.host]
					}
				}


				if (el.parentNode.core) {
					let startTextLength = 0
					let endTextLength = 0

					console.log('core', index, execResLength)

					for (let i=0; i<el.parentNode.core.childNodes.length; i++) {
						startTextLength += el.parentNode.core.childNodes[i].length || 0
						console.log(startTextLength)
						if (startTextLength >= index) {
							console.log('start', el.parentNode.core.childNodes[i], index - (startTextLength - el.parentNode.core.childNodes[i].length || 0))
							range.setStart(el.parentNode.core.childNodes[i], index - (startTextLength - el.parentNode.core.childNodes[i].length || 0))
							break
						}
					}

					for (let i=0; i<el.parentNode.core.childNodes.length; i++) {
						endTextLength += el.parentNode.core.childNodes[i].length || 0
						if (endTextLength >= index + execResLength) {
							console.log('end', el.parentNode.core.childNodes[i], index + execResLength - (endTextLength - el.parentNode.core.childNodes[i].length || 0))
							range.setEnd(el.parentNode.core.childNodes[i], index + execResLength - (endTextLength - el.parentNode.core.childNodes[i].length || 0))
							break
						}
					}
					// range.createContextualFragment(searchValue)
					// range.setStart(el.parentNode.core.childNodes[0], index)
					// range.setEnd(el.parentNode.core.childNodes[el.parentNode.core.childNodes.length-1], el.parentNode.core.childNodes[el.parentNode.core.childNodes.length-1].length)
				} else {
					range.setStart(el, index)
					range.setEnd(el, index + execResLength)
				}

				// console.log('....', window.filteredRangeList.value)
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
			matchText,
			isAuto
		}
	}, cb ? cb : () => {})
}

export const isElementVisible = (el) => {
	if (!el) {
		return ''
	}
	const rect = el.getBoundingClientRect();
	if (rect.width === 0 && rect.height === 0) {
		return i18n('隐藏中')
	} else {
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const topElement = document.elementFromPoint(centerX, centerY);
		if (topElement && el !== topElement && !el.contains(topElement) && !topElement.contains(el)) {
			return i18n('被遮盖')
		}
	}
	return '';
}

// 自定义防抖 Hook
export const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const [ isDebounceOk, setIsDebounceOK ] = useState(false)
	const timerRef = useRef(null);

	useEffect(() => {
		if (timerRef.current) {
			setIsDebounceOK(true)
			clearTimeout(timerRef.current);
		}
		setIsDebounceOK(false)
		timerRef.current = setTimeout(() => {
			setIsDebounceOK(true)
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [value, delay]);

	return { debouncedValue, isDebounceOk };
};

window.__swe_doSearchOutside = doSearchOutside

// 获取元素的隐藏状态，返回一个描述元素不可见的原因的字符串，如果不为空，说明元素不可见
window.__swe_isElementVisible = isElementVisible

window.observerAllExceptMe = observerAllExceptMe
