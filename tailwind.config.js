const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx,html}"
	],
	darkMode: "class",
	corePlugins: {
		preflight: false
	},
	theme: {
		extend: {
			spacing: {
				'20px': '20px',
			},
			margin: {
				'-0.5': '-2px',
				'0.5': '2px',
				'1.5': '6px',
			},
			padding: {
				'0.5': '2px',
			},
			minWidth: {
				'2.5': "10px",
			},
			minHeight: {
				'2.5': "10px",
			},
			width: {
				'2.5': '10px',
				'3.5': '14px',
			},
			height: {
				'2.5': '10px',
				'3.5': '14px',
			},
			boxShadow: {
				input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
			},
		},
	},
	plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

	addBase({
		":root": newVars,
	});
}
