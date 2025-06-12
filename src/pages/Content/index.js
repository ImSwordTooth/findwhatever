import React from 'react';
import { createRoot } from 'react-dom/client'
import { Pop } from './Pop'
import ShadowRoot from 'react-shadow'
import styles from '../../output.css'
import antdStyle from 'antd/dist/antd.less'
import CoverAntdStyle from '../../coverAntd.css'

const dom = document.createElement('div');
dom.id = '__swe_container'
dom.style.cssText = `
	position: relative;
	z-index: 999999999999999999;
`
const root = createRoot(dom)

export const createOrUpdatePopup = (props) => {
	root.render(
		<ShadowRoot.div mode="closed">
			<Pop {...props} />
			<style type="text/css">{styles[0][1].toString()}</style>
			<style type="text/css">{antdStyle[0][1].toString()}</style>
			<style type="text/css">{CoverAntdStyle[0][1].toString()}</style>
		</ShadowRoot.div>
	)
	document.body.appendChild(dom)
	const style = document.createElement('style')
	style.innerText = `
	.fade-out {
		animation: fadeout ease-out .2s forwards;
		transform-origin: center;
	}
	@keyframes fadeout {
		from { opacity: 1 }
		to { opacity: 0 }
	}
	`
	document.head.appendChild(style)
}

export const destroyPopup = () => {
	const element = document.getElementById('__swe_container')
	element.classList.add('fade-out')
	element.addEventListener('animationend', () => {
		element.remove()
		root.unmount()
	}, { once: true })
}

window.updatePopup = createOrUpdatePopup



