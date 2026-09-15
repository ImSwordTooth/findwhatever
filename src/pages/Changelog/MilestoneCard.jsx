import { useState, useRef } from 'preact/compat'
import { SparkCanvas } from './SparkCanvas'

export const MilestoneCard = ({ item }) => {
	const [sparkTrigger, setSparkTrigger] = useState(false)
	const [tilt, setTilt] = useState({ x: 0, y: 0 })
	const cardRef = useRef(null)

	const handleMouseMove = (e) => {
		const card = cardRef.current
		if (!card) return
		const rect = card.getBoundingClientRect()
		const x = e.clientX - rect.left - rect.width / 2
		const y = e.clientY - rect.top - rect.height / 2
		const rotateX = (-y / (rect.height / 2)) * 3
		const rotateY = (x / (rect.width / 2)) * 3
		setTilt({ x: rotateX, y: rotateY })
	}

	const handleMouseLeave = () => {
		setTilt({ x: 0, y: 0 })
	}

	const triggerSpark = () => {
		setSparkTrigger(false)
		setTimeout(() => setSparkTrigger(true), 20)
	}

	return (
		<div
			id={`version-${item.version.replace('.', '-')}`}
			className="relative group mb-8 pl-10 sm:pl-12"
		>
			{/* 时间轴发光主节点：严格定位于 left-4，-translate-x-1/2 确保中心与竖线 100% 同轴 */}
			<div className="absolute left-4 -translate-x-1/2 top-4 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2px] shadow-[0_0_15px_rgba(244,63,94,0.4)] z-10 pointer-events-none">
				<div className="w-full h-full rounded-full bg-white dark:bg-[#0e1015] flex items-center justify-center">
					<div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 animate-pulse" />
				</div>
			</div>

			{/* 3D 视差与流光卡片外壳 */}
			<div
				ref={cardRef}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				style={{
					transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
					transition: 'transform 0.15s ease-out'
				}}
				className="relative rounded-2xl p-[2px] bg-gradient-to-r from-amber-500/80 via-rose-500/80 to-indigo-600/80 shadow-xl hover:shadow-[0_20px_50px_rgba(244,63,94,0.22)] transition-shadow duration-300"
			>
				{/* 粒子喷发容器 */}
				<SparkCanvas trigger={sparkTrigger} onComplete={() => setSparkTrigger(false)} />

				{/* 卡片核心主体 */}
				<div className="relative rounded-[14px] bg-white/95 dark:bg-[#15171e]/95 backdrop-blur-xl p-5 sm:p-7 overflow-hidden text-neutral-800 dark:text-neutral-100">
					{/* 背景光斑装饰 */}
					<div className="absolute -right-16 -top-16 w-56 h-56 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
					<div className="absolute -left-16 -bottom-16 w-56 h-56 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

					{/* 顶栏信息：版本号 + 最新粒子按钮 + 发布日期 */}
					<div className="flex flex-wrap items-center justify-between gap-3 mb-3">
						<div className="flex items-center gap-3">
							<span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent">
								{item.version}
							</span>
							<button
								type="button"
								onClick={triggerSpark}
								className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer border-none"
							>
								✨ 最新
							</button>
						</div>
						<div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5">
							<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
								<line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
								<line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
								<line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
							</svg>
							{item.date}
						</div>
					</div>

					{/* 变更条目：与下面版本完全一致的素雅排版，无额外加粗或色彩干扰 */}
					{item.contentList && item.contentList.length > 0 && (
						<ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 pl-0 list-none m-0">
							{item.contentList.map((line, idx) => (
								<li key={idx} className="flex items-start gap-2">
									<span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500/80 shrink-0" />
									<span className="leading-relaxed">{line}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	)
}
