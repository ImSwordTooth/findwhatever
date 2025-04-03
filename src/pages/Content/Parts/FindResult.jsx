import React from 'react'
import {i18n} from "../features";
import Proptypes from 'prop-types'

export const FindResult = (props) => {
	const { current, total } = props

	const copyResult = async () => {
		const { resultSum } = await chrome.storage.session.get(['resultSum'])

		const tag = document.createElement('textarea')
		tag.setAttribute('id', 'swe_TempInput')
		tag.value = resultSum.map(r => r.matchText.join('\r\n')).join('\r\n')
		document.body.appendChild(tag);
		tag.select();
		document.execCommand('copy');
		document.body.removeChild(tag)
	}

	return (
		<>
			<div
				className="flex items-center cursor-grab shrink-0 active:cursor-grabbing hover:text-[#3aa9e3] transition-colors"
				onClick={copyResult}>
				{i18n('查找结果')}
				<svg className="w-2.5 h-2.5 ml-[1px]" fill="#3aa9e3" viewBox="64 64 896 896" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
				</svg>
			</div>
			：<span id="__swe_current" className="mr-1 ml-0.5 inline-block min-w-2.5 text-right shrink-0">{current}</span>
			/ <span className="ml-1 inline-block min-w-2.5 text-left shrink-0" id="__swe_total">{total.map(a => a.sum).reduce((a, b) => a + b, 0)}</span>
		</>
	)
}

FindResult.propTypes = {
	current: Proptypes.number,
	total: Proptypes.array,
}
