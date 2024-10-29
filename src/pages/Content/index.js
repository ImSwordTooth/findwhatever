import React from 'react';
import { createRoot } from 'react-dom/client'
import { Pop } from './Pop'
import { NextUIProvider } from '@nextui-org/react'

const dom = document.createElement('div');
dom.id = '__swe_container'
const root = createRoot(dom)

export const createOrUpdatePopup = (props) => {
	root.render(
		<NextUIProvider>
			<Pop {...props} />
		</NextUIProvider>
	)
	document.body.appendChild(dom)
}

export const destroyPopup = () => {
	document.getElementById('__swe_container').remove()
	root.unmount()
}

window.updatePopup = createOrUpdatePopup

// 获取元素的隐藏状态，返回一个描述元素不可见的原因的字符串，如果不为空，说明元素不可见
window.__swe_isElementVisible = (el) => {
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


