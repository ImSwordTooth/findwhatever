import { useContext } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Radio } from '../../../components/Radio'
import { SettingCard, SettingRow } from '../../../components/SettingCard'
import { SettingContext } from '../Options'

export const DragBar = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	const { t } = useTranslation()

	return (
		<div>
			<div className="areaTitle">{t('拖拽条')}</div>

			<div className="mb-5 p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
				<p className="text-zinc-700 dark:text-zinc-200 font-medium pb-2 mb-2 border-b border-zinc-200/60 dark:border-zinc-700/40">
					{t('点击并拖拽此处可调整面板位置，会自动记忆位置。')}
				</p>
				<ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 list-disc list-inside">
					<li>{t('如果因为修改了浏览器窗口宽高导致面板位置异常（如修改窗口大小、打开控制台等），会在下一次打开时自动临时重置位置。')}</li>
					<li>{t('如果超过了设备的宽高，会在下一次打开时自动重置位置并清除记忆的位置。')}</li>
				</ul>
			</div>

			<SettingCard>
				<SettingRow label={t('可拖拽区域')} tip={t('设置通过顶部小横条还是整个浮窗面板进行拖动移动')}>
					<Radio.Group value={setting.dragArea} onChange={e  => updateSetting('dragArea', e.target.value)}>
						<Radio value={'bar'}>{t('仅拖拽条')}</Radio>
						<Radio value={'total'}>{t('整个面板')}</Radio>
					</Radio.Group>
				</SettingRow>
			</SettingCard>
		</div>
	)
}

