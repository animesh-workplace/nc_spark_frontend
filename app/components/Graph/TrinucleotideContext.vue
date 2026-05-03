<template>
	<div class="w-full">
		<Skeleton height="22rem" v-if="isLoading" />

		<template v-else>
			<!-- SNV type header badges — padding mirrors the ECharts grid -->
			<div class="flex gap-px mb-1" :style="{ paddingLeft: GRID_LEFT, paddingRight: GRID_RIGHT }">
				<div
					:key="mt.label"
					v-for="mt in MUTATION_TYPES"
					:style="{ backgroundColor: mt.color, color: mt.textColor }"
					class="flex-1 py-0.5 text-center text-xs font-bold tracking-wide rounded-sm select-none"
				>
					{{ mt.label }}
				</div>
			</div>

			<VChart :option="chartOption" class="chart" autoresize />
		</template>
	</div>
</template>

<script setup>
// Must match ECharts grid to keep header badges aligned with chart area
const GRID_LEFT = '50px'
const GRID_RIGHT = '8px'

const MUTATION_TYPES = [
	{
		label: 'C>A',
		color: '#2A9D8F', // teal-green (distinct from main teal)
		textColor: '#ffffff',
	},
	{
		label: 'C>G',
		color: '#264653', // deep slate-blue
		textColor: '#ffffff',
	},
	{
		label: 'C>T',
		color: '#E76F51', // coral (replaces red but softer)
		textColor: '#ffffff',
	},
	{
		label: 'T>A',
		color: '#E9C46A', // muted amber (visible, not white)
		textColor: '#1a1a1a',
	},
	{
		label: 'T>C',
		color: '#6ABF69', // fresh green
		textColor: '#0f172a',
	},
	{
		label: 'T>G',
		color: '#8D99AE', // cool gray-blue
		textColor: '#0f172a',
	},
]

const BASES = ['A', 'C', 'G', 'T']

// All 96 SBS contexts in standard COSMIC order:
const CONTEXTS = MUTATION_TYPES.flatMap(({ label, color }) => {
	const refe = label[0] // 'C' or 'T'
	return BASES.flatMap(prefix =>
		BASES.map(suffix => ({
			key: `${prefix}[${label}]${suffix}`, // e.g. "A[C>A]A"
			xLabel: `${prefix}${refe}${suffix}`, // e.g. "ACA"
			snvType: label,
			color,
		})),
	)
}) // exactly 96 entries

const props = defineProps({
	// Array of 96 counts in standard SBS96 COSMIC order
	plotData: {
		type: Object,
		default: () => ({
			counts: Array.from({ length: 96 }, () => Math.floor(Math.random() * 400)),
		}),
	},
})

const isLoading = ref(true)
const chartOption = ref({})

const updateChart = () => {
	const counts = props.plotData?.counts ?? Array(96).fill(0)

	const barData = CONTEXTS.map((ctx, i) => ({
		value: counts[i] ?? 0,
		name: ctx.key,
		itemStyle: {
			color: ctx.color,
			borderRadius: [3, 3, 0, 0],
		},
	}))

	chartOption.value = {
		tooltip: {
			trigger: 'axis',
			confine: true,
			// borderColor: '#94a3b8',
			// borderWidth: 1,
			// padding: [8, 12],
			axisPointer: { type: 'shadow' },
			textStyle: { fontSize: 12, fontFamily: 'Lexend Deca' },
			formatter: params => {
				const p = params[0]
				const ctx = CONTEXTS[p.dataIndex]
				return `
                    <div style="font-family:Lexend Deca;line-height:1.7">
						<div class="flex items-center gap-1">
							${p.marker}
							<b>${ctx.snvType}</b>
						</div>
                        <span style="color:#64748b">Context</span>: <b>${ctx.key}</b><br/>
                        <span style="color:#64748b">Count</span>: <b>${p.value.toLocaleString()}</b>
                    </div>
                `
			},
		},
		grid: {
			top: 0,
			bottom: 0,
			left: GRID_LEFT,
			right: GRID_RIGHT,
		},
		xAxis: {
			type: 'category',
			data: CONTEXTS.map(c => c.xLabel),
			axisLine: { show: true },
			axisTick: { show: true },
			splitLine: { show: true },
			axisLabel: {
				margin: 4,
				rotate: 90,
				interval: 0,
				fontSize: 10,
				fontFamily: 'Lexend Deca',
			},
		},
		yAxis: {
			type: 'value',
			minInterval: 1,
			axisTick: { show: true },
			axisLine: { show: true },
			minorTick: { show: true },
			splitLine: { show: true },
			axisLabel: { fontSize: 10, fontFamily: 'Lexend Deca' },
		},
		series: [
			{
				type: 'bar',
				data: barData,
				barMaxWidth: 14,
				barCategoryGap: '15%',
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
		console.log('SBS96 chart data:', props.plotData)
	})
})
</script>

<style scoped>
.chart {
	height: 20rem;
	width: 100%;
}
</style>
