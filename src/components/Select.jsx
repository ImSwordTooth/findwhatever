export const Select = ({
	value,
	onChange,
	options = [],
	size = 'small',
	disabled = false,
	className = ''
}) => {
	const handleChange = (e) => {
		const rawVal = e.target.value
		// 自动还原原始 options 中的原始数据类型（兼容 number，如 retentionTime: -1, 0, 5）
		const matched = options.find((o) => String(o.value) === String(rawVal))
		const finalVal = matched ? matched.value : rawVal
		if (onChange) {
			onChange(finalVal)
		}
	}

	return (
		<div className={`relative inline-flex items-center ${className}`}>
			<select
				value={value}
				onChange={handleChange}
				disabled={disabled}
				className="appearance-none bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs rounded-lg pl-2.5 pr-7 py-1 shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 cursor-pointer transition-colors"
			>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-zinc-400">
				<svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fillRule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
		</div>
	)
}
