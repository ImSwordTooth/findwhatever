export const Switch = ({
	checked = false,
	onChange,
	disabled = false,
	size = 'small',
	className = ''
}) => {
	const isSmall = size === 'small'

	const handleClick = (e) => {
		e.preventDefault()
		if (disabled) return
		if (onChange) {
			onChange(!checked)
		}
	}

	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={handleClick}
			className={`relative inline-flex items-center shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 ${
				isSmall ? 'h-5 w-9 p-[2px]' : 'h-6 w-11 p-[2px]'
			} ${
				checked ? 'bg-rose-500' : 'bg-zinc-200'
			} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
		>
			<span
				className={`pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out shrink-0 ${
					isSmall
						? `h-4 w-4 ${checked ? 'translate-x-4' : 'translate-x-0'}`
						: `h-5 w-5 ${checked ? 'translate-x-5' : 'translate-x-0'}`
				}`}
			/>
		</button>
	)
}
