import { useContext, useEffect, useState } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Popover } from '../../../components/Popover'
import { Select } from '../../../components/Select'
import { Radio } from '../../../components/Radio'
import { Switch } from '../../../components/Switch'
import { SettingCard, SettingRow, ColorPickerButton } from '../../../components/SettingCard'
import { SettingContext } from '../Options'
import DownSvg from '../../../assets/svg/down.svg'
import { SketchPicker } from 'react-color'

export const Total = () => {
	const { setting, updateSetting } = useContext(SettingContext)
	const [ commandText, setCommandText ] = useState('')
	const [ isShowPreview, setIsShowPreview ] = useState(false)
	const [ activeIndex, setActiveIndex ] = useState(0)

	const { t } = useTranslation()

	useEffect(() => {
		chrome.commands.getAll(res =>  {
			setCommandText(res[0].shortcut)
		})
	}, []);

	const updateColor = (propName, colorObj) => {
		const colorText = colorObj.hex
		if (propName === 'primaryColor') {
			updateSetting({
				colorMode: 'light',
				primaryColor: colorText
			})
		} else{
			updateSetting({
				colorMode: 'dark',
				primaryColor_dark: colorText
			})
		}
	}

	const openShortcutsPage = (e) => {
		e?.preventDefault?.()
		if (chrome?.tabs?.create) {
			chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })
		} else {
			window.open('chrome://extensions/shortcuts', '_blank')
		}
	}

	return (
		<div>
			<div className="areaTitle">{t('整体')}</div>

			<div className="mb-5 p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
				<div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 mb-2.5 border-b border-zinc-200/60 dark:border-zinc-700/40">
					<div className="flex items-center flex-wrap gap-2">
						<span className="text-zinc-600 dark:text-zinc-300 font-medium">{t('当前快捷键为')}</span>
						<kbd className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 text-xs font-mono font-semibold shadow-2xs">
							{commandText || t('无')}
						</kbd>
						<span className="text-xs text-zinc-400 dark:text-zinc-500">
							({t('现在打开面板的默认快捷键为')} <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px]">Alt+F</kbd>)
						</span>
					</div>
					<div className="flex items-center gap-1">
						<span className="text-xs text-zinc-500 dark:text-zinc-400">{t('您可以在这里自定义快捷键：')}</span>
						<a
							href="chrome://extensions/shortcuts"
							target="_blank"
							rel="noreferrer"
							onClick={openShortcutsPage}
							className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-mono underline underline-offset-2 transition-colors cursor-pointer"
						>
							chrome://extensions/shortcuts
						</a>
					</div>
				</div>
				<ul className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400 list-disc list-inside">
					<li>{t('设置 Command+F(macOS) 或者 Ctrl+F(windows等) 时会覆盖浏览器自带的查找。')}</li>
					<li>{t('未设置快捷键会导致面板只能通过点击图标打开。')}</li>
				</ul>
			</div>
			<SettingCard>
				<SettingRow label={t('语言')}>
					<Select
						value={setting.language}
						onChange={e => updateSetting('language', e)}
						dropdownMatchSelectWidth={false}
						size="small"
						getPopupContainer={e => e.parentNode}
						options={[
							{
								label: 'auto',
								value: 'auto'
							},
							{
								label: '中文',
								value: 'Chinese'
							},
							{
								label: 'English',
								value: 'English'
							},
							{
								label: '한국어',
								value: 'Korean'
							},
							{
								label: '日本語',
								value: 'Japanese'
							},
							{
								label: 'العربية',
								value: 'Arabic'
							},
							{
								label: 'Português',
								value: 'Portuguese'
							},
							{
								label: 'Français',
								value: 'French'
							},
							{
								label: 'Deutsch',
								value: 'German'
							},
							{
								label: 'Русские',
								value: 'Russian'
							},
							{
								label: 'Español',
								value: 'Spanish'
							},
						]} />
				</SettingRow>
				<SettingRow label={t('颜色模式')}>
					<Radio.Group value={setting.colorMode} onChange={e  => updateSetting('colorMode', e.target.value)}>
						<Radio value={'auto'}>{t('跟随系统')}</Radio>
						<Radio value={'light'}>{t('浅色')}</Radio>
						<Radio value={'dark'}>{t('深色')}</Radio>
					</Radio.Group>
				</SettingRow>
				<SettingRow label={t('主题色')} tip={t('强烈建议尝试预设色')}>
					<Popover
						trigger={['click']}
						placement="rightTop"
						content={
							<SketchPicker
								disableAlpha={true}
								color={setting.primaryColor}
								onChange={e => updateColor('primaryColor', e)}
								onChangeComplete={e => updateColor('primaryColor', e)}
								presetColors={['#1677ff', '#ff8096', '#8d48fb', '#20a7a5', '#20a722', '#a2dd02', '#ef1f1f']}
							/>
						}
					>
						<ColorPickerButton color={setting.primaryColor} />
					</Popover>
				</SettingRow>
				<SettingRow label={t('深色模式下的主题色')} tip={t('强烈建议尝试预设色')}>
					<Popover
						trigger={['click']}
						placement="rightTop"
						content={
							<SketchPicker
								disableAlpha={true}
								color={setting.primaryColor_dark}
								onChange={e => updateColor('primaryColor_dark', e)}
								onChangeComplete={e => updateColor('primaryColor_dark', e)}
								presetColors={['#44d62c', '#fb7213', '#de8e8e', '#ffffff', '#0fffa0', '#ffd906' ]}
							/>
						}
					>
						<ColorPickerButton color={setting.primaryColor_dark} />
					</Popover>
				</SettingRow>
				<SettingRow label={t('是否显示按钮提示气泡')} tip={t('鼠标悬停在浮窗各按钮上时展示快捷键与功能说明')}>
					<Switch size="small" checked={setting.isShowTooltip ?? true} onChange={e => updateSetting('isShowTooltip', e)} />
				</SettingRow>
			</SettingCard>

			<div className="mt-6 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/40 overflow-hidden shadow-2xs">
				<div
					className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
					onClick={() => setIsShowPreview(!isShowPreview)}
				>
					<div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
						<span className="w-2 h-2 rounded-full bg-rose-500" />
						<span>{t('点击此处来展开颜色模式的说明和预览')}</span>
					</div>
					<DownSvg
						style={{
							width: '18px',
							height: '18px',
							transition: 'transform .3s ease',
							transform: `rotate(${isShowPreview ? 180 : 0}deg)`,
							opacity: 0.6
						}}
					/>
				</div>
				{
					isShowPreview &&
					<div className="p-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
						<div className="previewWp flex flex-col sm:flex-row gap-4 mt-2">
							<ul className="case flex sm:flex-col shrink-0 gap-1.5 list-none p-0 m-0">
								{[
									{ id: 0, text: t('浅色模式-浅色页面') },
									{ id: 1, text: t('浅色模式-深色页面') },
									{ id: 2, text: t('深色模式-浅色页面') },
									{ id: 3, text: t('深色模式-深色页面') }
								].map((item) => (
									<li
										key={item.id}
										className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 flex items-center select-none ${
											activeIndex === item.id
												? 'active bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-semibold shadow-2xs'
												: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
										}`}
										onClick={() => setActiveIndex(item.id)}
										onMouseEnter={() => setActiveIndex(item.id)}
									>
										{item.text}
									</li>
								))}
							</ul>
							<div className="preview flex-1 min-w-0">
								<img
									className={`${activeIndex === 0 ? 'block' : 'hidden'} w-full max-w-full rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-xs cursor-zoom-in`}
									onClick={() => window.open('https://i0.letvimg.com/lc21_lemf/202601/29/10/43/image2.png')}
									src="https://i0.letvimg.com/lc21_lemf/202601/29/10/43/image2.png"
									alt={t('浅色模式-浅色页面')}
								/>
								<img
									className={`${activeIndex === 1 ? 'block' : 'hidden'} w-full max-w-full rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-xs cursor-zoom-in`}
									onClick={() => window.open('https://i0.letvimg.com/lc21_lemf/202601/29/10/42/image1.png')}
									src="https://i0.letvimg.com/lc21_lemf/202601/29/10/42/image1.png"
									alt={t('浅色模式-深色页面')}
								/>
								<img
									className={`${activeIndex === 2 ? 'block' : 'hidden'} w-full max-w-full rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-xs cursor-zoom-in`}
									onClick={() => window.open('https://i3.letvimg.com/lc20_lemf/202601/29/10/45/image6.png')}
									src="https://i3.letvimg.com/lc20_lemf/202601/29/10/45/image6.png"
									alt={t('深色模式-浅色页面')}
								/>
								<img
									className={`${activeIndex === 3 ? 'block' : 'hidden'} w-full max-w-full rounded-xl border border-zinc-200 dark:border-zinc-700/80 shadow-xs cursor-zoom-in`}
									onClick={() => window.open('https://i2.letvimg.com/lc21_lemf/202601/29/10/44/image5.png')}
									src="https://i2.letvimg.com/lc21_lemf/202601/29/10/44/image5.png"
									alt={t('深色模式-深色页面')}
								/>
							</div>
						</div>
					</div>
				}
			</div>

			<p className="mt-8 text-xs text-zinc-400 dark:text-zinc-500 italic">
				{t('我不是专业的UI设计师，所以颜色搭配做的很不自信。如果你有更好的想法，欢迎帮助我做出更美观的界面。')} 🤝
			</p>
		</div>
	)
}
