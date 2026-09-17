import { createContext, useContext } from 'preact/compat'

const RadioContext = createContext(null)

export const RadioGroup = ({ value, onChange, children, className = '' }) => {
	return (
		<RadioContext.Provider value={{ value, onChange }}>
			<div className={`inline-flex items-center gap-5 flex-wrap ${className}`}>
				{children}
			</div>
		</RadioContext.Provider>
	)
}

export const Radio = ({ value, children, disabled = false, className = '' }) => {
	const ctx = useContext(RadioContext)
	const checked = ctx ? ctx.value === value : false

	const handleChange = () => {
		if (disabled) return
		if (ctx && ctx.onChange) {
			ctx.onChange({ target: { value } })
		}
	}

	return (
		<label
			className={`group inline-flex items-center gap-2 cursor-pointer select-none text-sm transition-colors py-0.5 ${
				disabled
					? 'opacity-40 cursor-not-allowed text-zinc-400'
					: checked
					? 'text-zinc-900 font-medium'
					: 'text-zinc-600 hover:text-zinc-900'
			} ${className}`}
		>
			<input
				type="radio"
				checked={checked}
				disabled={disabled}
				onChange={handleChange}
				className="sr-only"
			/>
			<span
				className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 bg-white ${
					checked
						? 'border-rose-500 shadow-2xs ring-2 ring-rose-500/20'
						: 'border-zinc-300 group-hover:border-zinc-400'
				}`}
			>
				<span
					className={`w-2 h-2 rounded-full bg-rose-500 transition-all duration-150 ${
						checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
					}`}
				/>
			</span>
			<span>{children}</span>
		</label>
	)
}

Radio.Group = RadioGroup

