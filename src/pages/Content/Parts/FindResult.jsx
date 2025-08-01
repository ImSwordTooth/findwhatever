import React, {useEffect} from 'react'
import {i18n} from "../../i18n";
import Proptypes from 'prop-types'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { easeIn, easeOut, circOut, spring } from 'motion'

export const FindResult = (props) => {
	const { current, total, isShowResultText } = props

	const aniCurrent = useMotionValue(total.map(a => a.sum).reduce((a, b) => a + b, 0))
	const rounded = useTransform(() => Math.round(aniCurrent.get()), { ease: circOut })

	useEffect(() => {
		const controls = animate(aniCurrent, total.map(a => a.sum).reduce((a, b) => a + b, 0), { duration: 0.25 })

		return () => {
			controls.stop()
		}
	}, [total]);

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
			{
				isShowResultText &&
				<>
					<div
						className="flex items-center cursor-grab shrink-0 active:cursor-grabbing hover:text-[#3aa9e3] transition-colors"
						onClick={copyResult}>
						<div className="scale-90 origin-right">{i18n('查找结果')}</div>
						<svg className="w-2.5 h-2.5 ml-[1px]" fill="#3aa9e3" viewBox="64 64 896 896" version="1.1" xmlns="http://www.w3.org/2000/svg">
							<path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z"></path>
						</svg>
					</div>
					：
				</>
			}
			<span id="__swe_current" className="mr-1 inline-block min-w-[15px] text-right shrink-0 monofont shadowText">{current}</span>
			/ <motion.span className="ml-1 inline-block min-w-[15px] text-left shrink-0 monofont shadowText" id="__swe_total">{rounded}</motion.span>
		</>
	)
}

FindResult.propTypes = {
	current: Proptypes.number,
	total: Proptypes.array,
}
