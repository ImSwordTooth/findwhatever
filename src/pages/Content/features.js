import { destroyPopup } from "./index";
import { useState, useRef, useEffect } from 'react'
import { i18n } from '../i18n'

// 生成匹配节点树
export const reCheckTree = () => {
	const createTreeWalkerWithShadowDOM = (root) => {
		return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, (node) => {
			// 父元素是 script、script 的时候，不置入范围
			if (['STYLE', 'SCRIPT', 'NOSCRIPT'].includes(node.parentNode.nodeName)) {
				return NodeFilter.FILTER_REJECT
			} else {
				return NodeFilter.FILTER_ACCEPT
			}
		})
	}

	function* walkTextNodes(node) {
		if (node.nodeName === '#text') {
			yield node
		} else {
			if (['STYLE', 'SCRIPT', 'NOSCRIPT'].includes(node.nodeName)) { // 跳过 style、script 等元素，加速
				yield null
			} else {
				const treeWalker = createTreeWalkerWithShadowDOM(node)

				if (node.shadowRoot) { // 需要把 shadow-root 里的单独拿出来
					yield* walkTextNodes(node.shadowRoot)
				}

				if (node.childNodes?.length > 0) {

					// 需要规范化的标签，都是行内的小标签
					const normalizedTagArr = ['STRONG','WBR','EM', 'ABBR', 'A', 'SPAN', 'ADDRESS', 'B', 'BDI', 'BDO', 'CITE', 'I', 'KBD', 'MARK', 'Q', 'S', 'DEL', 'INS', 'SAMP', 'SMALL', 'SUB', 'SUP', 'TIME', 'U', 'VAR']

					let clonedContainer = node
					const childNodesArr = Array.from(node.childNodes)
					// 最后一层，并且有可以 normalize 的部分，并且没有换行
					/**
					 * 规范化的条件：
					 *
					 * 1. 没有嵌套结构
					 * 2. 子节点中包含 normalizedTagArr 中的标签
					 * 3. 没有换行
					 * 4. 子节点长度大于 1，防止 <div><a>1111</a></div> 这种结构，没必要规范化
					 *
					 * */
					if (
						childNodesArr.every(child => !child.children || child.children.length === 0)
						&& childNodesArr.some(child => normalizedTagArr.includes(child.nodeName))
						&& !node.textContent.includes('\n')
						&& childNodesArr.filter(c => c.nodeName !== '#comment').length > 1
					) {
						clonedContainer = node.cloneNode(true); // 克隆源节点，因为要执行一些 dom 的操作，不能改页面中的
						clonedContainer.sourceNode = node // 把源节点备份一下，后面要用
						clonedContainer.dataset.__swe__normalized = '777' // 标记一下，这个 dom 是规范化过的，名和值都是防重复

						// 开始规范化，先把所有的标签换成文本节点
						for (let i=0; i<clonedContainer.childNodes.length; i++) {
							const child = clonedContainer.childNodes[i]
							if (child.nodeName === '#comment') { // 注释也算一个节点哦，直接干掉
								child.remove()
								i-- // 因为删除了一个节点，所以索引要减一
							} else {
								if (child.nodeName !== '#text') {
									clonedContainer.replaceChild(document.createTextNode(child.textContent), child)
								}
							}
						}

						clonedContainer.normalize(); // 调用 normalize() 合并文本节点
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
	}

    window.allNodes = [];
	return new Promise(resolve => {

		const genReturn = walkTextNodes(document.body)
		let genReturnNext = genReturn.next()
		while (!genReturnNext.done) {
			if (genReturnNext.value && genReturnNext.value.textContent && !/^\s+$/g.test(genReturnNext.value.textContent)) { // 如果一个元素的有内容，并且内容全都是空白，跳过之
				if (genReturnNext.value.parentElement?.dataset.__swe__normalized === '777') { // 规范化的元素是克隆的，所以在页面中必然是隐藏的，所以需要特殊处理
					window.allNodes.push({ el: genReturnNext.value, text: genReturnNext.value.textContent })
				} else {
					if (isElementVisible(genReturnNext.value.parentElement) !== i18n('隐藏中')) {
						window.allNodes.push({ el: genReturnNext.value, text: genReturnNext.value.textContent })
					}
				}
			}
			genReturnNext = genReturn.next()
		}

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

export const observerBodyAndOpenShadowRoot = () => {
	if (!document) {
		return
	}
	window.__swe_observer.observe(document.body, {
		subtree: true,
		childList: true,
		attributes: false,
		characterData: true
	})

	function observeAllShadowRoots(startNode) {
		const elements = startNode.querySelectorAll('*');
		elements.forEach(element => {
			const shadowRoot = element.shadowRoot;
			if (shadowRoot && shadowRoot.mode === 'open') {
				window.__swe_observer.observe(shadowRoot, {
					subtree: true,
					childList: true,
					attributes: false,
					characterData: true
				});
				observeAllShadowRoots(shadowRoot);
			}
		});
	}
	observeAllShadowRoots(document)
}

export const doSearchOutside = async (isAuto = false, cb) => {
	CSS.highlights.clear() // 清除所有高亮

	const { searchValue, isMatchCase, isWord, isReg, swe_setting } = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive', 'swe_setting'])
	const matchText = []

	if (searchValue && window.allNodes) { // 如果有搜索词

		if (window.filteredRangeList) {
			window.filteredRangeList.value = [] // 清除之前搜索到的匹配结果的 DOM 集合
		}

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
				reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dg${swe_setting?.isOpenUnicode ? 'u' : ''}`);
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
					// 如果有源节点的备份，说明是个规范化的元素，要高亮肯定得高亮源节点
					window.filteredRangeList.value = [...window.filteredRangeList.value, el.parentNode.sourceNode || el.parentElement]
				} else {
					if (el.parentNode?.nodeName === '#document-fragment' && el.parentNode?.host) { // 如果是 shadow-root 的直接文本节点，就把 shadow-root 的宿主元素加上去
						window.filteredRangeList.value = [...window.filteredRangeList.value, el.parentNode.host]
					}
				}

				if (el.parentNode.sourceNode) {
					/**
					 * 规范化后的元素只有一个文本节点，但是源节点可不是，里面有很多节点、标签，不能直接用 range 标识范围
					 * 需要根据查找结果，确定起始点和结束点对应的 dom节点，再设置到 range
					 * */

					let startTextLength = 0
					let endTextLength = 0
					let startIndex = 0
					const children = el.parentNode.sourceNode.childNodes

					for (let i=0; i<children.length; i++) {
						let currentNode = children[i]
						if (children[i].nodeName !== '#text') {  // 规范化的第一点要求保证了这里的 [0] 一点就是全部文本了
							if (children[i].childNodes[0]) {
								currentNode = children[i].childNodes[0]
							} else {
								continue
							}
						}
						const currentLength = currentNode?.length || 0
						startTextLength += currentLength
						if (startTextLength >= index) {
							range.setStart(currentNode, index - (startTextLength - currentLength))
							startIndex = i
							break
						}
					}

					for (let i=0; i<children.length; i++) {
						let currentNode = children[i]
						if (children[i].nodeName !== '#text') { // 规范化的第一点要求保证了这里的 [0] 一点就是全部文本了
							currentNode = children[i].childNodes[0]
						}
						const currentLength = currentNode?.length || 0
						endTextLength += currentLength
						if (endTextLength >= index + execResLength) {
							range.setEnd(currentNode, index + execResLength - (endTextLength - currentLength))
							break
						}
					}
				} else {
					range.setStart(el, index)
					range.setEnd(el, index + execResLength)
				}

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

window.observerBodyAndOpenShadowRoot = observerBodyAndOpenShadowRoot
