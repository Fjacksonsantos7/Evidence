import '../src/app.postcss';
import WithUSQL from '../src/lib/storybook-helpers/WithUSQL.svelte';
/** @type { import('@storybook/svelte').Preview } */
const preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		}
	},
	argTypes: {
		data: { table: { disable: true } },
		evidenceInclude: { table: { disable: true } },
		series: { table: { disable: true } }
	},
	decorators: [() => WithUSQL]
};

export default preview;
