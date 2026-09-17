import { useContext } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Radio } from '../../../components/Radio'
import { SettingContext } from '../Options'

export const DragBar = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	const { t } = useTranslation()

	return (
		<div>
			<div className="areaTitle">{t('拖拽条')}</div>

			<div>
				<p className="mb-2.5">{t('点击并拖拽此处可调整面板位置，会自动记忆位置。')}</p>
				<p className="mb-2.5">{t('如果因为修改了浏览器窗口宽高导致面板位置异常（如修改窗口大小、打开控制台等），会在下一次打开时自动临时重置位置。')}</p>
				<p className="mb-2.5">{t('如果超过了设备的宽高，会在下一次打开时自动重置位置并清除记忆的位置。')}</p>
			</div>

			<div className="setting-area">
				<div className="setting-row">
					<div>{t('可拖拽区域')}：</div>
					<Radio.Group value={setting.dragArea} onChange={e  => updateSetting('dragArea', e.target.value)}>
						<Radio value={'bar'}>{t('仅拖拽条')}</Radio>
						<Radio value={'total'}>{t('整个面板')}</Radio>
					</Radio.Group>
				</div>
			</div>
		</div>
	)
}
