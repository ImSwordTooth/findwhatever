import { useEffect, useState, createContext, useRef } from 'preact/compat'
import { applyAppLanguage } from '../../i18n'
import { useTranslation } from 'react-i18next'
import { DragBar } from './Parts/DragBar'
import { ExtraArea } from './Parts/ExtraArea'
import { FrameList } from './Parts/FrameList'
import { FindResult } from './Parts/FindResult'
import { FakePanel } from './fakePanel'
import { Input } from './Parts/Input'
import { History } from './Parts/History'
import { Feature } from './Parts/Feature'
import { Total } from './Parts/Total'

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
	underlineStyleActive: 'solid',
	underlineColorActive: '#000000',

	textWidth: 380, // 文本框长度
	retentionTime: -1, // 历史记录保留时间
	isShowRing: true, // 是否显示文本框光圈

	isShowHistory: true, // 是否显示历史记录
	openHistoryMode: 'hover', // 历史记录打开方式
	debounceDuration: 200, // 非正则模式防抖时长
	regexDebounceDuration: 1000, // 正则模式防抖时长

	isShowClose: true, // 是否显示关闭按钮
	isLoopNotice: true // 是否开启首尾循环跳转提示
}

// 严格严格使用各子模块原生 .areaTitle 的标题文本
const MENU_ITEMS = [
	{
		id: 'total',
		name: '整体',
		desc: '语言、浮窗主题色、毛玻璃效果等基础选项',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<circle cx="12" cy="12" r="9" strokeWidth="2" />
				<path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" fillOpacity="0.25" />
			</svg>
		)
	},
	{
		id: 'dragBar',
		name: '拖拽条',
		desc: '自定义浮窗的可抓取拖拽响应区域',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<polyline points="5 9 2 12 5 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<polyline points="9 5 12 2 15 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<polyline points="15 19 12 22 9 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<polyline points="19 9 22 12 19 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" strokeLinecap="round" />
				<line x1="12" y1="2" x2="12" y2="22" strokeWidth="2" strokeLinecap="round" />
			</svg>
		)
	},
	{
		id: 'extraArea',
		name: '右上角功能区',
		desc: '浮窗临时半透明度调节与辅助操作',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="2" />
				<circle cx="16" cy="8" r="2" fill="currentColor" />
			</svg>
		)
	},
	{
		id: 'frameList',
		name: '页面列表',
		desc: '多 iframe 与 Shadow DOM 跨帧检索穿透支持',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<polygon points="12 2 2 7 12 12 22 7 12 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<polyline points="2 17 12 22 22 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
				<polyline points="2 12 12 17 22 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)
	},
	{
		id: 'findResult',
		name: '查找结果',
		desc: '匹配项高亮颜色、激活状态与下划线微调',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)
	},
	{
		id: 'input',
		name: '输入框',
		desc: '文本框宽度、输入防抖时长与光圈效果',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<rect x="2" y="5" width="20" height="14" rx="3" strokeWidth="2" />
				<line x1="6" y1="12" x2="10" y2="12" strokeWidth="2" strokeLinecap="round" />
				<line x1="8" y1="9" x2="8" y2="15" strokeWidth="2" strokeLinecap="round" />
			</svg>
		)
	},
	{
		id: 'history',
		name: '历史记录',
		desc: '最近搜索建议流显示开关与记录管理',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<circle cx="12" cy="12" r="9" strokeWidth="2" />
				<polyline points="12 7 12 12 15 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)
	},
	{
		id: 'feature',
		name: '功能区',
		desc: '核心检索能力、正则匹配特性与快捷键一览',
		icon: (
			<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		)
	}
]

