import { useContext } from 'preact/compat'
import { Switch } from '../../../components/Switch'
import { Slider } from '../../../components/Slider'
import { SettingCard, SettingRow } from '../../../components/SettingCard'
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

						<SettingRow standalone label={t('是否显示元素状态')}>
							<Switch size="small" checked={setting.isShowStatus} onChange={e => updateSetting('isShowStatus', e)} />
						</SettingRow>
					</div>
				</div>

				<div>
					<div className="inline-flex items-center text-xs text-[#a0a0a0] cursor-grab opacity-80 active:cursor-grabbing z-30">
						<OpacitySvg className="w-[16px] h-[16px]" />
					</div>
					<p className="mb-1">{t('控制面板的透明度，防止遮盖背后的元素。')}</p>
					<p className="mb-2.5">{t('鼠标悬浮时暂时透明，离开时恢复；也可以点击该图标，使面板固定透明。')}</p>

					<SettingCard>
						<SettingRow label={t('是否显示透明按钮')}>
							<Switch size="small" checked={setting.isShowOpacity} onChange={e => updateSetting('isShowOpacity', e)} />
						</SettingRow>
						{
							setting.isShowOpacity &&
							<SettingRow label={t('临时透明度')}>
								<div className="flex items-center gap-3">
									<Slider style={{ width: '130px', margin: 0 }} min={0.1} max={0.9} step={0.1} value={setting.tempOpacity} onChange={e => updateSetting('tempOpacity', e)} />
									<span className="px-2 py-0.5 rounded-md bg-zinc-50/80 border border-solid border-zinc-200/60 font-mono text-xs text-zinc-500 min-w-[34px] text-center">
										{setting.tempOpacity}
									</span>
								</div>
							</SettingRow>
						}
					</SettingCard>
				</div>

				<div>
					<SettingSvg className="w-[16px] h-[16px] cursor-pointer mb-1" />
					<p className="mb-2">{t('进入设置页。除了这里的按钮，也可以使用以下方式进入设置页：')}</p>
					<ol className="space-y-1.5 pl-5 mb-3">
						<li>{t('已固定：右击本扩展程序图标，点击“选项”；')}</li>
						<li>{t('未固定：点击 chrome 的扩展程序图标，找到 Find whatever，点击“...” - “选项”；')}</li>
						<li>{t('进入')} <a href="chrome://extensions/" style={{ textDecoration: 'underline' }}>chrome://extensions</a>，{t('找到 Find whatever，点击“详情”-“扩展程序选项”。')}</li>
					</ol>

					<SettingRow standalone label={t('是否显示设置按钮')}>
						<Switch size="small" checked={setting.isShowSetting} onChange={e => updateSetting('isShowSetting', e)} />
					</SettingRow>
				</div>
			</div>
		</div>

	)
}
