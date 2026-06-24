import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
	server: {
		port: 5174,
		host: true,
		allowedHosts: ['frontend-dev.work-circle.com'],
	},
	resolve: {
		tsconfigPaths: true,
		dedupe: ['react', 'react-dom'],
	},
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'@radix-ui/react-switch',
			'@radix-ui/react-progress',
			'@radix-ui/react-slot',
		],
	},
	plugins: [
    devtools(),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
