import React, {useEffect} from 'react'
import {i18n} from "../../i18n";
import Proptypes from 'prop-types'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { circOut } from 'motion'
import CopySvg from '../../../assets/svg/copy.svg'

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
		<div className="flex items-center">
			{
				isShowResultText &&
				<>
					<div
						className="flex items-center cursor-grab shrink-0 active:cursor-grabbing dark:text-[#b7b4b4] dark:hover:text-[#3aa9e3] transition-colors"
						onClick={copyResult}>
						<div className="scale-90 origin-right">{i18n('查找结果')}</div>
						<CopySvg className="w-2.5 h-2.5 ml-[1px]" />
					</div>
					<span className="dark:text-[#ddd]">：</span>
				</>
			}
			<span id="__swe_current" className="mr-1 inline-block min-w-[15px] text-right shrink-0 monofont shadowText dark:text-[#ddd]">{current}</span>
			<span className="dark:text-[#ddd]"> / </span><motion.span className="ml-1 inline-block min-w-[15px] text-left shrink-0 monofont shadowText dark:text-[#ddd]" id="__swe_total">{rounded}</motion.span>
		</div>
	)
}

FindResult.propTypes = {
	current: Proptypes.number,
	total: Proptypes.array,
}
