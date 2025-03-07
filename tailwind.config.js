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
		"./src/**/*.{js,jsx}"
	],
	darkMode: "class",
	corePlugins: {
		preflight: false
	},
	// important: true,
	theme: {
		// rest of the code
		borderRadius: rem2px(defaultTheme.borderRadius),
		columns: rem2px(defaultTheme.columns),
		fontSize: rem2px(defaultTheme.fontSize),
		lineHeight: rem2px(defaultTheme.lineHeight),
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
		margin: {
			1: '4px',
			2: '8px',
			'-0.5': '-2px',
			'0.5': '2px',
			'auto': 'auto',
			'1.5': '6px'
		},
		padding: {
			1: '4px',
			8: '32px',
			3: '12px',
			'0.5': '2px'
		},
		width: {
			'2.5': '10px',
			'3.5': '14px',
			3: '12px',
			4: '16px',
			5: '20px',
			6: '24px',
			20: '80px',
			'full': '100%'
		},
		height: {
			'2.5': '10px',
			'3.5': '14px',
			3: '12px',
			4: '16px',
			5: '20px',
			6: '24px',
			7: '28px',
		},
		inset: {
			0: '0px',
			1: '4px',
			3: '12px'
		},
		extend: {
			boxShadow: {
				input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
			},
		},
	},
	plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme}) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

	addBase({
		":root": newVars,
	});
}
