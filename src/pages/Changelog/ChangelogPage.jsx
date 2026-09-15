import { useState, useEffect } from 'preact/compat'
import { CHANGELOG_DATA } from './changeLogData'
import { MilestoneCard } from './MilestoneCard'
import { VersionCard } from './VersionCard'

export const ChangelogPage = () => {
	const [theme, setTheme] = useState('dark')

	useEffect(() => {
		// 从 sync storage 读取用户之前配置的 colorMode
		chrome.storage?.sync?.get(['swe_setting']).then((res) => {
			const mode = res?.swe_setting?.colorMode
			if (mode === 'light' || mode === 'dark') {
				setTheme(mode)
			} else {
				setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
			}
		}).catch(() => null)
	}, [])

	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [theme])

	const toggleTheme = () => {
		setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
	}

	return (
		<div className="relative min-h-screen bg-neutral-50 dark:bg-[#0c0d12] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 font-sans selection:bg-rose-500/20 selection:text-rose-500">
			{/* 方案 A: 现代工程微点阵网格背景 (Dot Grid / Blueprint) */}
			<div
				className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#262730_1px,transparent_1px)] [background-size:20px_20px]"
				style={{
					maskImage: 'radial-gradient(ellipse 80% 70% at 50% 25%, #000 50%, transparent 100%)',
					WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 25%, #000 50%, transparent 100%)'
				}}
			/>

			{/* 顶部微环境光斑：增添质感与层次 */}
			<div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-rose-500/10 via-amber-500/5 to-transparent blur-3xl rounded-full" />
			</div>

			<div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{/* 顶栏 Header：放大 Logo、加大标题、放大设置与主题切换按钮、更新日志采用透亮微光胶囊 */}
				<header className="flex items-center justify-between gap-4 pb-6 mb-10 border-b border-neutral-200/80 dark:border-neutral-800/80">
					<div className="flex items-center gap-3.5">
						<img src="popup.png" alt="Logo" className="w-11 h-11 rounded-xl shadow-md" />
						<div className="flex items-center gap-2.5">
							<span className="font-mono text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 dark:from-white dark:via-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
								Find whatever
							</span>
							<span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/15 via-amber-500/15 to-indigo-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 shadow-sm backdrop-blur-sm tracking-wide">
								更新日志
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2.5">
						{/* 返回设置页 */}
						<a
							href="options.html"
							className="text-sm px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-800/90 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 shadow-sm hover:shadow active:scale-95 transition-all inline-flex items-center gap-2 no-underline font-medium cursor-pointer"
						>
							<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<line x1="19" y1="12" x2="5" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								<polyline points="12 19 5 12 12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span>设置</span>
						</a>

						{/* 深浅色切换按钮 */}
						<button
							type="button"
							onClick={toggleTheme}
							className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-800/90 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer flex items-center justify-center"
							title="切换深浅色"
						>
							{theme === 'dark' ? (
								<svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<circle cx="12" cy="12" r="5" strokeWidth="2" />
									<line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" />
									<line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" />
									<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" strokeLinecap="round" />
									<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" strokeLinecap="round" />
									<line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" strokeLinecap="round" />
									<line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round" />
									<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" strokeLinecap="round" />
									<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" strokeLinecap="round" />
								</svg>
							) : (
								<svg className="w-5 h-5 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
									<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							)}
						</button>
					</div>
				</header>

				{/* 时间轴主列表：坐标基准 left-4 (16px)，竖线与各卡片节点严格同轴 */}
				<main className="relative">
					{/* 真正只有左边展示的发光竖线，居中严格对齐 left-4 (16px) */}
					<div className="absolute left-4 -translate-x-1/2 top-4 bottom-6 w-[2px] bg-gradient-to-b from-rose-500/80 via-neutral-300/80 to-neutral-200/20 dark:from-rose-500/80 dark:via-neutral-700/80 dark:to-neutral-800/20 pointer-events-none" />

					<div className="relative">
						{CHANGELOG_DATA.map((item, index) => {
							// 只有第 0 项（最新大版本）享有大版本流光卡片与粒子特效，其余版本为精简普通卡片
							if (index === 0) {
								return <MilestoneCard key={item.version} item={item} />
							}
							return <VersionCard key={item.version} item={item} />
						})}
					</div>
				</main>

				{/* 极简页脚 */}
				<footer className="mt-14 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 text-center text-xs text-neutral-400 dark:text-neutral-500">
					<p>© {new Date().getFullYear()} Find whatever. Crafted for precision and joy.</p>
				</footer>
			</div>
		</div>
	)
}
