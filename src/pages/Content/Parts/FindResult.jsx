import React, {useEffect, useMemo, useState} from 'react'
import { useTranslation } from 'react-i18next'
import Proptypes from 'prop-types'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import CopySvg from '../../../assets/svg/copy.svg'
import OkSvg from '../../../assets/svg/ok.svg'

export const FindResult = (props) => {
	const { current, total, isShowResultText } = props

	const { t } = useTranslation()

	const [ isCopied, setIsCopied ] = useState(false)

	const totalCount = useMemo(() => {
		return total.map(a => a.sum).reduce((a, b) => a + b, 0)
	}, [total])

	const aniCurrent = useMotionValue(totalCount)
	const rounded = useTransform(aniCurrent, (latest) => Math.round(latest))

	useEffect(() => {
		const controls = animate(aniCurrent, totalCount, { duration: 0.25, ease: 'circOut' })

		return () => {
			controls.stop()
		}
	}, [totalCount]);

	const copyResult = async () => {
		const { resultSum } = await chrome.storage.session.get(['resultSum'])

		const tag = document.createElement('textarea')
		tag.setAttribute('id', 'swe_TempInput')
		tag.value = resultSum.map(r => r.matchText.join('\r\n')).join('\r\n')
		document.body.appendChild(tag);
		tag.select();
		document.execCommand('copy');
		document.body.removeChild(tag)
		setIsCopied(true)
		setTimeout(() => setIsCopied(false), 1000) // 1秒后恢复原样
	}

	return (
		<div className="flex items-center">
			{
				isShowResultText &&
				<>
					<div
						className="flex items-center cursor-grab shrink-0 active:cursor-grabbing hover:text-[var(--swe-color-primary)] dark:text-[#b7b4b4] dark:hover:text-[var(--swe-color-primary)] transition-colors"
						onClick={copyResult}>
						<div className="scale-90 origin-right">{t('查找结果')}</div>
						{
							isCopied
								?
								<motion.div style={{ originX: 0.5, originY: 0.5 }} className="flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
									<OkSvg className="w-3 h-3" />
								</motion.div>
								: <CopySvg className="w-2.5 h-2.5 ml-[1px]" />
						}
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
