"use client";
import { forwardRef, useState, useRef } from "preact/compat";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const cn = (...inputs) => twMerge(clsx(inputs));

const Input = forwardRef(({ className, type, children, isShowRing, textWidth, ...props }, ref) => {
	const radius = 100;
	const [visible, setVisible] = useState(false);
	const rectRef = useRef(null);

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const background = useMotionTemplate`radial-gradient(${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px, var(--swe-color-primary), transparent 60%)`;

	const handleMouseEnter = (e) => {
		rectRef.current = e.currentTarget.getBoundingClientRect();
		setVisible(true);
	};

	const handleMouseMove = (e) => {
		if (!rectRef.current) {
			rectRef.current = e.currentTarget.getBoundingClientRect();
		}
		mouseX.set(e.clientX - rectRef.current.left);
		mouseY.set(e.clientY - rectRef.current.top);
	};

	const handleMouseLeave = () => {
		rectRef.current = null;
		setVisible(false);
	};

	return (
		<motion.div
			style={isShowRing ? { background } : undefined}
			onMouseMove={isShowRing ? handleMouseMove : undefined}
			onMouseEnter={isShowRing ? handleMouseEnter : undefined}
			onMouseLeave={isShowRing ? handleMouseLeave : undefined}
			className="relative p-[2px] rounded-lg transition duration-300 group/input"
		>
			<input
				type={type}
				className={cn(
					`flex h-[32px] w-full border-none bg-[#f1f1f1] dark:bg-zinc-800 dark:selection:bg-[rgba(255,255,255,0.2)] text-black dark:text-white rounded-md py-1 pl-8 pr-3 text-xs file:border-0 file:bg-transparent
					file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder:text-neutral-500
					focus-visible:outline-none focus-visible:outline-1 focus-visible:ring-[2px] focus-visible:ring-[#e5e5e5] dark:focus-visible:ring-[#313131]
					disabled:cursor-not-allowed disabled:opacity-50
					group-hover/input:shadow-none transition duration-400 pr-[184px]`,
					className
				)}
				style={{ width: `${textWidth || 380}px` }}
				ref={ref}
				{...props}
			/>
			{/* 右侧长文本平滑羽化遮罩：纯色渐变叠加于文字上层，input 背景 100% 完整实体，零镂空，彻底规避光圈穿透 */}
			<div
				className="pointer-events-none absolute right-[182px] top-[2px] bottom-[2px] w-7 bg-gradient-to-r from-transparent to-[#f1f1f1] dark:to-zinc-800 z-10"
				aria-hidden="true"
			/>
			{children}
		</motion.div>
	);
});

Input.displayName = "Input";

export { Input };
