import React from 'preact/compat';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export const Shortcut = (props) => {
	const { isMulti = false, shortkey } = props
	const { t } = useTranslation()
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

	const getKeys = () => {
		if (isMulti) {
			if (isMac) {
				return ['Ctrl', shortkey.toUpperCase()]
			} else {
				return ['Ctrl', 'Shift', shortkey.toUpperCase()]
			}
		} else {
			return [shortkey]
		}
	}

	const keys = getKeys()

	return (
		<div className="inline-flex items-center gap-1.5 text-xs text-zinc-500 my-1">
			<span className="text-zinc-400 dark:text-zinc-500 text-xs">{t('快捷键')}：</span>
			<div className="inline-flex items-center gap-1">
				{keys.map((key, index) => (
					<React.Fragment key={key}>
						{index > 0 && <span className="text-zinc-400 text-[11px] font-sans select-none">+</span>}
						<kbd className="min-w-[20px] px-1.5 py-0.5 inline-flex items-center justify-center rounded-[5px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-mono font-medium text-zinc-700 dark:text-zinc-200 shadow-[0_1.5px_0_0_rgba(0,0,0,0.08)] select-none">
							{key}
						</kbd>
					</React.Fragment>
				))}
			</div>
		</div>
	)
}

Shortcut.propTypes = {
	isMulti: PropTypes.bool,
	shortkey: PropTypes.string
}

