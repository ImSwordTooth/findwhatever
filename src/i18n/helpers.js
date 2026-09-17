import { changeLanguage } from 'i18next'

export const BROWSER_LANG_MAP = {
	zh: '',
	en: 'English',
	ru: 'Russian',
	ar: 'Arabic',
	pt: 'Portuguese',
	es: 'Spanish',
	fr: 'French',
	de: 'German',
	ko: 'Korean',
	ja: 'Japanese'
}

/**
 * 统一应用和切换扩展语言
 * @param {string} [language] 存储的语言设置 ('auto', 'Chinese', 'English', etc.)
 * @returns {string} 实际激活的语言名称
 */
export const applyAppLanguage = (language) => {
	if (!language || language === 'Chinese') {
		changeLanguage('')
		return ''
	}
	if (language !== 'auto') {
		changeLanguage(language)
		return language
	}

	// 跟随系统语言
	const match = /(\w+)-?/g.exec(typeof navigator !== 'undefined' ? navigator.language : '')
	const prefix = match && match[1] ? match[1].toLowerCase() : ''
	const targetLang = BROWSER_LANG_MAP[prefix] ?? ''
	changeLanguage(targetLang)
	return targetLang
}
