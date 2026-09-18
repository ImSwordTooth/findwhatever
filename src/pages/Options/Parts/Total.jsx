import { useContext, useEffect, useState } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Popover } from '../../../components/Popover'
import { Select } from '../../../components/Select'
import { Radio } from '../../../components/Radio'
import { Switch } from '../../../components/Switch'
import { SettingCard, SettingRow, ColorPickerButton } from '../../../components/SettingCard'
import { SettingContext } from '../Options'
import TipsSvg from '../../../assets/svg/tips.svg'
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

	return (
		<div>
			<div className="areaTitle">{t('整体')}</div>

			<div className="space-y-2 mb-4">
				<p className="mb-2.5">
					{t('现在打开面板的默认快捷键为')} <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[11px] shadow-xs">Alt+F</kbd>。
				</p>
				<p className="mb-2.5 flex items-center flex-wrap gap-1.5">
					<span>{t('当前快捷键为')}</span>
					<kbd className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/40 text-xs font-mono font-medium shadow-2xs">
						{commandText || t('无')}
					</kbd>
					<span>。</span>
				</p>
				<p className="mb-2.5 text-zinc-500">{t('未设置快捷键会导致面板只能通过点击图标打开。')}</p>
				<p className="mb-2.5">
					{t('您可以在这里自定义快捷键：')}
					<a
						href="chrome://extensions/shortcuts"
						target="_blank"
						rel="noreferrer"
						className="text-rose-500 hover:text-rose-600 underline underline-offset-2 mx-1 font-mono text-xs transition-colors"
					>
						chrome://extensions/shortcuts
					</a>
				</p>
				<p className="mb-2.5 text-zinc-500">
					{t('设置 Command+F(macOS) 或者 Ctrl+F(windows等) 时会覆盖浏览器自带的查找。')}
				</p>
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
				<SettingRow label={t('是否显示按钮提示气泡')}>
					<Switch size="small" checked={setting.isShowTooltip ?? true} onChange={e => updateSetting('isShowTooltip', e)} />
				</SettingRow>
			</SettingCard>

			<div className="info-area">
				<div className="title" onClick={() => setIsShowPreview(!isShowPreview)}>{t('点击此处来展开颜色模式的说明和预览')}<DownSvg style={{ width: '20px', height: '20px', marginLeft: '8px', transition: 'transform .3s ease', transform: `rotate(${isShowPreview ? 180 : 0}deg)` }} /></div>
				{
					isShowPreview &&
					<div className="content">
						<div className="previewWp">
							<ul className="case">
								<li className={activeIndex === 0 ? 'active' : ''} onMouseEnter={() => setActiveIndex(0)}>{t('浅色模式-浅色页面')}</li>
								<li className={activeIndex === 1 ? 'active' : ''} onMouseEnter={() => setActiveIndex(1)}>{t('浅色模式-深色页面')}</li>
								<li className={activeIndex === 2 ? 'active' : ''} onMouseEnter={() => setActiveIndex(2)}>{t('深色模式-浅色页面')}</li>
								<li className={activeIndex === 3 ? 'active' : ''} onMouseEnter={() => setActiveIndex(3)}>{t('深色模式-深色页面')}</li>
							</ul>
							<div className="preview">
								<img className={activeIndex === 0 ? 'block' : 'hidden'} onClick={() => window.open('https://i0.letvimg.com/lc21_lemf/202601/29/10/43/image2.png')} src="https://i0.letvimg.com/lc21_lemf/202601/29/10/43/image2.png" />
								<img className={activeIndex === 1 ? 'block' : 'hidden'} onClick={() => window.open('https://i0.letvimg.com/lc21_lemf/202601/29/10/42/image1.png')} src="https://i0.letvimg.com/lc21_lemf/202601/29/10/42/image1.png" />
								<img className={activeIndex === 2 ? 'block' : 'hidden'} onClick={() => window.open('https://i3.letvimg.com/lc20_lemf/202601/29/10/45/image6.png')} src="https://i3.letvimg.com/lc20_lemf/202601/29/10/45/image6.png" />
								<img className={activeIndex === 3 ? 'block' : 'hidden'} onClick={() => window.open('https://i2.letvimg.com/lc21_lemf/202601/29/10/44/image5.png')} src="https://i2.letvimg.com/lc21_lemf/202601/29/10/44/image5.png" />
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
