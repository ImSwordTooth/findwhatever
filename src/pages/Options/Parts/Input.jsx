import { useContext, useEffect, useState } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Select } from '../../../components/Select'
import { Switch } from '../../../components/Switch'
import { InputNumber } from '../../../components/InputNumber'
import { SettingContext } from '../Options'

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

			<div className="space-y-3 mb-6">
				<p className="mb-2.5">
					{t('本插件比较适用于简短的词语搜索，')}<strong>{t('不鼓励')}</strong>{t('跨行搜索。')}
				</p>
				<p className="mb-2.5">
					{t('面板打开时，输入框会自动聚焦，如果当前有选中的文本，会自动填入；如果没有选中的文本，会自动填入上一次搜索的文本。')}
				</p>
				<p className="mb-2.5">
					{t('支持设置防抖时长，停止输入 n 秒后才执行查找动作，可以防止输入过程无谓的内存消耗（尤其是开启了正则表达式模式时）。')}
				</p>
				<p className="mb-2.5 flex items-center flex-wrap gap-1.5">
					<span>{t('防抖触发时，输入框右侧会出现这样的标志：')}</span>
					<span className="inline-flex items-center justify-center w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
						<svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<circle cx="12" cy="12" r="10" strokeWidth="3" strokeDasharray="32" strokeLinecap="round" />
						</svg>
					</span>
				</p>
				<div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/40 p-3 border border-zinc-200/60 dark:border-zinc-700/60 text-xs">
					<div className="flex items-center justify-between gap-3 flex-wrap">
						<div className="space-y-1">
							<div className="text-zinc-700 dark:text-zinc-200">
								{t('若上次搜索词异常导致面板打不开，可在此重置：')}
							</div>
							<div className="flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
								<span>{t('当前记忆文本')}：</span>
								<code className="px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60 font-mono text-zinc-600 dark:text-zinc-300">
									{lastValue ? `"${lastValue}"` : t('无')}
								</code>
								<span className="italic ml-2">{t('（记得把 bug 反馈给我~）')}</span>
							</div>
						</div>
						<button
							type="button"
							disabled={!lastValue}
							onClick={clearLast}
							className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
								!lastValue
									? 'bg-zinc-200/50 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed'
									: 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-400 cursor-pointer active:scale-95 shadow-2xs'
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

			<div className="setting-area">
				<div className="setting-row">
					<div>{t('文本框宽度')}</div>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="px" min={340} value={setting.textWidth} onChange={e => updateSetting('textWidth', e)} />
				</div>
				<div className="setting-row">
					<div>{t('上一次的搜索条件保留时间（包含搜索词、筛选项）')}</div>
					<Select
						value={setting.retentionTime}
						onChange={e => updateSetting('retentionTime', e)}
						dropdownMatchSelectWidth={false}
						size="small"
						getPopupContainer={e => e.parentNode}
						options={[
							{
								label: t('一直保留'),
								value: -1
							},
							{
								label: t('一直不保留'),
								value: 0
							},
							{
								label: t('5分钟'),
								value: 5
							},
							{
								label: t('30分钟'),
								value: 30
							},
							{
								label: t('1小时'),
								value: 60
							},
							{
								label: t('5小时'),
								value: 300
							},
							{
								label: t('24小时'),
								value: 1440
							},
						]} />
				</div>
				<div className="setting-row">
					<div>{t('非正则模式防抖时长')}</div>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={0} value={setting.debounceDuration} onChange={e => updateSetting('debounceDuration', e)} />
				</div>
				<div className="setting-row">
					<div>{t('正则模式防抖时长')}</div>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={500} value={setting.regexDebounceDuration} onChange={e => updateSetting('regexDebounceDuration', e)} />
				</div>
				<div className="setting-row">
					<div>{t('是否显示文本框光圈')}</div>
					<Switch size="small" checked={setting.isShowRing} onChange={e => updateSetting('isShowRing', e)} />
				</div>
			</div>
		</div>
	)
}
