<template>
	<div class="flex items-center h-full w-full">
		<!-- 1. The Median (Stock Ticker Style) -->
		<div class="flex flex-col items-center justify-center mr-2 shrink-0 pt-2">
			<span class="text-sm font-bold leading-none" :class="getTextColor(props.plotData.median)">
				{{ props.plotData.median || 'NA' }}
			</span>
			<span class="text-[9px] text-gray-500 uppercase font-medium tracking-wider">
				{{ props.textlabel }}
			</span>
		</div>

		<!-- Vertical Divider -->
		<div class="h-12 w-px bg-gray-700 mr-2 shrink-0"></div>

		<!-- 2. Your Heatmap Component -->
		<div class="flex-1 h-full">
			<HeatmapChart :plotData="plotData" :chartType="props.chartType" showAll />
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	textlabel: { type: String, default: 'Median' },
	plotData: {
		type: Object,
		default: () => ({
			categories: [
				'CADD',
				'CSCAPE',
				'DANN',
				'FATMKL',
				'FATXF',
				'GPN',
				'GWRVIS',
				'JARVIS',
				'LINSIG',
				'NCER',
				'ORION',
				'REMM',
			],
			data: Array.from({ length: 12 }).map((_, i) => [i, 0, Number(Math.random().toFixed(2))]),
		}),
	},
	chartType: { type: String },
})

// Color Logic for Text
const getTextColor = val => {
	if (val === null) return 'text-gray-400' // NA/Null
	if (val >= 0.7) return 'text-red-400' // High/Pathogenic
	if (val >= 0.4) return 'text-yellow-400' // Medium
	return 'text-blue-300' // Low/Benign
}
</script>