export const Options = () => {
	const [setting, setSetting] = useState({})
	const [activeId, setActiveId] = useState('total')
	const [toast, setToast] = useState('')
	const timerRef = useRef(null)

	const { t } = useTranslation()

	useEffect(() => {
		init()

		return () => {
			clearTimeout(timerRef.current)
		}
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
	}, [setting.colorMode, setting.primaryColor, setting.primaryColor_dark])

	useEffect(() => {
		applyAppLanguage(setting.language)
	}, [setting.language])

	const init = async () => {
		const { swe_setting } = (await chrome.storage.sync.get(['swe_setting'])) || { swe_setting: {} }

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
		const {
			bgColor,
			textColor,
			isOpenUnderline,
			underlineColor,
			underlineOffset,
			underlineThickness,
			underlineStyle,
			isOpenUnderlineActive,
			underlineColorActive,
			underlineOffsetActive,
			underlineThicknessActive,
			underlineStyleActive,
			bgColorActive,
			isSame,
			textColorActive
		} = obj

		return `
            ::highlight(search-results) {
    			background-color: ${bgColor};
    			color: ${textColor};
				${isOpenUnderline ? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}` : ''}
			}
			::highlight(search-results-active) {
    			background-color: ${bgColorActive};
    			color: ${textColorActive};
    			${
					isSame
						? isOpenUnderline
							? `text-decoration: underline; text-decoration-color: ${underlineColor}; text-underline-offset: ${underlineOffset}px; text-decoration-thickness: ${underlineThickness}px; text-decoration-style: ${underlineStyle}`
							: ''
						: isOpenUnderlineActive
						? `text-decoration: underline; text-decoration-color: ${underlineColorActive}; text-underline-offset: ${underlineOffsetActive}px; text-decoration-thickness: ${underlineThicknessActive}px; text-decoration-style: ${underlineStyleActive}`
						: ''
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
			clearTimeout(timerRef.current)
		}
		timerRef.current = setTimeout(() => {
			chrome.storage.sync.set({ swe_setting: newSetting, styleText: generateStyleText(newSetting) })
		}, 300)
	}

	const resetSetting = () => {
		const defaultStyle = generateStyleText(INIT_SETTING)
		chrome.storage.sync.set({
			swe_setting: INIT_SETTING,
			styleText: defaultStyle
		})
		setSetting(INIT_SETTING)
		setToast(t('重置成功'))
		setTimeout(() => setToast(''), 2200)
	}

	const currentItem = MENU_ITEMS.find(item => item.id === activeId) || MENU_ITEMS[0]

	const renderActiveContent = () => {
		switch (activeId) {
			case 'total':
				return <Total />
			case 'dragBar':
				return <DragBar />
			case 'extraArea':
				return <ExtraArea />
			case 'frameList':
				return <FrameList />
			case 'findResult':
				return <FindResult />
			case 'input':
				return <Input />
			case 'history':
				return <History />
			case 'feature':
				return <Feature />
			default:
				return <Total />
		}
	}

	return (
		<SettingContext.Provider value={{ setting, updateSetting }}>
			<div className="min-h-screen bg-[#fafbfc] text-zinc-800 flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-500 relative">
				{/* 现代微点阵背景 (方案 A Blueprint，极弱通透，带微弱温润环境光，告别纯黑白灰冷感) */}
				<div
					className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70"
					style={{
						maskImage: 'radial-gradient(ellipse 85% 75% at 50% 20%, #000 40%, transparent 100%)',
						WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 20%, #000 40%, transparent 100%)'
					}}
				/>
				<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
					<div className="absolute top-0 left-1/3 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-rose-500/6 via-amber-500/4 to-transparent blur-3xl rounded-full" />
					<div className="absolute top-10 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-sky-500/5 to-transparent blur-3xl rounded-full" />
				</div>

				{/* 彻底洗礼旧样式，重构为现代 shadcn 卡片与设置行规范 (14px 字号、22px 舒适行高) */}
				<style>{`
					/* 隐藏原生粗糙的 .areaTitle，改用顶层大号精致 Header */
					.shadcn-settings .areaTitle {
						display: none !important;
					}

					/* 正文字体：严格 14px，行高 22px，告别生硬粗糙与压抑感 */
					.shadcn-settings {
						font-size: 14px;
						line-height: 22px;
						color: #52525b; /* zinc-600 */
					}

					.shadcn-settings > div > div:not(.setting-area):not(.info-area) {
						font-size: 14px !important;
						line-height: 22px !important;
						color: #52525b !important;
						margin-bottom: 8px;
					}

					/* 彻底重塑 .setting-area 为现代 shadcn 白底无缝卡片，彻底消灭紫色虚线框与粗糙阴影 */
					.shadcn-settings .setting-area {
						width: 100% !important;
						max-width: 100% !important;
						margin-top: 16px;
						margin-bottom: 20px;
						box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04) !important;
						border: 1px solid #e4e4e7 !important; /* zinc-200 */
						border-radius: 12px !important;
						background: #ffffff !important;
						overflow: hidden;
					}

					/* 每一行设置项：微弱分隔线，舒适内边距，悬停微高亮 */
					.shadcn-settings .setting-area .setting-row {
						width: 100% !important;
						margin: 0 !important;
						padding: 10px 16px !important;
						height: auto !important;
						min-height: 48px;
						border: none !important;
						border-bottom: 1px solid #f4f4f5 !important; /* zinc-100 */
						box-shadow: none !important;
						border-radius: 0 !important;
						background: transparent !important;
						font-size: 14px !important;
						line-height: 22px !important;
						color: #27272a !important; /* zinc-800 */
						transition: background-color 0.15s ease;
					}

					.shadcn-settings .setting-area .setting-row:last-child {
						border-bottom: none !important;
					}

					.shadcn-settings .setting-area .setting-row:hover {
						background-color: #fafafa !important;
					}

					.shadcn-settings .smallTip {
						font-size: 12px !important;
						color: #a1a1aa !important;
						margin-top: 2px;
					}

					/* 拾色器按钮微调 */
					.shadcn-settings .color-picker {
						border-color: #e4e4e7 !important;
						border-radius: 6px !important;
						padding: 4px 8px !important;
						background: #ffffff;
					}

					.shadcn-settings .color-picker:hover {
						border-color: #a1a1aa !important;
					}

					/* 说明折叠区优化 */
					.shadcn-settings .info-area {
						border-left: solid 3px #10b981 !important;
						background: #ffffff !important;
						border: 1px solid #e4e4e7;
						border-left-width: 4px !important;
						border-radius: 10px;
						padding: 12px 16px !important;
						margin: 16px 0 !important;
						max-width: 100% !important;
					}
				`}</style>

				{/* 轻量全局 Toast 反馈 */}
				{toast && (
					<div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-zinc-900/90 text-white text-xs font-medium shadow-lg backdrop-blur-md flex items-center gap-2 pointer-events-none transition-all">
						<svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<span>{toast}</span>
					</div>
				)}

				{/* 现代化 shadcn 顶栏 Header */}
				<header className="relative z-20 flex items-center justify-between px-8 py-3.5 bg-white/85 backdrop-blur-md border-b border-zinc-200/80 sticky top-0 shadow-2xs">
					<div className="flex items-center gap-3">
						<img className="w-8 h-8 rounded-lg shadow-2xs" src="popup.png" alt="Logo" />
						<div className="flex items-center gap-2.5">
							<span className="font-mono text-lg font-extrabold tracking-tight text-zinc-900">
								Find whatever
							</span>
							<span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 tracking-wide">
								{t('设置项')}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						{/* 更新日志一键跳转 */}
						<a
							href="changelog.html"
							target="_blank"
							rel="noreferrer"
							className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium tracking-wide transition-all inline-flex items-center gap-1.5 no-underline shadow-2xs hover:shadow-xs"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
							<span>{t('更新日志')}</span>
							<span className="text-[10px] font-mono px-1 py-0.2 rounded bg-rose-500/10 text-rose-500 font-bold">
								v5.0
							</span>
						</a>

						<a
							href="https://github.com/ImSwordTooth/findwhatever"
							target="_blank"
							rel="noreferrer"
							className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors"
							title="GitHub Repository"
						>
							<svg className="w-4 h-4 cursor-pointer" viewBox="0 0 1024 1024" fill="currentColor">
								<path d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667" />
							</svg>
						</a>
					</div>
				</header>

				{/* 主工作台：左侧 shadcn 菜单 + 中间内容卡片 + 右侧常驻沙盒预览（紧密无缝三栏布局，告别虚空与挤压） */}
				<div className="relative z-10 flex flex-1 w-full max-w-[1520px] mx-auto px-6 sm:px-8 py-6 gap-6 xl:gap-8 justify-center items-start">
					{/* 左侧导航栏：采用现代化 shadcn 风格侧边栏，有温度的强调色 */}
					<aside className="w-52 shrink-0 select-none flex flex-col gap-1 sticky top-20">
						<div className="text-[13px] font-bold text-zinc-600 px-3.5 py-1.5 mb-1.5 flex items-center gap-2">
							<span>{t('设置项')}</span>
						</div>
						{MENU_ITEMS.map((item) => {
							const isActive = activeId === item.id
							return (
								<button
									key={item.id}
									type="button"
									onClick={() => setActiveId(item.id)}
									className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all cursor-pointer border ${
										isActive
											? 'bg-rose-50/80 text-rose-600 font-semibold border-rose-200/80 shadow-2xs translate-x-0.5'
											: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 border-transparent font-medium'
									}`}
								>
									<div className="flex items-center gap-2.5">
										<div className={`transition-colors inline-flex ${isActive ? 'text-rose-500' : 'text-zinc-400'}`}>
											{item.icon}
										</div>
										<span>{t(item.name)}</span>
									</div>
									{isActive && (
										<span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
									)}
								</button>
							)
						})}
					</aside>

					{/* 中间对应模块内容区：自然弹性撑满，宽度舒展充裕 */}
					<main className="flex-1 min-w-[480px] max-w-[760px] pb-20">
						<div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 sm:p-7 shadcn-settings">
							{/* 当前模块大号标题区（去除多余副标题说明与 margin-bottom） */}
							<div className="pb-4 border-b border-zinc-100 flex items-center justify-between">
								<h2 className="text-lg font-bold text-zinc-900 m-0 tracking-tight">
									{t(currentItem.name)}
								</h2>
							</div>

							{/* 当前模块表单 */}
							{renderActiveContent()}
						</div>
					</main>

					{/* 右侧常驻沙盒预览（跟中间紧密相邻，并支持点击左侧画重点联动） */}
					<FakePanel activeId={activeId} onReset={resetSetting} />
				</div>
			</div>
		</SettingContext.Provider>
	)
}
