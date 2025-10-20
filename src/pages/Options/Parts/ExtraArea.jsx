import React, { useContext } from 'react'
import { Slider, Switch } from 'antd';
import { SettingContext } from '../Options'
import { i18n } from '../../i18n';
import HiddenSvg from '../../../assets/svg/hidden.svg'
import OpacitySvg from '../../../assets/svg/opacity.svg'
import SettingSvg from '../../../assets/svg/setting.svg'

export const ExtraArea = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	return (
			<div>
				<div className="areaTitle mt-[30px]">{i18n('右上角功能区')}</div>
				<div>
					<div className="mt-[6px]">
						<div className="inline-flex items-center text-xs text-[#a0a0a0] cursor-grabbing">
							<HiddenSvg className="mr-1 w-[16px] h-[16px]" />
							<div className="inline-block text-xs cursor-grabbing text-[#a0a0a0]">{i18n('已隐藏')}</div>
						</div>
						<div>{i18n('元素存在页面中，但是宽度和高度都为 0。')}</div>
					</div>

					<div className="mt-[6px]">
						<div className="inline-flex items-center text-xs text-[#a0a0a0] cursor-grabbing">
							<HiddenSvg className="mr-1 w-[16px] h-[16px]" />
							<div className="inline-block text-xs cursor-grabbing text-[#a0a0a0]">{i18n('被遮盖')}</div>
						</div>
						<div>{i18n('元素被其他元素盖住了，导致不可见。')}</div>

						<div className="setting-row">
							<div>{i18n('是否显示元素状态')}</div>
							<Switch size="small" checked={setting.isShowStatus} onChange={e => updateSetting('isShowStatus', e)} />
						</div>
					</div>

					<div className="mt-[6px]">
						<div className="inline-flex items-center text-xs text-[#a0a0a0] cursor-grab opacity-80 active:cursor-grabbing z-30">
							<OpacitySvg className="w-[16px] h-[16px]" />
						</div>
						<div>{i18n('控制面板的透明度，防止遮盖背后的元素。')}</div>
						<div>{i18n('鼠标悬浮时暂时透明，离开时恢复；也可以点击该图标，使面板固定透明。')}</div>

						<div className="setting-area">
							<div className="setting-row">
								<div>{i18n('是否显示透明按钮')}</div>
								<Switch size="small" checked={setting.isShowOpacity} onChange={e => updateSetting('isShowOpacity', e)} />
							</div>
							{
								setting.isShowOpacity &&
								<div className="setting-row">
									<div>{i18n('临时透明度')}</div>
									<div className="flex items-center">
										<Slider style={{ width: '120px', margin: 0 }} min={0.1} max={0.9} step={0.1} value={setting.tempOpacity} onChange={e => updateSetting('tempOpacity', e)} />
										<div className="ml-2">{setting.tempOpacity}</div>
									</div>
								</div>
							}
						</div>

					</div>

					<div className="mt-[12px]">
						<SettingSvg className="w-[16px] h-[16px] cursor-pointer" />
						<div>
							{i18n('进入设置页。除了这里的按钮，也可以使用以下方式进入设置页：')}
							<ol>
								<li>{i18n('已固定：右击本扩展程序图标，点击“选项”；')}</li>
								<li>{i18n('未固定：点击 chrome 的扩展程序图标，找到 Find whatever，点击“...” - “选项”；')}</li>
								<li>{i18n('进入')} <a href="chrome://extensions/" style={{ textDecoration: 'underline' }}>chrome://extensions</a>，{i18n('找到 Find whatever，点击“详情”-“扩展程序选项”。')}</li>
							</ol>
						</div>

						<div className="setting-row">
							<div>{i18n('是否显示设置按钮')}</div>
							<Switch size="small" checked={setting.isShowSetting} onChange={e => updateSetting('isShowSetting', e)} />
						</div>
					</div>
				</div>
			</div>

	)
}
