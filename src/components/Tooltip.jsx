import React, { useState, useRef } from 'preact/compat';

export const Tooltip = ({ title, children, placement = 'bottom', className = '' }) => {
	const [visible, setVisible] = useState(false);
	const timerRef = useRef(null);

	const handleMouseEnter = () => {
		timerRef.current = setTimeout(() => {
			setVisible(true);
		}, 80);
	};

	const handleMouseLeave = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		setVisible(false);
	};

	if (!title) return children;

	const isTop = placement.startsWith('top');
	const isRight = placement.endsWith('Right');

	const verticalClass = isTop ? 'bottom-full mb-2' : 'top-full mt-2';
	const horizontalClass = isRight ? 'right-0' : 'left-1/2 -translate-x-1/2';

	return (
		<div
			className={`relative inline-flex items-center ${visible ? 'z-[99999]' : ''} ${className}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{children}
			{visible && (
				<div
					className={`absolute ${verticalClass} ${horizontalClass} z-[99999] pointer-events-none transition-all duration-150`}
					style={{ width: 'max-content', maxWidth: '280px' }}
				>
					{isTop ? (
						<div
							className={`w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[rgba(0,0,0,0.85)] dark:border-t-[rgba(30,30,30,0.92)] absolute -bottom-1 ${
								isRight ? 'right-2.5' : 'left-1/2 -translate-x-1/2'
							}`}
						/>
					) : (
						<div
							className={`w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-[rgba(0,0,0,0.85)] dark:border-b-[rgba(30,30,30,0.92)] absolute -top-1 ${
								isRight ? 'right-2.5' : 'left-1/2 -translate-x-1/2'
							}`}
						/>
					)}
					<div className="bg-[rgba(39,39,39,0.92)] dark:bg-[rgb(64 62 62 / 92%)] backdrop-blur-[4px] text-[#ffffff] text-[11px] rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.35)] py-0.5 leading-normal whitespace-normal break-words">
						{title}
					</div>
				</div>
			)}
		</div>
	);
};
