import colors from 'tailwindcss/colors.js';

/** @typedef {import('./schemas/types.js').ThemesConfig} ThemesConfig */

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
			secondary: {
				light: colors.slate[600],
				dark: colors.slate[400]
			},
			'secondary-content': {
				light: colors.slate[50],
				dark: colors.slate[950]
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
			'base-content': {
				light: colors.zinc[900],
				dark: colors.zinc[100]
			},
			'base-content-muted': {
				light: colors.zinc[600],
				dark: colors.zinc[400]
			},
			neutral: {
				light: colors.neutral[500],
				dark: colors.neutral[400]
			},
			'neutral-content': {
				light: colors.zinc[50],
				dark: colors.zinc[950]
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
					'hsla(160, 40%, 46%, 1)', // Green
					// TODO should we get rid of these gray scale colors?
					// Grey Scale
					'#71777d',
					'#7e848a',
					'#8c9196',
					'#9a9fa3',
					'#a8acb0',
					'#b7babd',
					'#c5c8ca',
					'#d4d6d7',
					'#e3e4e5',
					'#f3f3f3'
				],
				dark: [
					'hsla(207, 85%, 65%, 1)', // Navy -> Bright Blue
					'hsla(195, 69%, 61%, 1)', // Teal -> Brighter Teal
					'hsla(207, 89%, 89%, 1)', // Light Blue -> Nearly White Blue
					'hsla(202, 38%, 75%, 1)', // Grey -> Lighter Grey
					'hsla(179, 57%, 75%, 1)', // Light Green -> Brighter Mint
					'hsla(40, 50%, 85%, 1)', // Tan -> Pale Gold
					'hsla(38, 99%, 72%, 1)', // Yellow -> Vibrant Yellow
					'hsla(342, 60%, 65%, 1)', // Maroon -> Bright Pink
					'hsla(207, 96%, 80%, 1)', // Blue -> Vivid Sky Blue
					'hsla(160, 60%, 56%, 1)', // Green -> Bright Mint
					// TODO should we get rid of these gray scale colors?
					// Grey Scale
					'#f3f3f3',
					'#e3e4e5',
					'#d4d6d7',
					'#c5c8ca',
					'#b7babd',
					'#a8acb0',
					'#9a9fa3',
					'#8c9196',
					'#7e848a',
					'#71777d'
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
