module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier', 'plugin:svelte/recommended'],
	overrides: [{ files: ['*.spec.js', '*.spec.cjs'], env: { jest: true } }],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		"no-self-assign": "off"
	}
};
