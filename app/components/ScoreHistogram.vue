<template>
	<div class="grid grid-cols-1 sm:grid-cols-7 xl:grid-cols-3 2xl:grid-cols-10 gap-4">
		<div
			v-for="entry in histogramData"
			:key="entry.score"
			class="rounded-lg bg-white dark:bg-surface-900 dark:border-surface-700"
		>
			<!-- Score Label -->
			<p class="text-xs font-semibold text-surface-700 dark:text-surface-200 mb-1 text-center">
				{{ entry.score }}
			</p>

			<!-- Chart -->
			<VChart
				v-if="entry.bins?.length"
				:option="buildChartOption(entry)"
				:style="{ height: chartHeight }"
				autoresize
			/>
			<div
				v-else
				class="flex items-center justify-center text-xs text-surface-400 italic"
				:style="{ height: chartHeight }"
			>
				No data
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	// Array of { score: string, bins: [{ bin_start, bin_end, count }] }
	histogramData: {
		type: Array,
		required: true,
		default: () => [],
	},
	// Optional: { SCORE_NAME: value } map to draw marker lines per score
	// e.g. { GPN: 0.52, DANN: 0.81 }
	markerValues: {
		type: Object,
		default: () => ({}),
	},
	chartHeight: {
		type: String,
		default: '100px',
	},
})

const buildChartOption = (entry) => {
	const bins = entry.bins

	// Use bin midpoint as x, count as y
	const xData = bins.map((b) => +((b.bin_start + b.bin_end) / 2).toFixed(4))
	const yData = bins.map((b) => b.count)

	const markerVal = props.markerValues?.[entry.score] ?? null

	return {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'axis',
			confine: true,
			formatter: (params) => {
				const idx = params[0].dataIndex
				const bin = bins[idx]
				return `<b>${entry.score}</b><br/>
                        Range: ${bin.bin_start.toFixed(4)} – ${bin.bin_end.toFixed(4)}<br/>
                        Count: <b>${bin.count}</b>`
			},
		},
		grid: { top: 8, right: 12, bottom: 28, left: 42 },
		xAxis: {
			type: 'category', // ← category so bins stay evenly spaced
			data: xData,
			axisLabel: {
				fontSize: 10,
				color: '#9ca3af',
				rotate: 30,
				formatter: (v) => Number(v).toFixed(2),
			},
			splitLine: { show: false },
			axisTick: { show: false },
			boundaryGap: false, // ← line starts from first point, not offset
		},
		yAxis: {
			type: 'value',
			axisLabel: { fontSize: 10, color: '#9ca3af' },
			splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
			minInterval: 1,
		},
		series: [
			{
				type: 'line',
				data: yData,
				smooth: true, // ← smooth curve
				symbol: 'circle',
				symbolSize: 5,
				lineStyle: { color: '#6366f1', width: 2 },
				itemStyle: { color: '#6366f1' },
				areaStyle: {
					// ← fills area under the curve
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{ offset: 0, color: 'rgba(99,102,241,0.35)' },
							{ offset: 1, color: 'rgba(99,102,241,0.02)' },
						],
					},
				},
				markLine:
					markerVal !== null
						? {
								silent: true,
								symbol: 'none',
								data: [
									{
										xAxis: xData.reduce((prev, curr) =>
											Math.abs(curr - markerVal) < Math.abs(prev - markerVal) ? curr : prev,
										),
										lineStyle: { color: '#ef4444', width: 1.5, type: 'dashed' },
										label: {
											formatter: `${markerVal}`,
											position: 'insideEndTop',
											fontSize: 10,
											color: '#ef4444',
										},
									},
								],
							}
						: undefined,
			},
		],
	}
}

// const buildChartOption = (entry) => {
// 	const bins = entry.bins
// 	const binWidth = bins.length > 1 ? (bins[0].bin_end - bins[0].bin_start) * 0.92 : 0.01

// 	const barData = bins.map((b) => ({
// 		value: [+((b.bin_start + b.bin_end) / 2).toFixed(5), b.count],
// 		binStart: b.bin_start.toFixed(4),
// 		binEnd: b.bin_end.toFixed(4),
// 	}))

// 	const markerVal = props.markerValues?.[entry.score] ?? null

// 	return {
// 		backgroundColor: 'transparent',
// 		tooltip: {
// 			trigger: 'item',
// 			confine: true,
// 			formatter: (params) =>
// 				`<b>${entry.score}</b><br/>
//                  Range: ${params.data.binStart} – ${params.data.binEnd}<br/>
//                  Count: <b>${params.data.value[1]}</b>`,
// 		},
// 		grid: { top: 8, right: 12, bottom: 28, left: 42 },
// 		xAxis: {
// 			type: 'value',
// 			axisLabel: {
// 				fontSize: 10,
// 				color: '#9ca3af',
// 				formatter: (v) => v.toFixed(2),
// 			},
// 			splitLine: { show: false },
// 			axisTick: { show: false },
// 			min: 0,
// 			max: 1,
// 		},
// 		yAxis: {
// 			type: 'value',
// 			axisLabel: { fontSize: 10, color: '#9ca3af' },
// 			splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
// 			minInterval: 1,
// 		},
// 		series: [
// 			{
// 				type: 'bar',
// 				data: barData,
// 				itemStyle: {
// 					color: '#6366f1',
// 					opacity: 0.82,
// 					borderRadius: [2, 2, 0, 0],
// 				},
// 				emphasis: {
// 					itemStyle: { color: '#4f46e5', opacity: 1 },
// 				},
// 			},
// 		],
// 	}
// }
</script>
