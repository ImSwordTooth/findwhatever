import { useState, useRef, useEffect, useLayoutEffect } from 'preact/compat'
import { createPortal } from 'preact/compat'

export const Popover = ({
	content,
	children,
	placement = 'rightTop',
	trigger = ['click'],
	className = '',
	contentClassName = '',
	isOpen: controlledOpen,
	onOpenChange
}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
	const isControlled = controlledOpen !== undefined
	const isOpen = isControlled ? controlledOpen : uncontrolledOpen

	const triggerRef = useRef(null)
	const popoverRef = useRef(null)
	const [coords, setCoords] = useState(null)
	const [mounted, setMounted] = useState(false)

	const calculateCoords = () => {
		if (!triggerRef.current) return null
		const rect = triggerRef.current.getBoundingClientRect()
		const popEl = popoverRef.current
		const popWidth = popEl ? popEl.offsetWidth : 236
		const popHeight = popEl ? popEl.offsetHeight : 310

		let top = 0
		let left = 0

		if (placement === 'rightTop') {
			// 优先放置在触发器右侧对齐顶部。若右侧超出屏幕边缘，自动降级为下方右对齐
			if (rect.right + popWidth + 16 <= window.innerWidth) {
				left = rect.right + 8
				top = rect.top
			} else {
				left = Math.max(16, rect.right - popWidth)
				top = rect.bottom + 8
			}
		} else if (placement === 'bottomRight') {
			left = Math.max(16, rect.right - popWidth)
			top = rect.bottom + 8
		} else if (placement === 'bottomLeft') {
			left = rect.left
			top = rect.bottom + 8
		} else {
			if (rect.right + popWidth + 16 <= window.innerWidth) {
				left = rect.right + 8
				top = rect.top
			} else {
				left = Math.max(16, rect.right - popWidth)
				top = rect.bottom + 8
			}
		}

		// 垂直边界保护：若底部超出屏幕，自动往上推
		if (top + popHeight > window.innerHeight - 16) {
			top = Math.max(16, window.innerHeight - popHeight - 16)
		}

		return { top, left }
	}

	const setIsOpen = (next) => {
		if (next) {
			const initCoords = calculateCoords()
			if (initCoords) setCoords(initCoords)
		}
		if (!isControlled) {
			setUncontrolledOpen(next)
		}
		if (onOpenChange) {
			onOpenChange(next)
		}
	}

	useLayoutEffect(() => {
		if (isOpen) {
			const newCoords = calculateCoords()
			if (newCoords) setCoords(newCoords)
			const frame = requestAnimationFrame(() => {
				setMounted(true)
			})
			return () => cancelAnimationFrame(frame)
		} else {
			setMounted(false)
		}
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) return

		const handleMouseDown = (e) => {
			const inTrigger = triggerRef.current && triggerRef.current.contains(e.target)
			const inPopover = popoverRef.current && popoverRef.current.contains(e.target)
			if (!inTrigger && !inPopover) {
				setIsOpen(false)
			}
		}

		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setIsOpen(false)
			}
		}

		const handleScrollOrResize = () => {
			const newCoords = calculateCoords()
			if (newCoords) setCoords(newCoords)
		}

		document.addEventListener('mousedown', handleMouseDown)
		document.addEventListener('keydown', handleKeyDown)
		window.addEventListener('resize', handleScrollOrResize)
		window.addEventListener('scroll', handleScrollOrResize, true) // capture 捕获任意父容器滚动

		return () => {
			document.removeEventListener('mousedown', handleMouseDown)
			document.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('resize', handleScrollOrResize)
			window.removeEventListener('scroll', handleScrollOrResize, true)
		}
	}, [isOpen])

	const handleTriggerClick = () => {
		const triggerList = Array.isArray(trigger) ? trigger : [trigger]
		if (triggerList.includes('click')) {
			setIsOpen(!isOpen)
		}
	}

	return (
		<div className={`relative inline-block ${className}`} ref={triggerRef}>
			<div onClick={handleTriggerClick} className="inline-block cursor-pointer">
				{children}
			</div>

			{isOpen && coords && typeof document !== 'undefined' && createPortal(
				<div
					ref={popoverRef}
					style={{
						position: 'fixed',
						top: `${coords.top}px`,
						left: `${coords.left}px`,
						zIndex: 9999
					}}
					className={`rounded-xl bg-white shadow-2xl border border-zinc-200/80 p-1.5 transition-transform transition-opacity duration-150 ease-out origin-top-left ${
						mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
					} ${contentClassName}`}
					onClick={(e) => e.stopPropagation()}
				>
					{content}
				</div>,
				document.body
			)}
		</div>
	)
}

export default Popover
