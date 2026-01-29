import React, { useEffect, useState, createContext, useRef } from 'react'
import { i18n } from '../i18n'
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

export const SettingContext = createContext(null)

const INIT_SETTING = {
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
	isOpenUnicode: false, // 是否开启 unicode 模式

	isShowClose: true, // 是否显示设置按钮
}

export const Options = () => {
	const [ setting, setSetting ] = useState({})
	const timerRef = useRef(null);

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
		message.success(i18n('重置成功'))
	}

	return (
		<SettingContext.Provider value={{setting, updateSetting}}>
			<div className="flex flex-col optionWrap">
				<div className="flex items-center justify-between mb-[40px] px-[40px]">
					<div className="flex items-center">
						<img className="w-[48px] h-[48px] mr-2" src="https://i2.letvimg.com/lc18_lemf/202503/31/13/43/icon.png"
							 alt=""/>
						<div className="font-mono text-2xl">Find whatever {i18n('设置项')}</div>
					</div>

					<div className="flex items-center">
						<a href="https://www.producthunt.com/products/find-whatever-regex-auto-re-find?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-find&#0045;whatever" target="_blank" style={{ marginRight: '16px' }}>
							<img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=987390&theme=light&t=1752202780162" alt="Find&#0032;whatever - Enhance&#0032;your&#0032;browser&#0039;s&#0032;find&#0032;capabilities | Product Hunt" style={{ width: '180px' }} />
						</a>
						<Popover
							placement="bottomRight"
							content={
								<div style={{padding: '8px', width: '240px'}}>
									{
										(navigator.language === 'zh' || navigator.language === 'zh-CN')
											?
											<div>
												根据您的浏览器语言自动设置文本语言。目前只准备了中文和英语两个版本，如果需要更多，请在
												<a style={{color: '#0788dc'}}
												   href="https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo/reviews"
												   target="_blank">chrome 商店</a>或者 <a style={{color: '#0788dc'}}
																						  href="https://github.com/ImSwordTooth/findwhatever/issues"
																						  target="_blank">Github</a> 评论留言
											</div>
											:
											<div>
												Automatically set the text language according to the language of your
												browser. Currently, only Chinese and English versions are available. If
												you need more languages, please leave a comment in <a
												style={{color: '#0788dc'}}
												href="https://chromewebstore.google.com/detail/find-whatever-regex-auto/pdpkckoiaiinjlhddhcoknjhdncepnbo/reviews"
												target="_blank">the Chrome Store</a> or on <a style={{color: '#0788dc'}}
																							  href="https://github.com/ImSwordTooth/findwhatever/issues"
																							  target="_blank">Github</a>.
											</div>
									}
								</div>
							}
						>
							<svg t="1750141566360" className="icon w-[28px] h-[28px] mr-2 cursor-pointer" viewBox="0 0 1024 1024" version="1.1"
								 xmlns="http://www.w3.org/2000/svg" p-id="2343" width="200" height="200">
								<path
									d="M661.333333 192H423.253333l-18.752-93.696-83.669333 16.725333L336.213333 192H106.666667v85.333333h95.893333c5.696 17.92 14.101333 42.090667 25.578667 69.098667 19.754667 46.464 49.664 104 92.224 152.234667-38.485333 29.141333-81.344 55.594667-118.933334 76.8a1442.346667 1442.346667 0 0 1-84.458666 43.946666l-5.034667 2.346667-1.237333 0.576-0.341334 0.149333 17.642667 38.826667c17.621333 38.869333 17.706667 38.826667 17.706667 38.826667l0.106666-0.042667 0.426667-0.192 1.557333-0.704 5.674667-2.666667c4.906667-2.325333 11.946667-5.696 20.650667-10.026666a1527.829333 1527.829333 0 0 0 69.205333-36.693334c42.581333-24.021333 94.314667-55.936 140.672-92.48 46.336 36.544 98.090667 68.48 140.672 92.48a1527.722667 1527.722667 0 0 0 75.434667 39.765334l-17.002667 40.64-68.096 171.370666 79.317333 31.509334L634.453333 832h181.696l40.170667 101.098667 79.317333-31.509334-67.84-170.666666L767.381333 490.666667h-84.117333l-50.176 120.021333-1.216-0.597333a1441.792 1441.792 0 0 1-65.28-34.624c-37.632-21.205333-80.469333-47.658667-118.954667-76.8 42.56-48.213333 72.469333-105.770667 92.224-152.234667a782.357333 782.357333 0 0 0 25.578667-69.12H661.333333V192z m-200 121.045333c-18.176 42.752-43.776 90.645333-77.333333 128.789334-33.557333-38.144-59.157333-86.037333-77.333333-128.789334A694.805333 694.805333 0 0 1 292.650667 277.333333h182.698666c-3.925333 10.88-8.597333 22.954667-14.016 35.712zM781.909333 746.666667h-113.173333l56.576-135.36L781.909333 746.666667z"
									fill="#4E5969" p-id="2344"></path>
							</svg>

						</Popover>
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
				</div>
			</div>
		</SettingContext.Provider>
	)
}
