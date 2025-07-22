import React, { useContext } from 'react'
import {Radio, Switch} from 'antd';
import { SettingContext } from '../Options'
import {i18n} from '../../i18n';

export const History = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	return (
		<div>
			<div className="areaTitle mt-[30px]">{i18n('历史记录')}</div>
			<div className="flex items-center justify-start">
				{
					navigator.language === 'zh' || navigator.language === 'zh-CN'
						?
						<>
							鼠标移动到输入框左侧的
							<svg
								className="p-1 box-content w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2]"
								viewBox="0 0 1024 1024" version="1.1"
								xmlns="http://www.w3.org/2000/svg" p-id="3578" width="32" height="32"
								fill="#272636">
								<path
									d="M924.352 844.256l-163.968-163.968c44.992-62.912 71.808-139.648 71.808-222.72 0-211.776-172.224-384-384-384s-384 172.224-384 384 172.224 384 384 384c82.56 0 158.912-26.432 221.568-70.912l164.16 164.16c12.416 12.416 38.592 15.04 51.072 2.624l45.248-45.248c12.416-12.544 6.592-35.392-5.888-47.936zM128.128 457.568c0-176.448 143.552-320 320-320s320 143.552 320 320-143.552 320-320 320-320-143.552-320-320z"
									p-id="3579"></path>
							</svg>
							时，会展开查找记录列表。
						</>
						:
						<>
							When you move the mouse over the
							<svg
								className="p-1 box-content w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2]"
								viewBox="0 0 1024 1024" version="1.1"
								xmlns="http://www.w3.org/2000/svg" p-id="3578" width="32" height="32"
								fill="#272636">
								<path
									d="M924.352 844.256l-163.968-163.968c44.992-62.912 71.808-139.648 71.808-222.72 0-211.776-172.224-384-384-384s-384 172.224-384 384 172.224 384 384 384c82.56 0 158.912-26.432 221.568-70.912l164.16 164.16c12.416 12.416 38.592 15.04 51.072 2.624l45.248-45.248c12.416-12.544 6.592-35.392-5.888-47.936zM128.128 457.568c0-176.448 143.552-320 320-320s320 143.552 320 320-143.552 320-320 320-320-143.552-320-320z"
									p-id="3579"></path>
							</svg>
							on the left side of the input field, the list of search records expands.
						</>
				}

			</div>
			<div>{i18n('点击列表项可以把文本填入输入框中。')}{i18n('也可以点击右侧的')}
				<div
					className="inline-flex w-[18px] h-[18px] justify-center items-center text-[14px] select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:text-[#50a3d2]">.*
				</div>
				{i18n('，填入的同时开启正则模式。')}

			</div>
			<div>
				{
					navigator.language === 'zh' || navigator.language === 'zh-CN'
						?
							<>
								你还可以把常用的词语添加到固定列表中，只需在历史记录的某一条右侧点击
								<div
									className="inline-flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] group/fix ">
									<svg className="w-3 h-3 group-hover/fix:fill-[#50a3d2]"
										 viewBox="0 0 1024 1024" version="1.1"
										 xmlns="http://www.w3.org/2000/svg" p-id="8003"
										 width="200" height="200" fill="#3B3B3B">
										<path
											d="M1008.618567 392.01748l-383.019709-383.019709C606.447872-10.153214 574.529563 2.61411 568.145902 34.532419l-6.383662 57.452956-6.383662 70.22028c0 12.767324-6.383662 19.150985-12.767324 25.534647L236.195487 404.784804c-6.383662 6.383662-12.767324 6.383662-25.534647 6.383662h-12.767324l-57.452956-6.383662c-31.918309 0-51.069295 38.301971-25.534647 57.452956l44.685632 44.685633 127.673237 127.673236L0 1024l383.019709-287.264782 172.358869 172.358869c25.534647 25.534647 63.836618 6.383662 57.452956-25.534647l-6.383662-57.452956v-12.767324c0-6.383662 0-19.150985 6.383662-25.534647L829.876036 481.388746c6.383662-6.383662 12.767324-12.767324 25.534647-12.767324l70.22028-6.383662 57.452957-6.383662c38.301971-6.383662 51.069295-38.301971 25.534647-63.836618z m-255.346473 31.918309l-217.044501 306.415767s0 6.383662-6.383662 6.383662L287.264782 494.156069s6.383662 0 6.383662-6.383662l306.415767-217.044501c31.918309-19.150985 51.069295-51.069295 57.452956-89.371266l178.742531 178.742531c-31.918309 12.767324-63.836618 31.918309-82.987604 63.836618z"
											p-id="8004"></path>
									</svg>
								</div>。
							</>
						:
						<>
							You can also add frequently used words to a fixed list, just click the
							<div
								className="inline-flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] group/fix ">
								<svg className="w-3 h-3 group-hover/fix:fill-[#50a3d2]"
									 viewBox="0 0 1024 1024" version="1.1"
									 xmlns="http://www.w3.org/2000/svg" p-id="8003"
									 width="200" height="200" fill="#3B3B3B">
									<path
										d="M1008.618567 392.01748l-383.019709-383.019709C606.447872-10.153214 574.529563 2.61411 568.145902 34.532419l-6.383662 57.452956-6.383662 70.22028c0 12.767324-6.383662 19.150985-12.767324 25.534647L236.195487 404.784804c-6.383662 6.383662-12.767324 6.383662-25.534647 6.383662h-12.767324l-57.452956-6.383662c-31.918309 0-51.069295 38.301971-25.534647 57.452956l44.685632 44.685633 127.673237 127.673236L0 1024l383.019709-287.264782 172.358869 172.358869c25.534647 25.534647 63.836618 6.383662 57.452956-25.534647l-6.383662-57.452956v-12.767324c0-6.383662 0-19.150985 6.383662-25.534647L829.876036 481.388746c6.383662-6.383662 12.767324-12.767324 25.534647-12.767324l70.22028-6.383662 57.452957-6.383662c38.301971-6.383662 51.069295-38.301971 25.534647-63.836618z m-255.346473 31.918309l-217.044501 306.415767s0 6.383662-6.383662 6.383662L287.264782 494.156069s6.383662 0 6.383662-6.383662l306.415767-217.044501c31.918309-19.150985 51.069295-51.069295 57.452956-89.371266l178.742531 178.742531c-31.918309 12.767324-63.836618 31.918309-82.987604 63.836618z"
										p-id="8004"></path>
								</svg>
							</div>
							on the right side of any entry in the history.
						</>
				}
				{i18n('固定列表无内容时不显示。')}
			</div>
			<div>{i18n('历史记录会在面板关闭时更新，记入关闭时的查找词，最多记录 50 条。')}</div>
			<div className="setting-area">
				<div className="setting-row">
					<div>{i18n('是否显示历史记录')}</div>
					<Switch size="small" checked={setting.isShowHistory} onChange={e => updateSetting('isShowHistory', e)} />
				</div>
				{
					setting.isShowHistory &&
					<div className="setting-row">
						<div>{i18n('历史记录打开方式')}</div>
						<Radio.Group value={setting.openHistoryMode} onChange={e  => updateSetting('openHistoryMode', e.target.value)}>
							<Radio value={'hover'}>{i18n('鼠标移入')}</Radio>
							<Radio value={'click'}>{i18n('鼠标点击')}</Radio>
						</Radio.Group>
					</div>
				}
			</div>
		</div>
	)
}
