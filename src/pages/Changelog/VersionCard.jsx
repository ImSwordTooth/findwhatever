export const VersionCard = ({ item }) => {
	return (
		<div
			id={`version-${item.version.replace('.', '-')}`}
			className="relative mb-6 pl-10 sm:pl-12 group"
		>
			{/* 时间轴小节点：严格定位于 left-4，-translate-x-1/2 确保中心与竖线 100% 同轴 */}
			<div className="absolute left-4 -translate-x-1/2 top-4 w-4 h-4 rounded-full bg-white dark:bg-[#0e1015] border-2 border-neutral-300 dark:border-neutral-700 group-hover:border-[var(--swe-color-primary,#1677ff)] group-hover:scale-110 transition-all flex items-center justify-center z-10 pointer-events-none">
				<div className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 group-hover:bg-[var(--swe-color-primary,#1677ff)] transition-colors" />
			</div>

			{/* 卡片主体：提升质感，精简但精致 */}
			<div className="rounded-xl p-4 sm:p-5 bg-white/90 dark:bg-[#14161f]/90 border border-neutral-200/90 dark:border-neutral-800/90 backdrop-blur-md hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-200 text-neutral-800 dark:text-neutral-100">
				{/* 顶栏：版本号 Badge + 日期 */}
				<div className="flex items-center justify-between gap-3 mb-2.5">
					<div className="flex items-center gap-2">
						<span className="font-mono text-sm sm:text-base font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/60">
							{item.version}
						</span>
						{item.tagline && (
							<span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate hidden sm:inline">
								{item.tagline}
							</span>
						)}
					</div>
					<div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 shrink-0">
						{item.date}
					</div>
				</div>

				{/* 移动端显示的副标题 */}
				{item.tagline && (
					<p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-2 sm:hidden">
						{item.tagline}
					</p>
				)}

				{/* 单文本内容 */}
				{item.content && (
					<p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed m-0">
						{item.content}
					</p>
				)}

				{/* 全部变更项：完全展示，绝不折叠 */}
				{item.contentList && item.contentList.length > 0 && (
					<ul className="space-y-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 pl-0 list-none m-0">
						{item.contentList.map((line, idx) => (
							<li key={idx} className="flex items-start gap-2">
								<span className="mt-1.5 w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 shrink-0 group-hover:bg-[var(--swe-color-primary,#1677ff)] transition-colors" />
								<span className="leading-relaxed">{line}</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
