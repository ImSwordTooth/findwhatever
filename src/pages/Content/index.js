import { createRoot } from 'preact/compat/client';
import { Pop } from './Pop'
import '../i18nnext'
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
		// 建议使用 fixed 覆盖全屏或局部，z-index 取 32 位整型最大值
		containerDiv.style.cssText = `
            position: fixed;
            z-index: 2147483647;
        `;
		shadowHost = document.createElement('div');
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
			<style type="text/css">{styles[0][1].toString()}</style>
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
