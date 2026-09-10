import { destroyPopup } from "./index";
import { useState, useRef, useEffect } from 'preact/compat'

// 块级元素和分隔标签：遇到这些元素时，行内文本流在此自然断开
const BLOCK_TAGS = new Set([
	'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'CANVAS', 'DD', 'DIV',
	'DL', 'DT', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM',
	'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN',
	'NAV', 'NOSCRIPT', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'TBODY',
	'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL', 'DETAILS', 'SUMMARY',
	'DIALOG'
])

// 绝对忽略的不可搜索标签
const IGNORE_TAGS = new Set(['STYLE', 'SCRIPT', 'NOSCRIPT', 'SVG'])

// 纯内存文本投影：根据匹配字符的起止偏移量，在 segments 映射表中高精度还原原生 DOM Range
const createRangeFromSegments = (segments, startIndex, endIndex) => {
	if (!segments || segments.length === 0) return null

	let startNode = null
	let startOffset = 0
	let endNode = null
	let endOffset = 0

	for (let i = 0; i < segments.length; i++) {
		const seg = segments[i]
		// 寻找起始文本节点与内部 offset
		if (!startNode && (startIndex < seg.end || (startIndex === seg.end && i === segments.length - 1))) {
			startNode = seg.node
			startOffset = Math.max(0, startIndex - seg.start)
		}
		// 寻找结束文本节点与内部 offset
		if (endIndex <= seg.end || i === segments.length - 1) {
			endNode = seg.node
			endOffset = Math.min(seg.node.length || 0, Math.max(0, endIndex - seg.start))
			break
		}
	}

	if (startNode && endNode) {
		try {
			const range = new Range()
			range.setStart(startNode, startOffset)
			range.setEnd(endNode, endOffset)
			return range
		} catch (e) {
			console.error('createRangeFromSegments error:', e)
			return null
		}
	}
	return null
}

// 生成匹配节点树（纯内存文本投影 Text Projection 模型，彻底替代 cloneNode）
export const reCheckTree = () => {
	window.allNodes = []
	return new Promise(resolve => {
		let currentSegments = []
		let currentText = ''

		const flushStream = () => {
			if (currentSegments.length > 0) {
				if (!/^\s+$/.test(currentText)) {
					window.allNodes.push({
						text: currentText,
						segments: currentSegments
					})
				}
				currentSegments = []
				currentText = ''
			}
		}

		const traverse = (node) => {
			if (!node) return

			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent
				if (text && text.length > 0) {
					const start = currentText.length
					const end = start + text.length
					currentSegments.push({ node, start, end })
					currentText += text
				}
				return
			}

			if (node.nodeType === Node.ELEMENT_NODE) {
				const tagName = node.tagName
				if (IGNORE_TAGS.has(tagName)) return

				// 可见性检查（DETAILS 内部豁免，确保折叠内容可被检索并在激活时自动展开）
				const isDetails = tagName === 'DETAILS' || (typeof node.closest === 'function' && node.closest('details'))
				if (!isDetails) {
					if (typeof node.checkVisibility === 'function') {
						if (!node.checkVisibility({ checkVisibilityCSS: true })) {
							return
						}
					} else {
						const style = window.getComputedStyle(node)
						if (style.display === 'none') {
							return
						}
					}
				}

				// 遇到 BR 换行，截断行内流
				if (tagName === 'BR') {
					flushStream()
					return
				}

				const isBlock = BLOCK_TAGS.has(tagName)
				if (isBlock) {
					flushStream()
				}

				if (node.shadowRoot) {
					traverse(node.shadowRoot)
				}

				for (let child = node.firstChild; child; child = child.nextSibling) {
					traverse(child)
				}

				if (isBlock) {
					flushStream()
				}
			} else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
				for (let child = node.firstChild; child; child = child.nextSibling) {
					traverse(child)
				}
			}
		}

		traverse(document.body)
		flushStream()
		resolve()
	})
}

