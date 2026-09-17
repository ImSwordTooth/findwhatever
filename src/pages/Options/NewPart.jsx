import React from 'preact/compat';

export const NewPart = ({ children }) => {
	return (
		<div className="rounded-xl p-4 my-5 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200/80 dark:border-emerald-800/40 text-zinc-700 dark:text-zinc-300 text-xs leading-relaxed">
			<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2.5 select-none">
				<span>✨</span>
				<span>NEW</span>
			</div>
			<div>{children}</div>
		</div>
	)
}
