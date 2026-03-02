import React, { useEffect, useState, createContext, useRef } from 'react'
import { changeLanguage } from 'i18next'
import { useTranslation } from 'react-i18next'
import { message, Popover } from 'antd'
import { DragBar } from './Parts/DragBar';
import { ExtraArea } from './Parts/ExtraArea';
import { FrameList } from './Parts/FrameList';
import { FindResult } from './Parts/FindResult';
import { FakePanel } from './fakePanel';
import { Input } from './Parts/Input';
import { History } from './Parts/History'
import { Feature } from './Parts/Feature'
import { Total } from './Parts/Total'
import { Changelog } from './Parts/Changelog'

export const SettingContext = createContext(null)

const INIT_SETTING = {
	language: 'auto',
	colorMode: 'dark',
	isUseGlassEffect: false, // 是否使用玻璃效果
	primaryColor: '#1677ff', // 主题色
	primaryColor_dark: '#44d62c', // 深色模式下的主题色

	dragArea: 'bar', // 可拖拽区域

	isShowStatus: true, // 是否显示状态
	isShowOpacity: true, // 是否显示临时透明度
	tempOpacity: 0.7, // 临时透明度
	isShowSetting: true, // 是否显示设置按钮

	isShowResultText: true, // 是否显示查找结果的文本

	bgColor: '#ffff37',
	textColor: '#000000',
	isOpenUnderline: false,
	underlineOffset: 2,
	underlineThickness: 2,
	underlineStyle: 'solid',
	underlineColor: '#000000',

	bgColorActive: '#ff8b3a',
	textColorActive: '#000000',
	isSame: true,
	isOpenUnderlineActive: false,
	underlineOffsetActive: 2,
	underlineThicknessActive: 2,
	underlineStyleActive:'solid',
	underlineColorActive: '#000000',

	textWidth: 340, // 文本框长度
	retentionTime: -1, // 历史记录保留时间
	isShowRing: true, // 是否显示文本框光圈

	isShowHistory: true, // 是否显示历史记录
	openHistoryMode: 'hover', // 历史记录打开方式
	debounceDuration: 200, // 非正则模式防抖时长
	regexDebounceDuration: 1000, // 正则模式防抖时长

	isShowClose: true, // 是否显示设置按钮
}

export const Options = () => {
	const [ setting, setSetting ] = useState({})
	const timerRef = useRef(null);

	const { t } = useTranslation()

	useEffect(() => {
		init()

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [])

	useEffect(() => {
		if (
			setting.colorMode === 'dark' ||
			(setting.colorMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.style.setProperty('--swe-color-primary', setting.primaryColor_dark)
		} else {
			document.documentElement.style.setProperty('--swe-color-primary', setting.primaryColor)
		}
	}, [setting.colorMode, setting.primaryColor, setting.primaryColor_dark]);

	useEffect(() => {
		const language = setting.language
		if (language !== 'auto') {
			changeLanguage(language)
		} else {
			const lang = /(\w+)-?/g.exec(navigator.language)
			if (lang && lang[1]) {
				switch (lang[1]) {
					case 'zh': changeLanguage(''); break;
					case 'en': changeLanguage('English'); break;
					case 'ru': changeLanguage('Russian'); break;
					case 'ar': changeLanguage('Arabic'); break;
					case 'pt': changeLanguage('Portuguese'); break;
					case 'es': changeLanguage('Spanish'); break;
					case 'fr': changeLanguage('French'); break;
					case 'de': changeLanguage('German'); break;
					case 'ko': changeLanguage('Korean'); break;
					case 'ja': changeLanguage('Japanese'); break;
				}
			} else {
				changeLanguage('')
			}
		}
	}, [setting.language])

	const init = async () => {
		const { swe_setting  } = (await chrome.storage.sync.get(['swe_setting'])) || { swe_setting: {} }

		const finalSetting = {
			...INIT_SETTING,
			...swe_setting
		}

		setSetting(finalSetting)

		chrome.storage.sync.set({
			swe_setting: finalSetting
		})
	}

	const generateStyleText = (obj) => {
		const { bgColor, textColor, isOpenUnderline, underlineColor, underlineOffset, underlineThickness, underlineStyle, isOpenUnderlineActive, underlineColorActive, underlineOffsetActive, underlineThicknessActive, underlineStyleActive, bgColorActive, isSame, textColorActive } = obj
		return `
            ::highlight(search-results) {
    			background-color: ${bgColor};
    			color: ${textColor};
				${isOpenUnderline? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : ''}
			}
			::highlight(search-results-active) {
    			background-color: ${bgColorActive};
    			color: ${textColorActive};
    			${isSame
			? (isOpenUnderline ? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : '' )
			: (isOpenUnderlineActive ? `text-decoration: underline; text-decoration-color: ${underlineColorActive}; text-underline-offset: ${underlineOffsetActive}px; text-decoration-thickness: ${underlineThicknessActive}px; text-decoration-style: ${underlineStyleActive}` : '')
		}
			}
		`
	}

	const updateSetting = (name, value) => {
		let newSetting
		if (typeof name === 'string') {
			newSetting = {
				...setting,
				[name]: value
			}
		} else {
			newSetting = {
				...setting,
				...name
			}
		}
		setSetting(newSetting)
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			chrome.storage.sync.set({ swe_setting: newSetting, styleText: generateStyleText(newSetting) })
		}, 300);
	}

	const resetSetting = () => {
		chrome.storage.sync.remove(['swe_setting', 'styleText'])
		setSetting(INIT_SETTING)
		message.success(t('重置成功'))
	}

	return (
		<SettingContext.Provider value={{setting, updateSetting}}>
			<div className="flex flex-col optionWrap">
				<div className="flex items-center justify-between mb-[40px] px-[40px]">
					<div className="flex items-center">
						<img className="w-[48px] h-[48px] mr-2" src="https://i2.letvimg.com/lc18_lemf/202503/31/13/43/icon.png"
							 alt=""/>
						<div className="font-mono text-2xl">Find whatever {t('设置项')}</div>
					</div>

					<div className="flex items-center">
						<a href="https://github.com/ImSwordTooth/findwhatever" target="_blank">
							<svg className="w-[26px] h-[26px] cursor-pointer" viewBox="0 0 1024 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" p-id="4118" width="200" height="200">
								<path
									d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
									fill="#231F20" p-id="4119"></path>
							</svg>
						</a>
					</div>
				</div>

				<div className="relative overflow-auto flex-1">
					<div className="mainOption">
						<Total />
						<DragBar/>
						<ExtraArea/>
						<FrameList/>
						<FindResult/>
						<Input/>
						<History/>
						<Feature/>
					</div>
					<FakePanel onReset={resetSetting}/>
					<Changelog />
				</div>
			</div>
		</SettingContext.Provider>
	)
}
