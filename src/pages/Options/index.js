import React from 'react';
import { createRoot } from 'react-dom/client';

import { Options } from './Options';
import styles from '../../output.css'
import antdStyle from 'antd/dist/antd.less'
import CoverAntdStyle from '../../coverAntd.css'

const container = document.getElementById('app-container');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
	<div>
		<Options title={'Settings'} />
		<style type="text/css">{styles[0][1].toString()}</style>
		<style type="text/css">{antdStyle[0][1].toString()}</style>
		<style type="text/css">{CoverAntdStyle[0][1].toString()}</style>
	</div>
);
