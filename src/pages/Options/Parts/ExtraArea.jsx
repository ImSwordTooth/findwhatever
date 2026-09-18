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

	const openExtensionsPage = (e) => {
		e?.preventDefault?.()
		if (chrome?.tabs?.create) {
			chrome.tabs.create({ url: 'chrome://extensions/' })
		} else {
			window.open('chrome://extensions/', '_blank')
		}
	}

	return (
		<div>
			<div className="areaTitle">{t('右上角功能区')}</div>

			<div className="space-y-6">
				{/* 1. 元素状态说明与开关 */}
				<div className="space-y-2.5">
					<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
						<div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200/60 dark:border-zinc-700/40 font-medium text-zinc-700 dark:text-zinc-200">
							<HiddenSvg className="w-4 h-4 text-zinc-500 shrink-0" />
							<span>{t('是否显示元素状态')}</span>
						</div>
						<p className="mb-2.5 text-xs text-zinc-500 dark:text-zinc-400">
							{t('当查找到的目标元素在当前网页中处于不可见状态时，浮窗右上角会实时提示具体原因：')}
						</p>
						<div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
							<div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40">
								<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] shrink-0 font-medium">
									<HiddenSvg className="w-3 h-3 text-zinc-500" />
									{t('隐藏中')}
								</span>
								<span className="pt-0.5 leading-relaxed">{t('元素被 CSS 样式隐藏（如 display: none、visibility: hidden）或宽高尺寸为 0。')}</span>
							</div>
							<div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40">
								<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] shrink-0 font-medium">
									<HiddenSvg className="w-3 h-3 text-zinc-500" />
									{t('被遮盖')}
								</span>
								<span className="pt-0.5 leading-relaxed">{t('元素处于当前可视区域内，但被更上层的弹窗、遮罩或悬浮栏遮挡。')}</span>
							</div>
							<div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-700/40">
								<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] shrink-0 font-medium">
									<HiddenSvg className="w-3 h-3 text-zinc-500" />
									{t('全透明')}
								</span>
								<span className="pt-0.5 leading-relaxed">{t('元素透明度被设为 0（opacity: 0），虽然存在占位但视觉完全透明。')}</span>
							</div>
						</div>
					</div>

					<SettingCard>
						<SettingRow label={t('是否显示元素状态')} tip={t('在浮窗右上角标识当前高亮元素的隐藏或被遮挡状态')}>
							<Switch size="small" checked={setting.isShowStatus} onChange={e => updateSetting('isShowStatus', e)} />
						</SettingRow>
					</SettingCard>
				</div>

				{/* 2. 透明度按钮与临时透明度滑块 */}
				<div className="space-y-2.5">
					<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
						<div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200/60 dark:border-zinc-700/40 font-medium text-zinc-700 dark:text-zinc-200">
							<OpacitySvg className="w-4 h-4 text-zinc-500 shrink-0" />
							<span>{t('是否显示透明按钮')}</span>
						</div>
						<ul className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400 list-disc list-inside">
							<li>{t('控制面板的透明度，防止遮盖背后的元素。')}</li>
							<li>{t('鼠标悬浮时暂时透明，离开时恢复；也可以点击该图标，使面板固定透明。')}</li>
						</ul>
					</div>

					<SettingCard>
						<SettingRow label={t('是否显示透明按钮')} tip={t('在浮窗右上角显示半透明控制按钮')}>
							<Switch size="small" checked={setting.isShowOpacity} onChange={e => updateSetting('isShowOpacity', e)} />
						</SettingRow>
						{
							setting.isShowOpacity &&
							<SettingRow label={t('临时透明度')} tip={t('设置鼠标悬停或激活透明时面板的半透明比例')}>
								<div className="flex items-center gap-3">
									<Slider style={{ width: '130px', margin: 0 }} min={0.1} max={0.9} step={0.1} value={setting.tempOpacity} onChange={e => updateSetting('tempOpacity', e)} />
									<span className="px-2 py-0.5 rounded-md bg-zinc-50/80 dark:bg-zinc-800/80 border border-solid border-zinc-200/60 dark:border-zinc-700/60 font-mono text-xs text-zinc-600 dark:text-zinc-300 min-w-[34px] text-center shadow-2xs">
										{setting.tempOpacity}
									</span>
								</div>
							</SettingRow>
						}
					</SettingCard>
				</div>

				{/* 3. 设置按钮与备用进入途径 */}
				<div className="space-y-2.5">
					<div className="p-3.5 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
						<div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200/60 dark:border-zinc-700/40 font-medium text-zinc-700 dark:text-zinc-200">
							<SettingSvg className="w-4 h-4 text-zinc-500 shrink-0" />
							<span>{t('是否显示设置按钮')}</span>
						</div>
						<p className="mb-2 text-xs text-zinc-600 dark:text-zinc-300">
							{t('进入设置页。除了这里的按钮，也可以使用以下方式进入设置页：')}
						</p>
						<ol className="space-y-1.5 pl-4 text-xs text-zinc-500 dark:text-zinc-400 list-decimal">
							<li>{t('已固定：右击本扩展程序图标，点击“选项”；')}</li>
							<li>{t('未固定：点击 chrome 的扩展程序图标，找到 Find whatever，点击“...” - “选项”；')}</li>
							<li>
								{t('进入')}{' '}
								<a
									href="chrome://extensions/"
									onClick={openExtensionsPage}
									className="text-rose-500 hover:text-rose-600 dark:text-rose-400 font-mono underline underline-offset-2 transition-colors cursor-pointer"
								>
									chrome://extensions
								</a>
								，{t('找到 Find whatever，点击“详情”-“扩展程序选项”。')}
							</li>
						</ol>
					</div>

					<SettingCard>
						<SettingRow label={t('是否显示设置按钮')} tip={t('在浮窗右上角显示齿轮图标，点击直接打开本设置页')}>
							<Switch size="small" checked={setting.isShowSetting} onChange={e => updateSetting('isShowSetting', e)} />
						</SettingRow>
					</SettingCard>
				</div>
			</div>
		</div>
	)
}
