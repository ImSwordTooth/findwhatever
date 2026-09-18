/**
 * SettingCard & SettingRow
 * 现代化设置表单卡片组件
 */

export const SettingCard = ({
	title,
	description,
	children,
	className = '',
	headerExtra,
	...props
}) => {
	return (
		<div className={`my-4 ${className}`} {...props}>
			{(title || description || headerExtra) && (
				<div className="flex items-center justify-between mb-2 px-1">
					<div>
						{title && (
							<h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 font-mono tracking-tight">
								{title}
							</h3>
						)}
						{description && (
							<p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
								{description}
							</p>
						)}
					</div>
					{headerExtra && <div>{headerExtra}</div>}
				</div>
			)}
			<div className="setting-card">
				{children}
			</div>
		</div>
	)
}

export const SettingRow = ({
	label,
	tip,
	children,
	standalone = false,
	className = '',
	...props
}) => {
	const content = (
		<>
			{label !== undefined ? (
				<div className="flex flex-col gap-0.5 min-w-0 pr-4 flex-1">
					<div className="text-[14px] font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
						{label}
					</div>
					{tip && (
						<div className="text-[12px] text-zinc-400 dark:text-zinc-500 font-normal">
							{tip}
						</div>
					)}
				</div>
			) : null}
			{children !== undefined ? (
				<div className="shrink-0 flex items-center justify-end">
					{children}
				</div>
			) : null}
		</>
	)

	if (standalone) {
		return (
			<div className={`setting-card my-3.5 ${className}`} {...props}>
				<div className="setting-row-item">
					{content}
				</div>
			</div>
		)
	}

	return (
		<div className={`setting-row-item ${className}`} {...props}>
			{content}
		</div>
	)
}

export const ColorPickerButton = ({ color, className = '', ...props }) => {
	return (
		<div
			className={`color-picker inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-solid border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all font-mono text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-sm select-none ${className}`}
			{...props}
		>
			<span
				className="color-block w-3.5 h-3.5 rounded shadow-xs border border-solid border-black/10 shrink-0 inline-block"
				style={{ backgroundColor: color }}
			/>
			<span>{color}</span>
		</div>
	)
}
