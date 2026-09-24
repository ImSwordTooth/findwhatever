const remToPx = () => ({
	postcssPlugin: 'postcss-rem-to-pixel',
	Declaration(decl) {
		if (decl.value && decl.value.includes('rem')) {
			decl.value = decl.value.replace(
				/([+-]?\d*\.?\d+)\s*rem\b/g,
				(_, val) => `${Number((parseFloat(val) * 16).toFixed(3))}px`
			);
		}
	},
	AtRule(atRule) {
		if (atRule.params && atRule.params.includes('rem')) {
			atRule.params = atRule.params.replace(
				/([+-]?\d*\.?\d+)\s*rem\b/g,
				(_, val) => `${Number((parseFloat(val) * 16).toFixed(3))}px`
			);
		}
	},
});
remToPx.postcss = true;

module.exports = {
	plugins: [
		require('tailwindcss'),
		require('autoprefixer'),
		remToPx(),
	],
};

