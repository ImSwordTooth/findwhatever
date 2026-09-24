import { createRoot } from 'preact/compat/client';
import { Pop } from './Pop'
import '../../i18n'
import styles from '../../global.css'

const CONTAINER_ID = '__swe_container';
let containerDiv = null;
let shadowHost = null;
let shadowRoot = null;
let root = null;

export const createOrUpdatePopup = (props) => {
	if (!containerDiv) {
		containerDiv = document.createElement('div');
		containerDiv.id = CONTAINER_ID;
		// 顶级容器与宿主插槽彻底重置，杜绝宿主页面的 font-size/line-height/zoom/box-sizing 穿透
		containerDiv.style.cssText = `
			all: initial;
			position: fixed;
			top: 0;
			left: 0;
			width: 0;
			height: 0;
			z-index: 2147483647;
			pointer-events: none;
			border: none;
			padding: 0;
			margin: 0;
		`;
		shadowHost = document.createElement('div');
		shadowHost.style.cssText = `
			all: initial;
			display: block;
			pointer-events: auto;
		`;
		containerDiv.appendChild(shadowHost);
		shadowRoot = shadowHost.attachShadow({ mode: 'closed' });
		document.documentElement.appendChild(containerDiv);
	}

	if (!root && shadowRoot) {
		root = createRoot(shadowRoot);
	}

	root?.render(
		<>
			<Pop {...props} />
			<style type="text/css">{styles}</style>
		</>
	);
};

export const destroyPopup = () => {
	const targetContainer = document.getElementById(CONTAINER_ID) || containerDiv;
	if (root) {
		root.unmount();
		root = null;
	}
	if (targetContainer) {
		targetContainer.remove();
	}
	containerDiv = null;
	shadowHost = null;
	shadowRoot = null;
};

window.__swe_updatePopup = window.updatePopup = createOrUpdatePopup;