export const closePop = () => {
	window.__swe_observer?.disconnect()
	document.removeEventListener('keydown', window.handleCloseByEsc)
	CSS.highlights.clear()
	destroyPopup()
	window.rangesFlat = []
	window.allNodes = []
	if (window.filteredRangeList) {
		window.filteredRangeList.value = []
	}
	chrome.storage.session.set({ resultSum: [], frames: [] })
	chrome?.runtime?.sendMessage({
		action: 'closeAction'
	})
	chrome.storage.sync.get(['recent', 'searchValue']).then(({ recent, searchValue }) => {
		if (searchValue) {
			const newRecent = Array.isArray(recent) ? recent.slice() : []
			if (!newRecent.includes(searchValue)) { // 没有就直接新增到头部
				newRecent.unshift(searchValue)
				if (newRecent.length > 50) { // 超出50条时剔除尾部最旧项
					newRecent.pop()
				}
			} else { // 已存在则置顶到最新
				const index = newRecent.findIndex(r => r === searchValue)
				if (index > 0) {
					newRecent.unshift(newRecent.splice(index, 1)[0])
				}
			}
			chrome.storage.sync.set({ recent: newRecent })
		}
	})
}

const observedShadowRoots = new WeakSet()

export const observerBodyAndOpenShadowRoot = () => {
	if (!document?.body || !window.__swe_observer) {
		return
	}
	window.__swe_observer.observe(document.body, {
		subtree: true,
		childList: true,
		attributes: true,
		characterData: true,
		attributeFilter: ['class', 'style', 'hidden', 'open', 'selected', 'aria-expanded', 'aria-hidden']
	})

	function observeAllShadowRoots(startNode) {
		const elements = startNode.querySelectorAll('*');
		elements.forEach(element => {
			const shadowRoot = element.shadowRoot;
			if (shadowRoot && shadowRoot.mode === 'open') {
				if (!observedShadowRoots.has(shadowRoot)) {
					observedShadowRoots.add(shadowRoot)
					window.__swe_observer.observe(shadowRoot, {
						subtree: true,
						childList: true,
						attributes: true,
						characterData: true,
						attributeFilter: ['class', 'style', 'hidden', 'open', 'selected', 'aria-expanded', 'aria-hidden']
					});
				}
				observeAllShadowRoots(shadowRoot);
			}
		});
	}
	observeAllShadowRoots(document)
}

// 动态探针字符串（包含 Emoji、多语言、标点、控制字符、零宽字符等各类极端样本，单例常驻内存）
const PROBE_TEST_STRING = [
	// 普通文本
	'Hello World', '123456', 'test@example.com',
	// 特殊字符
	'!@#$%^&*()', '[]{}|\\', '`~-_=+',
	// Unicode 字符
	'中文', '日本語', '한국어', 'Русский', 'العربية', 'עברית', '🌍🌎🌏', '🚀💻🎉',
	// 空白字符
	'   ', '\t\t',
	// 边界情况
	'', 'a', 'A', '0', '.', '*', '+', '?',
	// 混合内容
	'a1B2c3', 'test123!@#', 'tab\tseparated\tvalues',
	// 长文本
	'a'.repeat(100), 'test '.repeat(50),
	// 各种引号
	`'single'`, `"double"`, '`backtick`', '«guillemets»', '„quotes"',
	// 数学符号
	'∑∏∫√∞', 'αβγδε', '≤≥≠≈',
	// 控制字符（部分）
	String.fromCharCode(0), String.fromCharCode(1), String.fromCharCode(7), String.fromCharCode(27),
	// 零宽字符
	'\u200B', '\u200C', '\u200D', '\uFEFF'
].join('')

