import { useEffect, useRef } from 'preact/compat'

export const SparkCanvas = ({ trigger = false, onComplete }) => {
	const canvasRef = useRef(null)

	useEffect(() => {
		if (!trigger) return

		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const width = (canvas.width = canvas.offsetWidth)
		const height = (canvas.height = canvas.offsetHeight)

		const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#38bdf8']
		const particleCount = 45
		const particles = []

		const originX = width / 2
		const originY = height / 2

		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2
			const speed = 2 + Math.random() * 5
			particles.push({
				x: originX,
				y: originY,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed - 1.5,
				gravity: 0.12,
				size: 2.5 + Math.random() * 3.5,
				color: colors[Math.floor(Math.random() * colors.length)],
				alpha: 1,
				decay: 0.015 + Math.random() * 0.02,
				rotation: Math.random() * 360,
				vr: (Math.random() - 0.5) * 10
			})
		}

		let animId = null

		const render = () => {
			ctx.clearRect(0, 0, width, height)
			let alive = false

			for (const p of particles) {
				if (p.alpha <= 0) continue
				alive = true

				p.x += p.vx
				p.y += p.vy
				p.vy += p.gravity
				p.alpha -= p.decay
				p.rotation += p.vr

				ctx.save()
				ctx.translate(p.x, p.y)
				ctx.rotate((p.rotation * Math.PI) / 180)
				ctx.globalAlpha = Math.max(0, p.alpha)
				ctx.fillStyle = p.color
				ctx.shadowBlur = 6
				ctx.shadowColor = p.color
				ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4)
				ctx.restore()
			}

			if (alive) {
				animId = requestAnimationFrame(render)
			} else {
				ctx.clearRect(0, 0, width, height)
				onComplete?.()
			}
		}

		animId = requestAnimationFrame(render)

		return () => {
			if (animId) cancelAnimationFrame(animId)
		}
	}, [trigger])

	return (
		<canvas
			ref={canvasRef}
			className="absolute inset-0 pointer-events-none w-full h-full z-20"
		/>
	)
}
