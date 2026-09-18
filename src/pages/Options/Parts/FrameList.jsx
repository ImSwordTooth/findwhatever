import { useTranslation } from 'react-i18next'

export const FrameList = () => {
	const { t } = useTranslation()

	return (
		<div>
			<div className="areaTitle">{t('页面列表')}</div>

			<div className="space-y-4">
				{/* 核心概述卡片 */}
				<div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm">
					<div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1.5 flex items-center gap-2">
						<span className="w-2 h-2 rounded-full bg-rose-500" />
						<span>{t('内嵌 Frame 穿透查找与多页面导航')}</span>
					</div>
					<p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
						{t('原生浏览器的查找往往无法触及 iframe 内嵌页面，而 Find Whatever 能自动穿透当前网页中所有的内嵌子框架，并将全页面的匹配结果在浮窗顶部进行集中统计与快捷导航。')}
					</p>
				</div>

				{/* 功能拆解列表 */}
				<div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-700/60 space-y-4 text-xs">
					{/* 1. 结果统计与快捷切换 */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-2.5">
							<span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] font-semibold border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
								{t('点击切换')}
							</span>
							<span className="font-medium text-zinc-800 dark:text-zinc-200">
								{t('快速定位与轮播')}
							</span>
						</div>
						<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed pl-0.5">
							{t('点击“当前页”可立即定位至主页面的匹配项；点击“iframe”可在所有存在匹配结果的子页面之间循环跳转。')}
						</p>
					</div>

					<div className="border-t border-zinc-100 dark:border-zinc-800/60" />

					{/* 2. 底部指示条说明 */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-2.5">
							<span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] font-semibold border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
								{t('状态横条')}
							</span>
							<span className="font-medium text-zinc-800 dark:text-zinc-200">
								{t('底部状态条色彩含义')}
							</span>
						</div>
						<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed pl-0.5">
							{t('浮窗标签下方的小横条直观呈现页面分布：主题色代表当前聚焦的页面，浅灰色代表存在匹配项的其他页面，透明代表该页面无结果。')}
						</p>
					</div>

					<div className="border-t border-zinc-100 dark:border-zinc-800/60" />

					{/* 3. 智能容错与广泛兼容 */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-2.5">
							<span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] font-semibold border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
								{t('智能兼容')}
							</span>
							<span className="font-medium text-zinc-800 dark:text-zinc-200">
								{t('自动异常过滤与全协议支持')}
							</span>
						</div>
						<p className="text-zinc-500 dark:text-zinc-400 leading-relaxed pl-0.5">
							{t('自动过滤空白、无实际内容或加载出错的无效 iframe；同时支持本地文件（file://）与动态生成的嵌入页面（srcdoc）。')}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
