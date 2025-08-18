import React, { useContext } from 'react'
import {Radio, Switch} from 'antd';
import { SettingContext } from '../Options'
import {i18n} from '../../i18n';
import SearchSvg from '../../../assets/svg/search.svg'
import FixSvg from '../../../assets/svg/fix.svg'

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
							<SearchSvg className="p-1 box-content w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2]" />
							时，会展开查找记录列表。
						</>
						:
						<>
							When you move the mouse over the
							<SearchSvg className="p-1 box-content w-4 h-4 z-10 rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] hover:fill-[#50a3d2]" />
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
								<div className="inline-flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] group/fix ">
									<FixSvg className="w-3 h-3 group-hover/fix:fill-[#50a3d2]" />
								</div>。
							</>
						:
						<>
							You can also add frequently used words to a fixed list, just click the
							<div className="inline-flex w-[18px] h-[18px] justify-center items-center select-none rounded cursor-pointer transition-colors hover:bg-[#e9e9e9] group/fix ">
								<FixSvg className="w-3 h-3 group-hover/fix:fill-[#50a3d2]" />
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
