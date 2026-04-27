<template>
	<VChart v-if="props.histogramData?.length" :option="chartOption" :style="{ height: chartHeight }" autoresize />
	<div
		v-else
		:style="{ height: chartHeight }"
		class="flex items-center justify-center text-xs text-surface-400 italic"
	>
		No data
	</div>
</template>

<script setup>
const props = defineProps({
	histogramData: {
		type: Array,
		default: () => [
			{ bin_start: 0.0, bin_end: 0.05, count: 4 },
			{ bin_start: 0.05, bin_end: 0.1, count: 48 },
		],
	},
	chartHeight: { type: String, default: '80px' },
})

const chartOption = computed(() => {
	const bins = props.histogramData

	const barData = bins.map(b => ({
		binEnd: b.bin_end.toFixed(4),
		binStart: b.bin_start.toFixed(4),
		value: [+((b.bin_start + b.bin_end) / 2).toFixed(5), b.count],
	}))

	return {
		tooltip: {
			confine: true,
			trigger: 'item',
			borderColor: '#94a3b8',
			textStyle: { fontSize: 14, fontFamily: 'Lexend Deca' },
			formatter: params =>
				`Range: ${params.data.binStart} – ${params.data.binEnd}<br/>Count: <b>${params.data.value[1]}</b>`,
		},
		grid: { top: 1, right: 1, bottom: 5, left: 1 },
		xAxis: {
			min: 0,
			max: 1,
			show: false,
			type: 'value',
			axisTick: { show: false },
			splitLine: { show: false },
		},
		yAxis: {
			show: false,
			type: 'value',
			minInterval: 1,
			splitLine: { show: false },
		},
		series: [
			{
				type: 'bar',
				data: barData,
				barMaxWidth: 12,
				itemStyle: {
					color: '#1F6F78',
					borderRadius: [2, 2, 0, 0],
				},
				emphasis: { itemStyle: { color: 'rgba(31, 111, 120, 0.7)', opacity: 1 } },
			},
		],
	}
})
</script>
