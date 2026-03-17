<template>
	<div class="w-full flex flex-col items-center gap-3">
		<Skeleton height="22rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />

		<!-- Stats strip -->
		<div v-if="props.plotData.stats" class="flex gap-4 text-xs font-['Lexend_Deca'] text-slate-600">
			<span>
				🟢 Early score:
				<b>{{ props.plotData.stats.early_score }}</b>
			</span>
			<span>
				🔴 Late score:
				<b>{{ props.plotData.stats.late_score }}</b>
			</span>
			<span :class="props.plotData.stats.rt_score >= 0 ? 'text-green-600' : 'text-red-500'">
				RT score: <b>{{ props.plotData.stats.rt_score }}</b>
				{{ props.plotData.stats.rt_score >= 0 ? '(Early)' : '(Late)' }}
			</span>
			<span>
				Early Dominance PCT: <b>{{ props.plotData.stats.early_dominance_pct }}</b>
			</span>
			<span>
				G1B baseline: <b>{{ props.plotData.stats.g1b_baseline }}</b>
			</span>
		</div>
	</div>
</template>

<script setup>
const isLoading = ref(true)

const props = defineProps({
	plotData: {
		type: Object,
		default: () => ({
			indicator: [
				{ name: 'S1' },
				{ name: 'S2' },
				{ name: 'S3' },
				{ name: 'S4' },
				{ name: 'G1B' },
				{ name: 'G2' },
			],
			series_data: [],
		}),
	},
})

// Colour palette — individual rows get muted colours, Mean/Median stand out
const ROW_COLOR = 'rgba(148, 163, 184, 0.35)' // slate-400, very transparent
const MEAN_COLOR = 'rgba(99, 102, 241, 0.75)' // indigo-500
const MEDIAN_COLOR = 'rgba(34, 197, 94, 0.75)' // green-500

const chartOption = ref({})

const buildSeriesEntry = entry => {
	const isMean = entry.name === 'Mean'
	const isMedian = entry.name === 'Median'
	const isSpecial = isMean || isMedian

	const color = isMean ? MEAN_COLOR : isMedian ? MEDIAN_COLOR : ROW_COLOR

	return {
		name: entry.name,
		value: entry.value,
		lineStyle: {
			color,
			width: isSpecial ? 2.5 : 1,
			type: 'solid',
		},
		itemStyle: { color },
		areaStyle: isSpecial ? { color, opacity: 0.15 } : { color: ROW_COLOR, opacity: 0.05 },
		symbol: isSpecial ? 'circle' : 'none',
		symbolSize: 4,
	}
}

const updateChart = () => {
	const { indicator, series_data } = props.plotData
	if (!series_data?.length) return

	// Compute a shared max per axis for a fair radar scale
	const numAxes = indicator.length
	const maxPerAxis = Array.from({ length: numAxes }, (_, i) =>
		Math.max(...series_data.map(d => d.value[i] ?? 0)),
	)

	const enrichedIndicator = indicator.map((ind, i) => ({
		...ind,
		max: Math.ceil((maxPerAxis[i] + 0.05) * 100) / 100,
	}))

	// Separate rows vs. stats so stats always render on top
	const rows = series_data.filter(d => d.name !== 'Mean' && d.name !== 'Median')
	const stats = series_data.filter(d => d.name === 'Mean' || d.name === 'Median')

	chartOption.value = {
		legend: {
			data: stats.map(s => s.name),
			bottom: 0,
			textStyle: { fontFamily: 'Lexend Deca', fontSize: 11 },
			itemWidth: 14,
			itemHeight: 10,
		},
		tooltip: {
			trigger: 'item',
			formatter: params => {
				const labels = indicator.map(i => i.name)
				const lines = params.value.map((v, i) => `${labels[i]}: <b>${v}</b>`).join('<br/>')
				return `${params.name}<br/>${lines}`
			},
			textStyle: { fontFamily: 'Lexend Deca', fontSize: 11 },
		},
		radar: {
			indicator: enrichedIndicator,
			shape: 'polygon',
			splitNumber: 4,
			nameGap: 8,
			axisName: {
				fontSize: 11,
				fontWeight: 500,
				color: '#64748b',
				fontFamily: 'Lexend Deca',
			},
			axisLine: {
				lineStyle: { color: 'rgba(148,163,184,0.3)' },
			},
			splitLine: {
				lineStyle: { color: 'rgba(148,163,184,0.6)', type: 'dashed' },
			},
			splitArea: {
				areaStyle: {
					color: ['rgba(248,250,252,0.6)', 'rgba(241,245,249,0.6)'],
				},
			},
		},
		series: [
			{
				type: 'radar',
				data: [...rows.map(buildSeriesEntry), ...stats.map(buildSeriesEntry)],
			},
		],
	}
}

watch(
	() => props.plotData,
	() => updateChart(),
	{ immediate: true, deep: true },
)

onMounted(() => {
	nextTick(() => {
		isLoading.value = false
		updateChart()
	})
})
</script>

<style scoped>
.chart {
	width: 24rem;
	height: 24rem;
}
</style>
