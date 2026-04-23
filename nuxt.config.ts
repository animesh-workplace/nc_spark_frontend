import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'
import { definePreset } from '@primeuix/themes'

const nvTheme = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{blue.50}',
			100: '{blue.100}',
			200: '{blue.200}',
			300: '{blue.300}',
			400: '{blue.400}',
			500: '{blue.500}',
			600: '{blue.600}',
			700: '{blue.700}',
			800: '{blue.800}',
			900: '{blue.900}',
			950: '{blue.950}',
		},
	},
})

const higlassPlugins = [
	'higlass-vcf',
	'higlass-pileup',
	'higlass-gnomad',
	'higlass-dynseq',
	'higlass-clinvar',
	'higlass-register',
	'higlass-sequence',
	'higlass-multivec',
	'higlass-orthologs',
	'higlass-transcripts',
	'higlass-bigwig-datafetcher',
]

export default defineNuxtConfig({
	devServer: { port: 3012 },
	compatibilityDate: '2025-07-15',
	devtools: { enabled: false },
	vite: {
		optimizeDeps: {
			include: ['react', 'react-dom', 'higlass', 'echarts', 'echarts-gl', 'zrender', ...higlassPlugins],
		},
		ssr: {
			noExternal: ['react', 'react-dom', 'higlass', 'echarts', 'echarts-gl', 'zrender', ...higlassPlugins],
		},
		plugins: [tailwindcss()],
	},
	css: ['./app/assets/css/main.css'],
	app: {
		baseURL: '/nvpp/',
		head: {
			title:
				'Noncoding Variant Prioritization Portal | National Institute of Biomedical Genomics | BRIC-NIBMG',
			meta: [],
			link: [{ rel: 'icon', href: '/nvpp/favicon.ico' }],
		},
	},
	primevue: {
		options: {
			ripple: true,
			theme: { preset: nvTheme, options: { darkModeSelector: '.dark' } },
		},
		components: { include: [] },
	},
	build: { transpile: ['echarts', 'echarts-gl', 'zrender'] },
	modules: ['@nuxt/icon', '@nuxtjs/google-fonts', '@primevue/nuxt-module', 'nuxt-echarts', '@nuxt/image'],
	googleFonts: {
		preload: true,
		prefetch: true,
		useStylesheet: true,
		outputDir: 'app/assets',
		families: {
			Poppins: true,
			'Lexend+Deca': { wght: '100..900' },
			'DM+Sans': { wght: '100..900' },
			Fraunces: { wght: '100..900' },
		},
	},
	icon: { clientBundle: { scan: true }, serverBundle: { collections: ['solar', 'svg-spinners'] } },
	echarts: {
		renderer: ['canvas'],
		features: ['UniversalTransition'],
		charts: ['BarChart', 'PieChart', 'CustomChart', 'ScatterChart', 'HeatmapChart', 'LineChart', 'RadarChart'],
		components: [
			'GridComponent',
			'TitleComponent',
			'LegendComponent',
			'MatrixComponent',
			'DatasetComponent',
			'TooltipComponent',
			'ToolboxComponent',
			'VisualMapComponent',
			'DataZoomComponent',
			'MarkLineComponent',
		],
	},
})
