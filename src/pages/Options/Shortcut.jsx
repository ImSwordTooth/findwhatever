import React from 'react';
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

export const Shortcut = (props) => {
	const { isMulti = false, shortkey } = props
	const { t } = useTranslation()
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

	const getFinalKey = () => {
		if (isMulti) {
			if (isMac) {
				return `Ctrl + ${shortkey.toUpperCase()}`
			} else {
				return `Ctrl + Shift + ${shortkey.toUpperCase()}`
			}
		} else {
			return shortkey
		}
	}

	return (
		<div className="shortcut">{t('快捷键')}：<span className="key">{getFinalKey()}</span></div>
	)
}

Shortcut.propTypes = {
	isMulti: PropTypes.bool,
	shortkey: PropTypes.string
}

