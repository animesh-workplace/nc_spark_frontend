<template>
	<div class="flex items-center gap-3 h-14 w-full max-w-lg">
		<!-- 1. The Master Badge -->
		<div
			class="w-12 h-12 shrink-0 rounded-lg flex flex-col items-center justify-center shadow-lg border border-white/10"
			:class="getBadgeStyle(medianValue)"
		>
			<span class="font-bold text-white text-sm">
				{{ medianValue.toFixed(2) }}
			</span>
		</div>

		<!-- 2. Your Heatmap Component -->
		<!-- We reduce opacity slightly to make the badge pop -->
		<div class="flex-1 h-full opacity-90 hover:opacity-100 transition-opacity">
			<HeatmapChart :plotData="plotData" />
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
// import HeatmapChart from './HeatmapChart.vue';

const props = defineProps({
	plotData: {
		type: Object,
		default: () => ({
			categories: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
			data: Array.from({ length: 7 }).map((_, i) => [i, 0, Number(Math.random().toFixed(2))]),
		}),
	},
})

const medianValue = computed(() => {
	if (!props.plotData || !props.plotData.data) return 0
	const values = props.plotData.data.map((item) => item[2])
	if (values.length === 0) return 0
	values.sort((a, b) => a - b)
	const mid = Math.floor(values.length / 2)
	return values.length % 2 !== 0 ? values[mid] : (values[mid - 1] + values[mid]) / 2
})

// Color Logic for Background Badge
const getBadgeStyle = (val) => {
	if (val >= 0.7) return 'bg-red-600' // High
	if (val >= 0.4) return 'bg-amber-600' // Medium
	return 'bg-blue-600' // Low
}
</script>
