import { useContext, useEffect, useState } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Select } from '../../../components/Select'
import { Switch } from '../../../components/Switch'
import { InputNumber } from '../../../components/InputNumber'
import { SettingCard, SettingRow } from '../../../components/SettingCard'
import { SettingContext } from '../Options'
import LoadingSvg from '../../../assets/svg/loading.svg'

export const Input = () => {
	const { setting, updateSetting } = useContext(SettingContext)
	const [ lastValue, setLastValue ] = useState('')
	const [ clearToast, setClearToast ] = useState('')

	const { t } = useTranslation()

	useEffect(() => {
		chrome.storage.local.get(['searchValue']).then(res => {
			setLastValue(res.searchValue)
		})
	}, []);

	const clearLast = () => {
		chrome.storage.local.set({ searchValue: '' }).then(() => {
			setLastValue('')
			setClearToast(t('清除成功'))
			setTimeout(() => setClearToast(''), 2000)
		})
	}

	return (
		<div>
			<div className="areaTitle">{t('输入框')}</div>

			<div className="space-y-4 mb-6">
				{/* 1. 焦点与填词逻辑 */}
				<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
					<p className="text-zinc-700 dark:text-zinc-200 leading-relaxed text-xs">
						{t('唤起面板时输入框会自动聚焦。若页面已有选中文本会自动填入；若无选中文本，则按下方保留时长恢复上次搜索内容。')}
					</p>
				</div>

				{/* 2. 防抖机制与旋转指示器（1:1 还原面板实际样式） */}
				<div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-2">
					<div className="flex items-center gap-1.5 font-medium text-zinc-800 dark:text-zinc-100">
						<span>{t('防抖检索与等待提示')}</span>
					</div>
					<div className="text-zinc-600 dark:text-zinc-300 leading-relaxed flex items-center flex-wrap gap-1.5">
						<span>
							{t('停止输入后才会执行页面检索，避免连续输入或编写正则时频繁遍历 DOM 产生卡顿。等待防抖期间，输入框右侧会展示旋转指示器：')}
							<LoadingSvg className="animate-spin w-3 h-3" />
						</span>
					</div>
				</div>

				{/* 3. 跨标签与换行文本检索说明 */}
				<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
						{t('得益于纯内存文本投影机制，插件已支持跨标签与换行文本的连续检索。由于不同网页的块级容器与换行排版差异较大，若在多行复杂检索时遇到定位偏差，欢迎反馈具体页面以便跟进优化。')}
					</p>
				</div>

				{/* 4. 异常搜索词排障重置卡片 */}
				<div className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 text-xs">
					<div className="flex items-center justify-between gap-3 flex-wrap">
						<div className="space-y-1">
							<div className="text-zinc-800 dark:text-zinc-200 font-medium">
								{t('若因特殊字符或复杂正则导致面板打不开，可在此查看记忆文本并一键重置：')}
							</div>
							<div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
								<span>{t('当前记忆文本')}：</span>
								<code className="px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 font-mono text-zinc-700 dark:text-zinc-300 max-w-[280px] truncate inline-block align-middle">
									{lastValue ? `"${lastValue}"` : t('无')}
								</code>
								<span className="text-zinc-400 dark:text-zinc-500 ml-1">
									（{t('如遇异常崩溃，欢迎随时向我反馈')}）
								</span>
							</div>
						</div>
						<button
							type="button"
							disabled={!lastValue}
							onClick={clearLast}
							className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
								!lastValue
									? 'bg-zinc-200/50 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed'
									: 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer active:scale-95'
							}`}
						>
							<svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
								<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
							</svg>
							<span>{clearToast ? clearToast : t('清除上次文本')}</span>
						</button>
					</div>
				</div>
			</div>

			<SettingCard>
				<SettingRow
					label={t('文本框宽度')}
					tip={t('搜索输入框的宽度')}
				>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="px" min={380} value={setting.textWidth} onChange={e => updateSetting('textWidth', e)} />
				</SettingRow>

				<SettingRow
					label={t('搜索条件保留时长')}
					tip={t('包含搜索词与各筛选项状态。超时后重新唤起面板将恢复初始空状态')}
				>
					<Select
						value={setting.retentionTime}
						onChange={e => updateSetting('retentionTime', e)}
						dropdownMatchSelectWidth={false}
						size="small"
						getPopupContainer={e => e.parentNode}
						options={[
							{ label: t('一直保留'), value: -1 },
							{ label: t('一直不保留'), value: 0 },
							{ label: t('5分钟'), value: 5 },
							{ label: t('30分钟'), value: 30 },
							{ label: t('1小时'), value: 60 },
							{ label: t('5小时'), value: 300 },
							{ label: t('24小时'), value: 1440 },
						]}
					/>
				</SettingRow>

				<SettingRow
					label={t('非正则模式防抖时长')}
					tip={t('停止输入后执行普通文本搜索的等待时间（毫秒）')}
				>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={0} value={setting.debounceDuration} onChange={e => updateSetting('debounceDuration', e)} />
				</SettingRow>

				<SettingRow
					label={t('正则模式防抖时长')}
					tip={t('正则匹配相对更消耗性能，建议保留适当等待（最小 500ms），避免打字中连续运算卡顿')}
				>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={500} value={setting.regexDebounceDuration} onChange={e => updateSetting('regexDebounceDuration', e)} />
				</SettingRow>

				<SettingRow
					label={t('输入框聚焦外光圈')}
					tip={t('输入框处于聚焦状态时，外层是否显示柔和呼吸光圈')}
				>
					<Switch size="small" checked={setting.isShowRing} onChange={e => updateSetting('isShowRing', e)} />
				</SettingRow>
			</SettingCard>
		</div>
	)
}
