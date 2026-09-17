export const Slider = ({
	min = 0,
	max = 100,
	step = 1,
	value = 0,
	onChange,
	disabled = false,
	style,
	className = ''
}) => {
	const handleInput = (e) => {
		const num = Number(e.target.value)
		if (onChange) {
			onChange(num)
		}
	}

	return (
		<div className={`inline-flex items-center ${className}`} style={style}>
			<input
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				disabled={disabled}
				onInput={handleInput}
				className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
			/>
		</div>
	)
}
