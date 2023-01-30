import { sveltekit } from "@sveltejs/kit/vite"

const config = {
    plugins: [sveltekit()],
    optimizeDeps: {
        include: ['echarts-stat'],
        exclude: ['@evidence-dev/components']
    },
    ssr: {
        external: ['@evidence-dev/db-orchestrator', '@evidence-dev/telemetry', 'blueimp-md5']
    }
}

export default config