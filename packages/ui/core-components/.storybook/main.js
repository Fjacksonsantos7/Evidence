import { mergeConfig } from 'vite';

/** @type { import('@storybook/sveltekit').StorybookConfig } */
const config = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-svelte-csf'
	],
	core: {
		builder: '@storybook/builder-vite'
	},
	async viteFinal(config) {
		return mergeConfig(config, {
			server: {
				fs: {
					strict: false
				}
			}
		});
	},
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	docs: {
		autodocs: 'tag'
	},
	staticDirs: ['../static']
};
export default config;
