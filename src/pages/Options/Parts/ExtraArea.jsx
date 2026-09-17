import { useContext } from 'preact/compat'
import { Switch } from '../../../components/Switch'
import { Slider } from '../../../components/Slider'
import { SettingContext } from '../Options'
import { useTranslation } from 'react-i18next'
import HiddenSvg from '../../../assets/svg/hidden.svg'
import OpacitySvg from '../../../assets/svg/opacity.svg'
import SettingSvg from '../../../assets/svg/setting.svg'

export const ExtraArea = () => {
	const { setting, updateSetting } = useContext(SettingContext)

	const { t } = useTranslation()

	return (
		<div>
			<div className="areaTitle">{t('右上角功能区')}</div>
			<div className="space-y-8">
				<div>
					<div className="mt-[6px]">
						<div className="inline-flex items-center text-xs text-[#a0a0a0] cursor-grabbing">
							<HiddenSvg className="mr-1 w-[16px] h-[16px]" />
							<div className="inline-block text-xs cursor-grabbing text-[#a0a0a0]">{t('已隐藏')}</div>
						</div>
						<p className="mb-2.5">{t('元素存在页面中，但是宽度和高度都为 0。')}</p>
					</div>

					<div className="mt-[6px]">
						<div className="inline-flex items-center text-xs text-[#a0a0a0] cursor-grabbing">
							<HiddenSvg className="mr-1 w-[16px] h-[16px]" />
							<div className="inline-block text-xs cursor-grabbing text-[#a0a0a0]">{t('被遮盖')}</div>
						</div>
						<p className="mb-2.5">{t('元素被其他元素盖住了，导致不可见。')}</p>

						<div className="setting-row">
							<div>{t('是否显示元素状态')}</div>
							<Switch size="small" checked={setting.isShowStatus} onChange={e => updateSetting('isShowStatus', e)} />
						</div>
					</div>
				</div>

				<div>
					<div className="inline-flex items-center text-xs text-[#a0a0a0] cursor-grab opacity-80 active:cursor-grabbing z-30">
						<OpacitySvg className="w-[16px] h-[16px]" />
					</div>
					<p className="mb-1">{t('控制面板的透明度，防止遮盖背后的元素。')}</p>
					<p className="mb-2.5">{t('鼠标悬浮时暂时透明，离开时恢复；也可以点击该图标，使面板固定透明。')}</p>

					<div className="setting-area">
						<div className="setting-row">
							<div>{t('是否显示透明按钮')}</div>
							<Switch size="small" checked={setting.isShowOpacity} onChange={e => updateSetting('isShowOpacity', e)} />
						</div>
						{
							setting.isShowOpacity &&
							<div className="setting-row">
								<div>{t('临时透明度')}</div>
								<div className="flex items-center">
									<Slider style={{ width: '120px', margin: 0 }} min={0.1} max={0.9} step={0.1} value={setting.tempOpacity} onChange={e => updateSetting('tempOpacity', e)} />
									<div className="ml-2">{setting.tempOpacity}</div>
								</div>
							</div>
						}
					</div>
				</div>

				<div>
					<SettingSvg className="w-[16px] h-[16px] cursor-pointer mb-1" />
					<p className="mb-2">{t('进入设置页。除了这里的按钮，也可以使用以下方式进入设置页：')}</p>
					<ol className="space-y-1.5 pl-5 mb-3">
						<li>{t('已固定：右击本扩展程序图标，点击“选项”；')}</li>
						<li>{t('未固定：点击 chrome 的扩展程序图标，找到 Find whatever，点击“...” - “选项”；')}</li>
						<li>{t('进入')} <a href="chrome://extensions/" style={{ textDecoration: 'underline' }}>chrome://extensions</a>，{t('找到 Find whatever，点击“详情”-“扩展程序选项”。')}</li>
					</ol>

					<div className="setting-row">
						<div>{t('是否显示设置按钮')}</div>
						<Switch size="small" checked={setting.isShowSetting} onChange={e => updateSetting('isShowSetting', e)} />
					</div>
				</div>
			</div>
		</div>

	)
}
