export const InputNumber = ({
	value = 0,
	onChange,
	min,
	max,
	step = 1,
	addonAfter,
	disabled = false,
	style,
	className = ''
}) => {
	const clamp = (val) => {
		let num = Number(val)
		if (isNaN(num)) num = min !== undefined ? min : 0
		if (min !== undefined && num < min) num = min
		if (max !== undefined && num > max) num = max
		return num
	}

	const handleChange = (e) => {
		const raw = e.target.value
		if (raw === '') {
			if (onChange) onChange(min !== undefined ? min : 0)
			return
		}
		const num = Number(raw)
		if (isNaN(num)) return
		if (onChange) onChange(clamp(num))
	}

	return (
		<div
			className={`inline-flex items-center h-7 px-2.5 rounded-md bg-zinc-100/80 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/90 focus-within:bg-zinc-100 dark:focus-within:bg-zinc-800 focus-within:ring-1 focus-within:ring-rose-400/60 transition-all ${
				disabled ? 'opacity-50 cursor-not-allowed' : ''
			} ${className}`}
			style={style}
		>
			<input
				type="number"
				min={min}
				max={max}
				step={step}
				value={value}
				disabled={disabled}
				onChange={handleChange}
				className="w-full bg-transparent border-none text-[13px] font-mono text-zinc-800 dark:text-zinc-100 outline-none min-w-0 text-right pr-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
			/>
			{addonAfter && (
				<span className="shrink-0 text-[13px] font-mono text-zinc-500 dark:text-zinc-400 select-none">
					{addonAfter}
				</span>
			)}
		</div>
	)
}