const isDangerousReg = (reg) => {
	if (!reg || reg.source === '.') {
		return true
	}

	// 任意字符类
	const anyCharClassPatterns = ['.', '[\\S\\s]', '[\\s\\S]', '[\\d\\D]', '[\\D\\d]', '[\\w\\W]', '[\\W\\w]', '[^]']
	// 所有量词模式
	const quantifierPatterns = ['*', '+', '?', '*?', '+?', '??', '{0,}', '{1,}', '{0,1}', '{0,}?', '{1,}?', '{0,1}?']
	// 检查完全匹配：任意字符类 + 量词
	for (const charClass of anyCharClassPatterns) {
		for (const quantifier of quantifierPatterns) {
			if (reg.source === `${charClass}${quantifier}`) {
				return true
			}
		}
	}

	/**
	 * 如果侥幸过了黑名单，用高度多元的探针文本进行动态启发式匹配：
	 * 如果当前正则能够把长达数百字符的多元极端文本全部一口吞掉覆盖，说明太宽泛了，判定为危险正则
	 */
	reg.lastIndex = 0
	const res = reg.exec(PROBE_TEST_STRING)
	return !!(res && res.indices?.[0] && (res.indices[0][1] - res.indices[0][0] === PROBE_TEST_STRING.length))
}

export const getSearchReg = async () => {
	const { searchValue, isMatchCase, isWord, isReg } = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive', 'swe_setting'])
	if (!searchValue) {
		return { regContent: '', error: false, errorType: '' }
	}

	let reg = null
	let error = false
	let errorType = ''

	let regContent = searchValue
	if (!isReg) {
		regContent = regContent.replace(/([.*+?^${}()|[\]\\])/g, '\\$1')
	}
	if (isWord) {
		regContent = `(?<![\\p{L}\\p{N}])${regContent}(?![\\p{L}\\p{N}])`
	}
	try {
		reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dgu`)
		const isDanger = isDangerousReg(reg)

		if (isDanger) {
			error = true
			errorType = 'danger reg'
			if (!window.rangesFlat) {
				window.rangesFlat = []
			}
		}
	} catch (e) {
		// 正则表达式不合法
		error = true
		errorType = 'invalid reg'
		if (!window.rangesFlat) {
			window.rangesFlat = []
		}
	}

	return { regContent, error, errorType }
}

export const doSearchOutside = async (regContent, isAuto = false) => {
	CSS.highlights.clear() // 清除所有高亮

	const { searchValue, isMatchCase } = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg', 'isLive', 'swe_setting'])
	const matchText = []

	if (searchValue && window.allNodes) { // 如果有搜索词

		if (window.filteredRangeList) {
			window.filteredRangeList.value = [] // 清除之前搜索到的匹配结果的 DOM 集合
		}

		// 根据筛选项，设置正则表达式
		let reg = null
		reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dgu`);

		window.rangesFlat = window.allNodes.map(({ text, segments }) => {
			const indices = [] // 对象数组，{ indicesStart: number, indicesLength: number }，分别是起点和长度
			let startPosition = 0

			while (startPosition < text.length) {
				let index
				reg.lastIndex = 0
				const res = reg.exec(text.substring(startPosition))

				if (res) {
					index = res.indices[0][0]
					const execResLength = res.indices[0][1] - res.indices[0][0]
					if (execResLength < 1) { // 即使 res 有值，也可能是没匹配到，所以要判断一下
						break
					}
					indices.push({
						indicesStart: startPosition + index,
						indicesLength: execResLength
					})
					startPosition += index + execResLength
					matchText.push(res[0])
				} else {
					break
				}
			}

			return indices.map(({ indicesStart, indicesLength }) => {
				const indicesEnd = indicesStart + indicesLength
				const range = createRangeFromSegments(segments, indicesStart, indicesEnd)
				if (range) {
					let targetDOM = range.commonAncestorContainer
					if (targetDOM.nodeType !== Node.ELEMENT_NODE) {
						targetDOM = targetDOM.parentElement
					}
					if (targetDOM instanceof ShadowRoot || targetDOM.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
						targetDOM = targetDOM.host
					}
					window.filteredRangeList.value = [...window.filteredRangeList.value, targetDOM]
					return range
				}
				return null
			}).filter(Boolean)
		}).flat()
	} else {
		window.rangesFlat = []
	}

	const searchResultsHighlight = new Highlight(...window.rangesFlat)
	CSS.highlights.set('search-results', searchResultsHighlight)

	return {
		resultNum: window.rangesFlat.length,
		matchText,
		isAuto,
		isFrame: window.isFrame
	}
}

