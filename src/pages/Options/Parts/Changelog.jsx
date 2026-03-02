import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TimeSvg from '../../../assets/svg/time.svg'
import { CHANGELOG_ITEMS } from '../changeLogItems'

export const Changelog = () => {
	const containerRef = useRef(null)
	const isDraggingRef = useRef(false)
	const startXRef = useRef(0)
	const scrollLeftRef = useRef(0)
	const [ isDragging, setIsDragging ] = useState(false)
	const [ scrollProgress, setScrollProgress ] = useState(0)

	const { t } = useTranslation()

	const handleMouseDown = (e) => {
		const container = containerRef.current
		if (!container) return
		isDraggingRef.current = true
		setIsDragging(true)
		startXRef.current = e.pageX - container.offsetLeft
		scrollLeftRef.current = container.scrollLeft
	}

	const handleMouseMove = (e) => {
		if (!isDraggingRef.current) return
		const container = containerRef.current
		if (!container) return
		e.preventDefault()
		const x = e.pageX - container.offsetLeft
		const walk = (x - startXRef.current) * 1.2
		container.scrollLeft = scrollLeftRef.current - walk
	}

	const handleMouseUpOrLeave = () => {
		isDraggingRef.current = false
		setIsDragging(false)
	}

	const handleWheel = (e) => {
		const container = containerRef.current
		if (!container) return

		// 将纵向滚轮转换为横向滚动
		const delta = e.deltaY || e.deltaX
		if (Math.abs(delta) === 0) return

		e.preventDefault()
		container.scrollTo({
			left: container.scrollLeft + delta,
			behavior: 'smooth'
		})
	}

	const handleScroll = () => {
		const container = containerRef.current
		if (!container) return
		const { scrollLeft, scrollWidth, clientWidth } = container
		const maxScroll = Math.max(scrollWidth - clientWidth, 0)
		if (maxScroll === 0) {
			setScrollProgress(0)
		} else {
			setScrollProgress(scrollLeft / maxScroll)
		}
	}

	return (
		<div className="mt-[32px] px-[40px] pb-[32px]">
			<div className="areaTitle select-none mb-0">{t('更新日志')}</div>

			<div className="mt-1 text-[11px] text-shadow-none text-gray-400 select-none">*
				{t('鼠标拖拽或滚轮横向来浏览更新内容')}
			</div>
			<div className="mt-2 h-[3px] rounded-full bg-slate-200/80 overflow-hidden">
				<div
					className="h-full bg-slate-400/80"
					style={{
						width: `${scrollProgress * 100}%`,
						transition: 'width 150ms ease-out'
					}}
				/>
			</div>

			<div
				ref={containerRef}
				className="relative overflow-x-auto overflow-y-hidden overscroll-contain rounded-xl border border-gray-200 bg-gradient-to-r from-slate-50/80 via-slate-50 to-slate-100/90 cursor-grab"
				style={{
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
					maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
					WebkitMaskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)'
				}}
				onScroll={handleScroll}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUpOrLeave}
				onMouseLeave={handleMouseUpOrLeave}
				onWheel={handleWheel}
			>
				<div
					className={`flex gap-6 py-4 px-6 transition-transform duration-200 pl-[30px] ${
						isDragging ? 'cursor-grabbing' : ''
					}`}
				>

					{CHANGELOG_ITEMS.map((item, index) => (
						<div
							key={item.version}
							className={`${index===0 ? 'bg-[#affbaf2e] border-dashed border-[1px] border-[#08af08]' : 'border-dashed border-[1px] border-[#cccccc]'} px-4 py-3 w-[280px] max-h-fit mr-[16px] shrink-0 rounded-[12px] bg-white/65 shadow-sm  backdrop-blur-md hover:-translate-y-[3px] hover:shadow-lg transition-all duration-200`}
						>
							<div className="flex items-center justify-between mb-[8px]">
								<div className="font-mono text-[16px] text-[#303030]">
									{item.version}
									{index === 0 && <span className="ml-2 text-[12px] font-medium text-emerald-600">最新</span>}
								</div>
								<div className="text-[12px] text-[#006cb8] flex items-center">
									<TimeSvg className="mr-1 -mt-[1px]"/>
									{item.date}
								</div>
							</div>
							<div className="text-[12px] text-slate-700 leading-relaxed">
								{item.content && <div className="mb-[8px]">{item.content}</div>}
								{item.contentList && item.contentList.length > 0 && (
									<ul className="mt-2 space-y-1 text-[13px] text-slate-600 pl-[20px]">
										{item.contentList.map((line, idx) => (
											<li key={idx}>{line}</li>
										))}
									</ul>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}


