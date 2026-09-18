import { useContext } from 'preact/compat'
import { Switch } from '../../../components/Switch'
import { SettingRow } from '../../../components/SettingCard'
import { SettingContext } from '../Options'
import { useTranslation } from 'react-i18next'
import SearchSvg from '../../../assets/svg/search.svg'

export const History = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	const { t } = useTranslation()

	return (
		<div>
			<div className="areaTitle">{t('历史记录')}</div>

			<div className="space-y-4 mb-6">
				{/* 1. 唤起与交互方式 */}
				<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs space-y-2">
					<div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-100">
						<span className="w-5 h-5 rounded flex items-center justify-center bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-600 dark:text-zinc-200">
							<SearchSvg className="w-3.5 h-3.5 fill-current" />
						</span>
						<span>{t('唤起与交互方式')}</span>
					</div>
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
						{t('在输入框内按键盘 ↓ 键，或点击左侧搜索图标，可在下方展开最近搜索列表。支持键盘 ↑ / ↓ 快速选词并回车确认，键入新内容时自动收起。')}
					</p>
				</div>

				{/* 2. 选词填入与快捷正则 */}
				<div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs flex items-center flex-wrap gap-1.5 text-zinc-600 dark:text-zinc-300 leading-relaxed">
					<span>{t('点击历史条目可直接填入输入框；点击右侧的')}</span>
					<span className="inline-flex w-5 h-5 justify-center items-center text-xs font-mono select-none rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 shadow-2xs">
						.*
					</span>
					<span>{t('，会在填入的同时开启正则模式。')}</span>
				</div>

				{/* 3. 存储机制与清理 */}
				<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
					<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
						{t('搜索面板关闭时会自动保存当前的有效搜索词，最多保留 50 条（空文本不作记录）。列表顶部支持一键清空全部历史。')}
					</p>
				</div>
			</div>

			<SettingRow
				standalone
				label={t('启用历史记录')}
				tip={t('关闭后将不再保存搜索词，浮窗中也将隐藏历史建议列表')}
			>
				<Switch size="small" checked={setting.isShowHistory ?? true} onChange={e => updateSetting('isShowHistory', e)} />
			</SettingRow>
		</div>
	)
}