export const isElementVisible = (el) => {
	if (!el) {
		return ''
	}
	if (navigator.userAgent.indexOf('Firefox') > -1) {
		const root = el.getRootNode()
		if (root instanceof ShadowRoot) {
			return 'shadow dom'
		}
	}

	// 1. 优先使用现代原生 checkVisibility API 检查可见性与透明度（C++ 原生层执行，0 样式重排）
	if (typeof el.checkVisibility === 'function') {
		// 检查纯 CSS 可见性（display: none / visibility: hidden / content-visibility）
		const isCssVisible = el.checkVisibility({
			checkOpacity: false,
			checkVisibilityCSS: true,
			contentVisibilityAuto: true
		})
		if (!isCssVisible) return '隐藏中'

		// 检查透明度（opacity: 0）
		const isOpacityVisible = el.checkVisibility({
			checkOpacity: true,
			checkVisibilityCSS: true
		})
		if (!isOpacityVisible) return '全透明'
	} else {
		// 兜底降级处理
		const style = window.getComputedStyle(el)
		if (style.display === 'none' || style.visibility === 'hidden') return '隐藏中'
		if (parseFloat(style.opacity) < 0.01) return '全透明'
	}

	// 2. 检查元素几何尺寸
	const rect = el.getBoundingClientRect()
	if (rect.width === 0 && rect.height === 0) {
		return '隐藏中'
	}

	// 3. 检查是否在当前视口内（关键修复：若元素在视口下方深处尚未滚动到位，绝不误判为“被遮盖”）
	const isInViewport = (
		rect.bottom > 0 &&
		rect.right > 0 &&
		rect.top < window.innerHeight &&
		rect.left < window.innerWidth
	)
	if (!isInViewport) {
		return ''
	}

	// 4. 仅针对处于当前视口内的点进行遮挡检测
	const points = [
		{ x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 }, // 中心
		{ x: rect.left + 1, y: rect.top + 1 }, // 左上
		{ x: rect.right - 1, y: rect.bottom - 1 } // 右下
	]

	let isCovered = true
	for (const point of points) {
		// 避开视口外坐标
		if (point.x < 0 || point.y < 0 || point.x > window.innerWidth || point.y > window.innerHeight) continue

		const topElement = document.elementFromPoint(point.x, point.y)
		if (topElement && (el === topElement || el.contains(topElement) || topElement.contains(el))) {
			isCovered = false // 只要有一个测试点能露出来，就认为未被遮盖
			break
		}
	}

	return isCovered ? '被遮盖' : ''
}

// 自定义防抖 Hook
export const useDebounce = (value, delay, immediate) => {
	const [ debouncedValue, setDebouncedValue ] = useState(value);
	const [ isDebounceOk, setIsDebounceOK ] = useState(Boolean(immediate));

	useEffect(() => {
		if (immediate) {
			setDebouncedValue(value);
			setIsDebounceOK(true);
			return;
		}

		setIsDebounceOK(false);
		const timer = setTimeout(() => {
			setDebouncedValue(value);
			setIsDebounceOK(true);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay, immediate]);

	return { debouncedValue, isDebounceOk };
};

window.__swe_doSearchOutside = doSearchOutside
window.__swe_getSearchReg = getSearchReg

// 获取元素的隐藏状态，返回一个描述元素不可见的原因的字符串，如果不为空，说明元素不可见
window.__swe_isElementVisible = isElementVisible

window.observerBodyAndOpenShadowRoot = observerBodyAndOpenShadowRoot

export const debounce = (fn, delay = 300) => {
	let timer = null;

	return function (...args) {
		// 如果在 delay 时间内再次触发，则清空之前的计时器
		if (timer) {
			clearTimeout(timer);
		}

		// 重新开始计时
		timer = setTimeout(() => {
			fn.apply(this, args);
			timer = null;
		}, delay);
	};
};
