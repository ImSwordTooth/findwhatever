import React from 'react';
import { createRoot } from 'react-dom/client'
import { Pop } from './Pop'
import ShadowRoot from 'react-shadow'
import '../i18nnext'
import styles from '../../output.css'
import antdStyle from 'antd/dist/antd.less'
import CoverAntdStyle from '../../coverAntd.css'

const CONTAINER_ID = '__swe_container';
let containerDiv = null
let root = null

export const createOrUpdatePopup = (props) => {
	if (!containerDiv) {
		containerDiv = document.createElement('div');
		containerDiv.id = CONTAINER_ID;
		// 建议使用 fixed 覆盖全屏或局部，z-index 取 32 位整型最大值
		containerDiv.style.cssText = `
            position: fixed;
            z-index: 2147483647;
        `;
		document.documentElement.appendChild(containerDiv);
	}

	if (!root) {
		root = createRoot(containerDiv);
	}

	root.render(
		<ShadowRoot.div mode="closed">
			<Pop {...props} />
			<style type="text/css">{styles[0][1].toString()}</style>
			<style type="text/css">{antdStyle[0][1].toString()}</style>
			<style type="text/css">{CoverAntdStyle[0][1].toString()}</style>
		</ShadowRoot.div>
	)
}

export const destroyPopup = () => {
	let containerDiv = document.getElementById(CONTAINER_ID);
	if (!containerDiv) return
	if (root) {
		root.unmount();
		root = null;
	}
	if (containerDiv) {
		containerDiv.remove();
		containerDiv = null;
	}

}

window.updatePopup = createOrUpdatePopup



