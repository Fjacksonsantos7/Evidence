import colors from 'tailwindcss/colors.js';

/** @typedef {import('../schemas/types.js').ThemesConfig} ThemesConfig */

/** @type {ThemesConfig} */
export const defaultThemesConfig = {
	themes: {
		defaultAppearance: 'light',
		appearanceSwitcher: false,
		colors: {
			primary: {
				light: colors.blue[600],
				dark: colors.blue[400]
			},
			'primary-content': {
				light: colors.blue[50],
				dark: colors.blue[950]
			},
			accent: {
				light: colors.orange[700],
				dark: colors.orange[300]
			},
			'accent-content': {
				light: colors.orange[50],
				dark: colors.orange[950]
			},
			'base-100': {
				light: colors.white,
				dark: colors.zinc[950]
			},
			'base-200': {
				light: colors.zinc[50],
				dark: colors.zinc[900]
			},
			'base-300': {
				light: colors.zinc[200],
				dark: colors.zinc[700]
			},
			'base-heading': {
				light: colors.zinc[900],
				dark: colors.zinc[100]
			},
			'base-content': {
				light: colors.zinc[800],
				dark: colors.zinc[200]
			},
			'base-content-muted': {
				light: colors.zinc[600],
				dark: colors.zinc[400]
			},
			info: {
				light: colors.sky[600],
				dark: colors.sky[400]
			},
			'info-content': {
				light: colors.zinc[50],
				dark: colors.zinc[950]
			},
			positive: {
				light: colors.green[600],
				dark: colors.green[400]
			},
			'positive-content': {
				light: colors.zinc[50],
				dark: colors.zinc[950]
			},
			warning: {
				light: colors.yellow[500],
				dark: colors.amber[400]
			},
			'warning-content': {
				light: colors.zinc[50],
				dark: colors.zinc[950]
			},
			negative: {
				light: colors.red[600],
				dark: colors.red[400]
			},
			'negative-content': {
				light: colors.zinc[50],
				dark: colors.zinc[950]
			}
		},
		colorPalettes: {
			default: {
				light: [
					'hsla(207, 65%, 39%, 1)', // Navy
					'hsla(195, 49%, 51%, 1)', // Teal
					'hsla(207, 69%, 79%, 1)', // Light Blue
					'hsla(202, 28%, 65%, 1)', // Grey
					'hsla(179, 37%, 65%, 1)', // Light Green
					'hsla(40, 30%, 75%, 1)', // Tan
					'hsla(38, 89%, 62%, 1)', // Yellow
					'hsla(342, 40%, 40%, 1)', // Maroon
					'hsla(207, 86%, 70%, 1)', // Blue
					'hsla(160, 40%, 46%, 1)' // Green
				],
				dark: [
					'hsla(207, 65%, 39%, 1)', // Navy
					'hsla(195, 49%, 51%, 1)', // Teal
					'hsla(207, 69%, 79%, 1)', // Light Blue
					'hsla(202, 28%, 65%, 1)', // Grey
					'hsla(179, 37%, 65%, 1)', // Light Green
					'hsla(40, 30%, 75%, 1)', // Tan
					'hsla(38, 89%, 62%, 1)', // Yellow
					'hsla(342, 40%, 40%, 1)', // Maroon
					'hsla(207, 86%, 70%, 1)', // Blue
					'hsla(160, 40%, 46%, 1)' // Green
				]
			}
		},
		colorScales: {
			default: {
				light: ['lightblue', 'darkblue'],
				dark: ['lightblue', 'darkblue']
			}
		}
	}
};
