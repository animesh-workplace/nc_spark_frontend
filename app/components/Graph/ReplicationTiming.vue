<template>
	<div class="w-full flex justify-center">
		<Skeleton height="22rem" v-if="isLoading" />

		<div v-else class="flex items-center gap-2">
			<!-- Radar chart -->
			<VChart :option="chartOption" class="chart" autoresize />

			<!-- Stats panel -->
			<div v-if="props.plotData.stats" class="flex flex-col gap-2 min-w-44 font-['Lexend_Deca']">
				<!-- RT Score — most prominent -->
				<div
					class="rounded-lg px-3 py-2.5 flex flex-col gap-0.5"
					:class="
						props.plotData.stats.rt_score >= 0
							? 'bg-emerald-50 border border-emerald-200'
							: 'bg-red-50 border border-red-200'
					"
				>
					<span class="text-[10px] uppercase tracking-widest font-semibold text-slate-600">
						RT Score
					</span>
					<div class="flex items-baseline gap-1.5">
						<span
							class="text-xl font-bold"
							:class="props.plotData.stats.rt_score >= 0 ? 'text-emerald-600' : 'text-red-500'"
						>
							{{ props.plotData.stats.rt_score }}
						</span>
						<span
							class="text-xs font-medium px-1.5 py-0.5 rounded-full"
							:class="
								props.plotData.stats.rt_score >= 0
									? 'bg-emerald-100 text-emerald-700'
									: 'bg-red-100 text-red-600'
							"
						>
							{{ props.plotData.stats.rt_score >= 0 ? 'Early' : 'Late' }}
						</span>
					</div>
				</div>

				<!-- Remaining stats -->
				<div class="flex flex-col gap-1.5">
					<div
						v-for="stat in statRows"
						:key="stat.label"
						class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"
					>
						<div class="flex items-center gap-1.5">
							<span
								v-if="stat.dot"
								class="inline-block w-2 h-2 rounded-full shrink-0"
								:style="{ backgroundColor: stat.dot }"
							/>
							<span
								class="text-[10px] uppercase tracking-wider font-medium text-slate-600 leading-tight"
							>
								{{ stat.label }}
							</span>
						</div>
						<span class="text-xs font-bold text-slate-700 tabular-nums">
							{{ stat.value }}
						</span>
					</div>
				</div>
			</div>
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
			stats: {
				early_score: 0.1407,
				late_score: 0.1512,
				rt_score: -0.1038,
				early_dominance_pct: 48.2,
				g1b_baseline: 0.2228,
			},
		}),
	},
})

const statRows = computed(() => {
	const s = props.plotData.stats
	if (!s) return []
	return [
		{ label: 'Early Score', value: s.early_score, dot: '#10b981' },
		{ label: 'Late Score', value: s.late_score, dot: '#ef4444' },
		{ label: 'Early Dominance', value: `${s.early_dominance_pct}%`, dot: null },
		{ label: 'G1B Baseline', value: s.g1b_baseline, dot: null },
	]
})

const ROW_COLOR = 'rgba(148, 163, 184, 0.35)'
const MEAN_COLOR = '#A1CE63'
const MEDIAN_COLOR = '#1F6F78'

const chartOption = ref({})

const buildSeriesEntry = entry => {
	const isMean = entry.name === 'Mean'
	const isMedian = entry.name === 'Median'
	const isSpecial = isMean || isMedian
	const color = isMean ? MEAN_COLOR : isMedian ? MEDIAN_COLOR : ROW_COLOR

	return {
		name: entry.name,
		value: entry.value,
		lineStyle: { color, width: isSpecial ? 2.5 : 1, type: 'solid' },
		itemStyle: { color },
		areaStyle: isSpecial ? { color, opacity: 0.15 } : { color: ROW_COLOR, opacity: 0.05 },
		symbol: isSpecial ? 'circle' : 'none',
		symbolSize: 4,
	}
}

const updateChart = () => {
	const { indicator, series_data } = props.plotData
	if (!series_data?.length) return

	const numAxes = indicator.length
	const maxPerAxis = Array.from({ length: numAxes }, (_, i) =>
		Math.max(...series_data.map(d => d.value[i] ?? 0)),
	)

	const enrichedIndicator = indicator.map((ind, i) => ({
		...ind,
		max: Math.ceil((maxPerAxis[i] + 0.05) * 100) / 100,
	}))

	const rows = series_data.filter(d => d.name !== 'Mean' && d.name !== 'Median')
	const stats = series_data.filter(d => d.name === 'Mean' || d.name === 'Median')

	chartOption.value = {
		legend: {
			data: stats.map(s => s.name),
			bottom: 0,
			left: 0,
			textStyle: { fontFamily: 'Lexend Deca', fontSize: 11 },
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
			radius: '85%',
			center: ['50%', '50%'],
			nameGap: 8,
			splitNumber: 4,
			shape: 'circle',
			indicator: enrichedIndicator,
			axisName: {
				fontSize: 11,
				fontWeight: 500,
				color: '#64748b',
				fontFamily: 'Lexend Deca',
			},
			axisLine: { lineStyle: { color: 'rgba(148,163,184,0.3)' } },
			splitLine: { lineStyle: { color: 'rgba(148,163,184,0.6)', type: 'dashed' } },
			splitArea: { areaStyle: { color: ['rgba(248,250,252,0.6)', 'rgba(241,245,249,0.6)'] } },
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
	width: 22rem;
	height: 22rem;
	flex-shrink: 0;
}
</style>
