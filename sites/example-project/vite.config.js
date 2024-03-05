import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['echarts-stat', 'echarts'],
		exclude: ['svelte-icons']
	},
	ssr: {
		external: [
			'@evidence-dev/db-orchestrator',
			'@evidence-dev/telemetry',
			'blueimp-md5',
			'@evidence-dev/plugin-connector'
		]
	},
	server: {
		fs: {
			strict: process.env.NODE_ENV !== 'development'
		}
	},
	build: {
		rollupOptions: {
			external: [/^@evidence-dev\/tailwind\/fonts\//]
		}
	}
};

export default config;
