import React, { useContext, useEffect, useState } from 'react'
import { i18n } from '../../i18n';
import { Switch, Tag } from 'antd';
import { SettingContext } from '../Options'
import { NewPart } from '../NewPart'

export const Total = () => {
	const { setting, updateSetting } = useContext(SettingContext)
	const [ commandText, setCommandText ] = useState('')

	useEffect(() => {
		chrome.commands.getAll(res =>  {
			setCommandText(res[0].shortcut)
		})
	}, []);

	return (
		<div>
			<div className="areaTitle">{i18n('整体')}</div>

			<NewPart>
				<div>{i18n('现在打开面板的默认快捷键为 Alt+F。')}</div>
				<div>{i18n('当前快捷键为')} <Tag color="cyan">{commandText || '无'}</Tag>。</div>
				<div>{i18n('未设置快捷键会导致面板只能通过点击图标打开。')}</div>
				<div>
					{
						navigator.language === 'zh' || navigator.language === 'zh-CN'
							? <span>您可以在 <a href="chrome://extensions/shortcuts" style={{ textDecoration: 'underline' }}>chrome://extensions</a> 自定义快捷键，</span>
							: <span>You can customize shortcut keys at <a href="chrome://extensions/shortcuts" style={{ textDecoration: 'underline' }}>chrome://extensions</a>, </span>
					}
					<span>{i18n('设置 Command+F(macOS) 或者 Ctrl+F(windows等) 时会覆盖浏览器自带的查找。')}</span>
				</div>
			</NewPart>

			<div className="setting-row">
				<div>{i18n('是否使用毛玻璃效果面板')}：</div>
				<Switch size="small" checked={setting.isUseGlassEffect} onChange={e => updateSetting('isUseGlassEffect', e)} />
			</div>
		</div>
	)
}
