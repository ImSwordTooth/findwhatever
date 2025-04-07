import React, {useEffect, useRef, useState} from 'react'
import {Checkbox, Popover, Slider, Select, Button, message, Popconfirm, InputNumber} from 'antd'
import { SketchPicker } from 'react-color'
import { i18n } from '../../i18n'

export const Feature = () => {
	const [ debounceDuration, setDebounceDuration ] = useState(200)
	const [ regexDebounceDuration, setRegexDebounceDuration ] = useState(1000)

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		const res = await chrome.storage.sync.get('featureObject')

		if (Object.keys(res).length === 0) {
			return
		}
		setDebounceDuration(res.featureObject.debounceDuration)
		setRegexDebounceDuration(res.featureObject.regexDebounceDuration)
	}

	const reset = () => {
		setDebounceDuration(200)
		setRegexDebounceDuration(1000)
		chrome.storage.sync.remove('featureObject')
		message.success(i18n('重置成功'))
	}

	const save = () => {
		chrome.storage.sync.set({
			featureObject: {
				debounceDuration,
				regexDebounceDuration
			},
		}, () => {
			message.success('保存成功')
		})
	}

	return (
		<div className="flex select-none">
			<div className="flex-1">
				<h1 className="flex items-center">
					{i18n('功能')}
				</h1>
				<div className="w-[450px]">
					<div className="rounded-xl overflow-hidden">
						<div className="setting-row">
							<div>{i18n('非正则模式防抖时长')}</div>
							<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={0} value={debounceDuration} onChange={setDebounceDuration} />
						</div>
						<div className="setting-row">
							<div>{i18n('正则模式防抖时长')}</div>
							<InputNumber size="small" style={{ width: '140px' }} addonAfter="ms" min={0} value={regexDebounceDuration} onChange={setRegexDebounceDuration} />
						</div>
					</div>
				</div>

				<div className="flex items-center w-[400px] mt-[40px]">
					<Popconfirm
						title={i18n('确定重置吗？')}
						onConfirm={reset}
						okText={i18n('确定')}
						cancelText={i18n('取消')}
						okButtonProps={{ style: { width: '45px' } }}
						cancelButtonProps={{ style: { width: '45px' } }}
					>
						<Button className="w-[120px] mr-[12px]">{i18n('重置本页')}</Button>
					</Popconfirm>
					<Button className="flex-1" type="primary" onClick={save}>{i18n('保存本页')}</Button>
				</div>
				<div className="mt-2 text-[#cccccc]">* {i18n('保存后需刷新旧页面')}</div>
			</div>
		</div>
	)
}
