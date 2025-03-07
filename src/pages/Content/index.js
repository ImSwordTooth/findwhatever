import React from 'react';
import { createRoot } from 'react-dom/client'
import { Pop } from './Pop'
import ShadowRoot from 'react-shadow'
import styles from '../../output.css'
import antdStyle from 'antd/dist/antd.less'
import CoverAntdStyle from '../../coverAntd.css'

const dom = document.createElement('div');
dom.id = '__swe_container'
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
}

export const destroyPopup = () => {
	document.getElementById('__swe_container').remove()
	root.unmount()
}

window.updatePopup = createOrUpdatePopup



