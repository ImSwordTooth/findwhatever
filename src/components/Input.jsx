"use client";
import * as React from "react";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

const Input = React.forwardRef(({ className, type, children, ...props }, ref) => {
	const { isShowRing, ringColor, textWidth } = props
	const radius = 100; // change this to increase the radius of the hover effect
	const [visible, setVisible] = React.useState(false);

	let mouseX = useMotionValue(0);
	let mouseY = useMotionValue(0);
	const background = useMotionTemplate`radial-gradient(${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px, ${ringColor}, transparent 60%)`

	const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
		let { left, top } = currentTarget.getBoundingClientRect();

		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	const cn = (...inputs) => {
		return twMerge(clsx(inputs))
	}

	const InnerContent = () => {
		return (
			<>
				<input
					type={type}
					className={cn(
						`flex h-[32px] w-full border-none bg-[#f1f1f1] dark:bg-zinc-800 dark:selection:bg-[rgba(255,255,255,0.2)] text-black dark:text-white rounded-md py-1 pl-8 pr-3 text-xs file:border-0 file:bg-transparent
        					file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600
        					focus-visible:outline-none focus-visible:outline-1 focus-visible:ring-[2px]  focus-visible:ring-[#e5e5e5] dark:focus-visible:ring-[#313131]
         					disabled:cursor-not-allowed disabled:opacity-50
         					group-hover/input:shadow-none transition duration-400 pr-[184px]
         					`, className
					)}
					style={{ width: `${textWidth || 340}px` }}
					ref={ref}
					{...props}
				/>
				{children}
			</>
		)
	}

	if (isShowRing) {
		return (
			<motion.div
				style={{
					background
				}}
				onMouseMove={handleMouseMove}
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				className="relative p-[2px] rounded-lg transition duration-300 group/input"
			>
				{InnerContent()}
			</motion.div>
		)
	} else {
		return (
			<div className="relative p-[2px] rounded-lg transition duration-300 group/input">
				{InnerContent()}
			</div>
		)
	}
});

Input.displayName = "Input";

export {Input};
