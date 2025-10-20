import React from 'react';
import PropTypes from 'prop-types'

export const Shortcut = (props) => {
	const { isMulti = false, shortkey } = props
	const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;
	const isChinese = navigator.language === 'zh' || navigator.language === 'zh-CN'

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
		<div className="shortcut">{isChinese ? '快捷键' : 'shortcut'}：<span className="key">{getFinalKey()}</span></div>
	)
}

Shortcut.propTypes = {
	isMulti: PropTypes.bool,
	shortkey: PropTypes.string
}

