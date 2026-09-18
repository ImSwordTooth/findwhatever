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

			<div className="space-y-4">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 inline-flex items-center justify-center">
							<SearchSvg className="w-4 h-4" />
						</div>
					</div>
					<p className="mb-2.5">{t('鼠标移动到此处时，会展开查找记录的列表。')}</p>
					<p className="mb-2.5 flex items-center flex-wrap gap-1">
						<span>{t('点击列表项可以把文本填入输入框中。')}{t('也可以点击右侧的')}</span>
						<span className="inline-flex w-[20px] h-[20px] justify-center items-center text-xs font-mono select-none rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 text-zinc-700 dark:text-zinc-200">
							.*
						</span>
						<span>{t('，填入的同时开启正则模式。')}</span>
					</p>
					<p className="mb-2.5 text-zinc-500 italic text-xs">
						{t('历史记录会在面板关闭时更新，记入关闭时的查找词，最多记录 50 条。')}
					</p>
				</div>

				<SettingRow standalone label={t('是否显示历史记录')}>
					<Switch size="small" checked={setting.isShowHistory ?? true} onChange={e => updateSetting('isShowHistory', e)} />
				</SettingRow>
			</div>
		</div>
	)
}
