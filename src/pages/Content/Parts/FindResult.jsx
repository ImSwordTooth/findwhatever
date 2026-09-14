import React, { useEffect, useMemo, useState, useRef } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import Proptypes from 'prop-types'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import CopySvg from '../../../assets/svg/copy.svg'
import OkSvg from '../../../assets/svg/ok.svg'

export const FindResult = (props) => {
	const { current = 0, total = [], isShowResultText } = props

	const { t } = useTranslation()

	const [ isCopied, setIsCopied ] = useState(false)
	const containerRef = useRef(null)
	const copyTimerRef = useRef(null)

	const totalCount = useMemo(() => {
		if (!Array.isArray(total)) return 0
		return total.map(a => a?.sum || 0).reduce((a, b) => a + b, 0)
	}, [total])

	const aniCurrent = useMotionValue(totalCount)
	const rounded = useTransform(aniCurrent, (latest) => Math.round(latest))

	useEffect(() => {
		const controls = animate(aniCurrent, totalCount, { duration: 0.25, ease: 'circOut' })

		return () => {
			controls.stop()
		}
	}, [totalCount]);

	useEffect(() => {
		return () => {
			if (copyTimerRef.current) {
				clearTimeout(copyTimerRef.current)
			}
		}
	}, [])

	const copyResult = async () => {
		try {
			const { resultSum = [] } = await chrome.storage.session.get(['resultSum'])
			if (!resultSum || !Array.isArray(resultSum)) return

			const lines = []
			for (const r of resultSum) {
				if (Array.isArray(r?.matchText)) {
					lines.push(...r.matchText)
				}
			}
			if (lines.length === 0) return

			const tag = document.createElement('textarea')
			tag.setAttribute('id', 'swe_TempInput')
			tag.setAttribute('readonly', '')
			tag.style.cssText = 'position: absolute; left: -9999px; top: -9999px; opacity: 0; pointer-events: none;'
			tag.value = lines.join('\r\n')

			const parent = containerRef.current || document.getElementById('__swe_container') || document.body
			parent.appendChild(tag)
			tag.select()
			document.execCommand('copy')
			parent.removeChild(tag)

			setIsCopied(true)
			if (copyTimerRef.current) {
				clearTimeout(copyTimerRef.current)
			}
			copyTimerRef.current = setTimeout(() => setIsCopied(false), 1000)
		} catch (e) {
			// 静默保护
		}
	}

	return (
		<div ref={containerRef} className="flex items-center">
			{
				isShowResultText &&
				<>
					<div
						className="flex items-center cursor-grab shrink-0 active:cursor-grabbing hover:text-[var(--swe-color-primary)] dark:text-[#b7b4b4] dark:hover:text-[var(--swe-color-primary)] transition-colors"
						onClick={copyResult}>
						<div className="scale-90 origin-right">{t('查找结果')}</div>
						<span className="w-3.5 h-3.5 ml-1 inline-flex items-center justify-center shrink-0">
							{
								isCopied
									?
									<motion.div style={{ originX: 0.5, originY: 0.5 }} className="w-full h-full flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.15 }}>
										<OkSvg className="w-3 h-3" />
									</motion.div>
									: <CopySvg className="w-2.5 h-2.5" />
							}
						</span>
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
	isShowResultText: Proptypes.bool,
}
