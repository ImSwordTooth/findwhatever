import { useContext } from 'preact/compat'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../../components/Tooltip'
import { Switch } from '../../../components/Switch'
import { InputNumber } from '../../../components/InputNumber'
import { SettingRow } from '../../../components/SettingCard'
import { SettingContext } from '../Options'
import { Shortcut } from '../../../components/Shortcut'
import UpArrowSvg from '../../../assets/svg/upArrow.svg'
import DownArrowSvg from '../../../assets/svg/downArrow.svg'
import LiveSvg from '../../../assets/svg/live.svg'
import CloseSvg from '../../../assets/svg/close.svg'
import WarnSvg from '../../../assets/svg/warn.svg'

export const Feature = () => {
	const { setting, updateSetting } = useContext(SettingContext)
	const { t } = useTranslation()

	return (
		<div>
			<div className="areaTitle">{t('功能区')}</div>

			<div className="space-y-8">
				{/* 1. 切换定位结果 */}
				<div className="space-y-3">
					<div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-200">
						<UpArrowSvg className="w-4 h-4" />
						<DownArrowSvg className="w-4 h-4" />
					</div>
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
						{t('在当前页面的匹配结果之间循环切换聚焦项（search-results-active），并自动平滑滚动至视口正中。')}
					</p>
					<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
						{t('在输入框获得焦点时，可按 Enter（下一个）或 Shift + Enter（上一个）快速跳转。')}
					</p>

					<SettingRow
						standalone
						label={t('开启首尾循环跳转提示')}
						tip={t('在最后一项跳回第一项、或从第一项跳至最后一项时，在数字上方展示方向脱壳虚影')}
					>
						<Switch size="small" checked={setting.isLoopNotice ?? true} onChange={e => updateSetting('isLoopNotice', e)} />
					</SettingRow>
				</div>

				{/* 2. 大小写敏感 */}
				<div className="space-y-2.5">
					<div className="flex items-center gap-2">
						<button type="button" className="normalButton ml-0">
							<span className="text-xs select-none">Cc</span>
						</button>
						<button type="button" className="normalButton activeButton">
							<span className="text-xs select-none">Cc</span>
						</button>
					</div>
					<Shortcut isMulti shortkey="c" />
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
						{t('启用后严格区分英文字母大小写（如匹配 Apple 不会命中 apple）；关闭时默认不区分大小写。')}
					</p>
				</div>

				{/* 3. 单词匹配 */}
				<div className="space-y-2.5">
					<div className="flex items-center gap-2">
						<button type="button" className="normalButton ml-0">
							<span className="text-xs select-none">W</span>
						</button>
						<button type="button" className="normalButton activeButton">
							<span className="text-xs select-none">W</span>
						</button>
					</div>
					<Shortcut shortkey="w" isMulti />
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
						{t('启用后仅匹配完整独立的英文单词（基于正则表达式词边界 \\b），例如检索 spec 时不会误匹配 special 中的前缀片段。适合代码变量或英文精确定位。')}
					</p>
				</div>

				{/* 4. 正则表达式与宽泛正则防御 */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<button type="button" className="normalButton ml-0">
							<span className="text-xs select-none">.*</span>
						</button>
						<button type="button" className="normalButton activeButton">
							<span className="text-xs select-none">.*</span>
						</button>
					</div>
					<Shortcut shortkey="r" isMulti />
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
						{t('启用后支持使用正则表达式语法进行高级查找。由于复杂正则匹配计算开销较大，系统提供了独立的防抖时长保护。')}
					</p>

					{/* 宽泛正则防护卡片 */}
					<div className="rounded-xl p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-2">
						<div className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-amber-200">
							<Tooltip
								arrowPointAtCenter={true}
								placement="bottom"
								title={
									<div className="scale-90 p-1">
										<div className="text-[#cccccc] leading-4">{t('正则表达式过于宽泛，可能导致查找过程中卡死，已暂停搜索，请重新输入')}</div>
									</div>
								}
							>
								<WarnSvg className="w-3.5 h-3.5 fill-amber-500 cursor-pointer inline-block align-middle" />
							</Tooltip>
							<span>{t('宽泛正则防护（ReDoS 防御）')}</span>
						</div>
						<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
							{t('若输入如 .*、.+ 等过于宽泛的通配量词，可能在页面瞬间产生海量匹配导致标签页卡死。插件内置了双层过滤机制：优先拦截全量量词，并基于测试样本判定覆盖率。命中时输入框右侧会亮起红标警告并暂停检索，保障页面运行安全。')}
						</p>
					</div>

					<SettingRow
						standalone
						label={t('正则模式防抖时长')}
						tip={t('正则模式下停止输入后触发检索的等待时间（最小 500ms），避免打字过程中频繁匹配卡顿')}
					>
						<InputNumber
							style={{ width: '130px' }}
							addonAfter="ms"
							min={500}
							step={100}
							value={setting.regexDebounceDuration}
							onChange={e => updateSetting('regexDebounceDuration', e)}
						/>
					</SettingRow>
				</div>

				{/* 5. 实时监听 DOM 变化 */}
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<div className="w-5 h-5 justify-center rounded-[6px] select-none inline-flex items-center cursor-pointer ml-0 text-zinc-600 dark:text-zinc-300">
							<LiveSvg className="w-4 h-4" />
						</div>
						<div className="w-5 h-5 justify-center rounded-[6px] select-none inline-flex items-center cursor-pointer ml-0 activeButton">
							<LiveSvg className="w-4 h-4" />
						</div>
					</div>
					<Shortcut shortkey="d" isMulti />
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
						{t('启用后将启动 MutationObserver 监听页面的 DOM 结构变动，当页面有新内容加载或节点变化时自动重新检索。适合单页应用（SPA）、动态加载或持续更新的消息流列表。')}
					</p>
					<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-xs">
						💡 {t('现代网页若存在频繁自动轮播或背景高频定时器，开启实时监听会持续消耗计算资源。非动态加载页面建议保持关闭，以确保最佳检索性能。')}
					</p>
				</div>

				{/* 6. 关闭面板 */}
				<div className="space-y-3">
					<div>
						<button type="button" className="w-6 h-6 rounded-full inline-flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors border-none bg-transparent">
							<CloseSvg className="w-2.5 h-2.5" />
						</button>
					</div>
					<Shortcut shortkey="Esc" />
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
						{t('点击关闭按钮或按 Esc 键时，面板播放平滑退场动画后干净卸载，同时自动清除页面所有搜索高亮、注销 DOM 监听器，并将当前有效搜索词同步记入历史。')}
					</p>

					<SettingRow
						standalone
						label={t('显示关闭按钮')}
						tip={t('关闭后浮窗右侧不显示关闭叉号图标，仍可随时按 Esc 键关闭面板')}
					>
						<Switch size="small" checked={setting.isShowClose} onChange={e => updateSetting('isShowClose', e)} />
					</SettingRow>
				</div>
			</div>
		</div>
	)
}
