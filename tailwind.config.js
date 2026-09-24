const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");
const defaultTheme = require("tailwindcss/defaultTheme");

function rem2px(input, fontSize = 16) {
	if (input == null) {
		return input;
	}
	switch (typeof input) {
		case "object":
			if (Array.isArray(input)) {
				return input.map((val) => rem2px(val, fontSize));
			} else {
				const ret = {};
				for (const key in input) {
					ret[key] = rem2px(input[key]);
				}
				return ret;
			}
		case "string":
			return input.replace(
				/(\d*\.?\d+)rem$/,
				(_, val) => parseFloat(val) * fontSize + "px"
			);
		default:
			return input;
	}
}

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
		spacing: rem2px(defaultTheme.spacing),
		borderRadius: rem2px(defaultTheme.borderRadius),
		columns: rem2px(defaultTheme.columns),
		fontSize: rem2px(defaultTheme.fontSize),
		lineHeight: rem2px(defaultTheme.lineHeight),
		maxWidth: rem2px(defaultTheme.maxWidth),
		maxHeight: rem2px(defaultTheme.maxHeight),
		minWidth: {
			...rem2px(defaultTheme.minWidth),
			'2.5': "10px",
			8: "32px"
		},
		minHeight: {
			...rem2px(defaultTheme.minHeight),
			4: "16px",
			8: "32px"
		},
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
