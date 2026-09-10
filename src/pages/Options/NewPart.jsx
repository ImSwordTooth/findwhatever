import React from 'preact/compat';

export const NewPart = ({ children }) => {
	return (
		<div className="newPart">
			<div className="new">new</div>
			{children}
		</div>
	)
}
