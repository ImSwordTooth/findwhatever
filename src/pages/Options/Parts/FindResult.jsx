import { useContext } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Popover } from '../../../components/Popover'
import { Switch } from '../../../components/Switch'
import { Select } from '../../../components/Select'
import { Slider } from '../../../components/Slider'
import { SettingCard, SettingRow, ColorPickerButton } from '../../../components/SettingCard'
import { SettingContext } from '../Options'
import { SketchPicker } from 'react-color'
import CopySvg from '../../../assets/svg/copy.svg'

export const FindResult = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	const { t } = useTranslation()

	const colorFormat = (colorObj) => {
		if (colorObj.rgb.a !== 1) {
			return `rgba(${colorObj.rgb.r}, ${colorObj.rgb.g}, ${colorObj.rgb.b}, ${colorObj.rgb.a})`
		} else {
			return colorObj.hex
		}
	}

	return (
		<div>
			<div className="areaTitle">{t('查找结果')}</div>

			<div className="space-y-5">
				{/* 1. 基础功能说明 */}
				<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
					<p className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-xs">
						{t('浮窗中会显示匹配序号与总数（如 1/42）。点击“查找结果”文字或图标，可以把搜到的所有内容直接复制到剪贴板。')}
					</p>
				</div>

				{/* 2. 跨标签搜索机制 */}
				<div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-1.5">
					<div className="font-medium text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
						<span>{t('关于跨标签搜索')}</span>
					</div>
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
						{t('网页中的文字常被 a、span、strong 等标签切开，导致浏览器自带的查找搜不全。插件采用纯内存文本投影的方式来计算和还原位置，尽量在不改动网页原有结构的前提下完成连续匹配。')}
					</p>
					<p className="text-zinc-400 dark:text-zinc-500 leading-relaxed">
						{t('各网站的 DOM 结构千奇百怪，如果遇到查不准或高亮错位的情况，欢迎联系我反馈页面地址。')} 🤝
					</p>
				</div>

				{/* 3. 文本开关设置 */}
				<SettingCard>
					<SettingRow
						label={t('显示“查找结果”文本')}
						tip={t('关闭后只显示简短数字（如 1/42），节省浮窗空间；开启时点击该文字可复制所有结果')}
					>
						<Switch size="small" checked={setting.isShowResultText} onChange={e => updateSetting('isShowResultText', e)} />
					</SettingRow>
				</SettingCard>

				{/* 4. 普通匹配态 search-results */}
				<SettingCard title={t('普通匹配项样式 (search-results)')}>
					<SettingRow label={t('背景色')}>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.bgColor} onChange={e => updateSetting('bgColor', colorFormat(e))} />}>
							<ColorPickerButton color={setting.bgColor} />
						</Popover>
					</SettingRow>
					<SettingRow label={t('字体颜色')}>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.textColor} onChange={ e => updateSetting('textColor', colorFormat(e))} />}>
							<ColorPickerButton color={setting.textColor} />
						</Popover>
					</SettingRow>
					<SettingRow label={t('是否启用下划线')}>
						<Switch size="small" checked={setting.isOpenUnderline} onChange={ e => updateSetting('isOpenUnderline', e) } />
					</SettingRow>
					{
						setting.isOpenUnderline &&
						<>
							<SettingRow label={t('下划线间距')}>
								<div className="flex items-center gap-2.5">
									<Slider style={{ width: '120px', margin: 0 }} min={0} max={10} value={setting.underlineOffset} onChange={e => updateSetting('underlineOffset', e)} />
									<span className="px-1.5 py-0.5 rounded-md bg-zinc-50/80 dark:bg-zinc-800/80 border border-solid border-zinc-200/60 dark:border-zinc-700/60 font-mono text-xs text-zinc-500 min-w-[36px] text-center shadow-2xs">
										{setting.underlineOffset}px
									</span>
								</div>
							</SettingRow>
							<SettingRow label={t('下划线线条高度')}>
								<div className="flex items-center gap-2.5">
									<Slider style={{ width: '120px', margin: 0 }} min={1} max={10} value={setting.underlineThickness} onChange={e => updateSetting('underlineThickness', e)} />
									<span className="px-1.5 py-0.5 rounded-md bg-zinc-50/80 dark:bg-zinc-800/80 border border-solid border-zinc-200/60 dark:border-zinc-700/60 font-mono text-xs text-zinc-500 min-w-[36px] text-center shadow-2xs">
										{setting.underlineThickness}px
									</span>
								</div>
							</SettingRow>
							<SettingRow label={t('下划线样式')}>
								<Select
									value={setting.underlineStyle}
									onChange={e => updateSetting('underlineStyle', e)}
									size="small"
									getPopupContainer={e => e.parentNode}
									dropdownMatchSelectWidth={false}
									options={[
										{ label: 'solid', value: 'solid' },
										{ label: 'double', value: 'double' },
										{ label: 'dotted', value: 'dotted' },
										{ label: 'dashed', value: 'dashed' },
										{ label: 'wavy', value: 'wavy' },
									]} />
							</SettingRow>
							<SettingRow label={t('下划线颜色')}>
								<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.underlineColor} onChange={ e => updateSetting('underlineColor', colorFormat(e))} />}>
									<ColorPickerButton color={setting.underlineColor} />
								</Popover>
							</SettingRow>
						</>
					}
				</SettingCard>

				{/* 5. 激活定位态 search-results-active */}
				<SettingCard title={t('当前聚焦项样式 (search-results-active)')}>
					<SettingRow label={t('背景色')}>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.bgColorActive} onChange={e => updateSetting('bgColorActive', colorFormat(e))} />}>
							<ColorPickerButton color={setting.bgColorActive} />
						</Popover>
					</SettingRow>
					<SettingRow label={t('字体颜色')}>
						<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.textColorActive} onChange={ e => updateSetting('textColorActive', colorFormat(e))} />}>
							<ColorPickerButton color={setting.textColorActive} />
						</Popover>
					</SettingRow>
					<SettingRow label={t('下划线是否和 search-results 一致')}>
						<Switch size="small" checked={setting.isSame} onChange={ e => updateSetting('isSame', e) } />
					</SettingRow>

					{
						!setting.isSame &&
						<>
							<SettingRow label={t('是否启用下划线')}>
								<Switch size="small" checked={setting.isOpenUnderlineActive} onChange={ e => updateSetting('isOpenUnderlineActive', e) } />
							</SettingRow>
							{
								setting.isOpenUnderlineActive &&
								<>
									<SettingRow label={t('下划线间距')}>
										<div className="flex items-center gap-2.5">
											<Slider style={{ width: '120px', margin: 0 }} min={0} max={10} value={setting.underlineOffsetActive} onChange={e => updateSetting('underlineOffsetActive', e)} />
											<span className="px-1.5 py-0.5 rounded-md bg-zinc-50/80 dark:bg-zinc-800/80 border border-solid border-zinc-200/60 dark:border-zinc-700/60 font-mono text-xs text-zinc-500 min-w-[36px] text-center shadow-2xs">
												{setting.underlineOffsetActive}px
											</span>
										</div>
									</SettingRow>
									<SettingRow label={t('下划线线条高度')}>
										<div className="flex items-center gap-2.5">
											<Slider style={{ width: '120px', margin: 0 }} min={1} max={10} value={setting.underlineThicknessActive} onChange={e => updateSetting('underlineThicknessActive', e)} />
											<span className="px-1.5 py-0.5 rounded-md bg-zinc-50/80 dark:bg-zinc-800/80 border border-solid border-zinc-200/60 dark:border-zinc-700/60 font-mono text-xs text-zinc-500 min-w-[36px] text-center shadow-2xs">
												{setting.underlineThicknessActive}px
											</span>
										</div>
									</SettingRow>
									<SettingRow label={t('下划线样式')}>
										<Select
											value={setting.underlineStyleActive}
											onChange={e => updateSetting('underlineStyleActive', e)}
											size="small"
											getPopupContainer={e => e.parentNode}
											dropdownMatchSelectWidth={false}
											options={[
												{ label: 'solid', value: 'solid' },
												{ label: 'double', value: 'double' },
												{ label: 'dotted', value: 'dotted' },
												{ label: 'dashed', value: 'dashed' },
												{ label: 'wavy', value: 'wavy' },
											]} />
									</SettingRow>
									<SettingRow label={t('下划线颜色')}>
										<Popover trigger={['click']} placement="rightTop" content={<SketchPicker color={setting.underlineColorActive} onChange={ e => updateSetting('underlineColorActive', colorFormat(e))} />}>
											<ColorPickerButton color={setting.underlineColorActive} />
										</Popover>
									</SettingRow>
								</>
							}
						</>
					}
				</SettingCard>
			</div>
		</div>
	)
}
