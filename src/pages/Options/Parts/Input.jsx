import React, { useContext, useEffect, useState } from 'react'
import {InputNumber, Button, Spin, message, Select} from 'antd'
import { i18n } from '../../i18n';
import { LoadingOutlined } from '@ant-design/icons';
import { SettingContext } from '../Options'

export const Input = () => {
	const { setting, updateSetting } = useContext(SettingContext)
	const [ lastValue, setLastValue ] = useState('')

	useEffect(() => {
		chrome.storage.sync.get(['searchValue']).then(res => {
			setLastValue(res.searchValue)
		})
	}, []);

	const clearLast = () => {
		chrome.storage.sync.set({ searchValue: '' }).then(() => {
			setLastValue('')
			message.success('清除成功')
		})
	}

	return (
		<div>
			<div className="areaTitle mt-[30px]">{i18n('输入框')}</div>

			<div>{i18n('本插件比较适用于简短的词语搜索，')}<strong>{i18n('不鼓励')}</strong>{i18n('跨行搜索。')}</div>
			<div>{i18n('面板打开时，输入框会自动聚焦，如果当前有选中的文本，会自动填入；如果没有选中的文本，会自动填入上一次搜索的文本。')}</div>
			<div>{i18n('支持设置防抖时长，停止输入 n 秒后才执行查找动作，可以防止输入过程无谓的内存消耗（尤其是开启了正则表达式模式时）。')}
				{
					navigator.language === 'zh' || navigator.language === 'zh-CN'
						? <>防抖触发时，输入框右侧会出现 <div className="inline-flex items-center"><Spin size="small" indicator={<LoadingOutlined style={{ fontSize: 12 }} spin />} /></div> 的标志。</>
						: <>When debouncing is triggered, a <div className="inline-flex items-center"><Spin size="small" indicator={<LoadingOutlined style={{ fontSize: 12 }} spin />} /></div> will appear on the right side of the input box</>
				}
			</div>
			<div className="newPart">
				<div className="new">new</div>
				{i18n('如果上次搜索的结果会产生bug，而新面板又自动填入了，产生了新的 bug 导致插件不可用，可以')} <Button type="dashed" disabled={!lastValue} danger onClick={clearLast}><span className="px-[8px]">{i18n('点击此处删去上一次的文本')}（{lastValue || '空'}）</span></Button> 。
				<div className="text-xs"><em>{i18n('记得把 bug 反馈给我~')}</em></div>
			</div>

			<div className="setting-area">
				<div className="setting-row">
					<div>{i18n('上一次的搜索条件保留时间（包含搜索词、筛选项）')}</div>
					<Select
						value={setting.retentionTime}
						onChange={e => updateSetting('retentionTime', e)}
						dropdownMatchSelectWidth={false}
						size="small"
						getPopupContainer={e => e.parentNode}
						options={[
							{
								label: i18n('一直保留'),
								value: -1
							},
							{
								label: i18n('一直不保留'),
								value: 0
							},
							{
								label: i18n('5分钟'),
								value: 5
							},
							{
								label: i18n('30分钟'),
								value: 30
							},
							{
								label: i18n('1小时'),
								value: 60
							},
							{
								label: i18n('5小时'),
								value: 300
							},
							{
								label: i18n('24小时'),
								value: 1440
							},
						]} />
				</div>
				<div className="setting-row">
					<div>{i18n('非正则模式防抖时长')}</div>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={0} value={setting.debounceDuration} onChange={e => updateSetting('debounceDuration', e)} />
				</div>
				<div className="setting-row">
					<div>{i18n('正则模式防抖时长')}</div>
					<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={500} value={setting.regexDebounceDuration} onChange={e => updateSetting('regexDebounceDuration', e)} />
				</div>
			</div>
		</div>
	)
}
