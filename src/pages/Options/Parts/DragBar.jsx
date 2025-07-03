import React, {useContext} from 'react'
import {i18n} from '../../i18n';
import {Radio} from 'antd';
import { SettingContext } from '../Options'

export const DragBar = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	return (
		<div>
			<div className="areaTitle">{i18n('拖拽条')}</div>

			<div>
				<div>{i18n('点击并拖拽此处可调整面板位置，会自动记忆位置。')}</div>
				<div>{i18n('如果因为修改了浏览器窗口宽高导致面板位置异常（如修改窗口大小、打开控制台等），会在下一次打开时自动临时重置位置。')}</div>
				<div>{i18n('如果超过了设备的宽高，会在下一次打开时自动重置位置并清除记忆的位置。')}</div>
			</div>

			<div className="setting-row">
				<div>{i18n('可拖拽区域')}：</div>
				<Radio.Group value={setting.dragArea} onChange={e  => updateSetting('dragArea', e.target.value)}>
					<Radio value={'bar'}>{i18n('仅拖拽条')}</Radio>
					<Radio value={'total'}>{i18n('整个面板')}</Radio>
				</Radio.Group>
			</div>
		</div>
	)
}
