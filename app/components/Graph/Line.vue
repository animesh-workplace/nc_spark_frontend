<template>
	<!-- Chart -->
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
		required: true,
		default: () => [
			{ bin_start: 0.0, bin_end: 0.05, count: 4 },
			{ bin_start: 0.05, bin_end: 0.1, count: 48 },
		],
	},
	chartHeight: { type: String, default: '80px' },
})

const chartOption = computed(() => {
	const bins = props.histogramData

	// Use bin midpoint as x, count as y
	const xData = bins.map(b => +((b.bin_start + b.bin_end) / 2).toFixed(4))
	const yData = bins.map(b => b.count)

	// Find closest x tick to the marker value
	const markerVal = props.markerValue
	const closestX =
		markerVal !== null
			? xData.reduce(
					(prev, curr) => (Math.abs(curr - markerVal) < Math.abs(prev - markerVal) ? curr : prev),
					xData[0], // ← initial value prevents crash on single-element arrays
			  )
			: null

	return {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			confine: true,
			formatter: params => {
				const idx = params[0].dataIndex
				const bin = bins[idx]
				return `Range: ${bin.bin_start.toFixed(4)} – ${bin.bin_end.toFixed(4)}<br/>Count: <b>${
					bin.count
				}</b>`
			},
		},
		grid: { top: 1, right: 1, bottom: 5, left: 1 },
		xAxis: {
			show: false,
			data: xData,
			type: 'category',
			boundaryGap: false,
			axisTick: { show: false },
			splitLine: { show: false },
			axisLabel: {
				rotate: 30,
				fontSize: 10,
				color: '#9ca3af',
				formatter: v => Number(v).toFixed(2),
			},
		},
		yAxis: {
			show: false,
			type: 'value',
			minInterval: 1,
			axisLabel: { fontSize: 10, color: '#9ca3af' },
			splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
		},
		series: [
			{
				type: 'line',
				data: yData,
				smooth: true,
				symbol: 'circle',
				symbolSize: 5,
				lineStyle: { color: '#1F6F78', width: 2 },
				itemStyle: { color: '#1F6F78' },
				areaStyle: {
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: 'rgba(31, 111, 120, 0.7)' },
							{ offset: 1, color: 'rgba(31, 111, 120, 0.02)' },
						],
					},
				},
			},
		],
	}
})
</script>
