<template>
	<div class="w-full">
		<Skeleton height="22rem" v-if="isLoading" />

		<template v-else>
			<div class="flex gap-px mb-1" :style="{ paddingLeft: GRID_LEFT }">
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
const GRID_LEFT = '15px'

const MUTATION_TYPES = [
	{ label: 'C>A', color: '#2A9D8F', textColor: '#ffffff' },
	{ label: 'C>G', color: '#264653', textColor: '#ffffff' },
	{ label: 'C>T', color: '#E76F51', textColor: '#ffffff' },
	{ label: 'T>A', color: '#E9C46A', textColor: '#1a1a1a' },
	{ label: 'T>C', color: '#6ABF69', textColor: '#0f172a' },
	{ label: 'T>G', color: '#8D99AE', textColor: '#0f172a' },
]

const BASES = ['A', 'C', 'G', 'T']

const CONTEXTS = MUTATION_TYPES.flatMap(({ label, color }) => {
	const refe = label[0] // 'C' or 'T'
	return BASES.flatMap(prefix =>
		BASES.map(suffix => ({
			key: `${prefix}[${label}]${suffix}`, // e.g. "A[C>A]A"  — used for tooltip
			apiKey: `${prefix}${refe}${suffix}(${label})`, // e.g. "ACA(C>A)" — matches API category format
			xLabel: `${prefix}${refe}${suffix}`, // e.g. "ACA"
			snvType: label,
			color,
		})),
	)
}) // exactly 96 entries

const props = defineProps({
	// Raw API response: { categories: string[], data: number[][], mode: string }
	plotData: { type: Object, default: () => null },
})

const isLoading = ref(true)
const chartOption = ref({})

const updateChart = () => {
	// Build lookup map from API response: "ACA(C>A)" → count
	const countMap = {}
	if (props.plotData?.categories && props.plotData?.data?.[0]) {
		props.plotData.categories.forEach((cat, i) => {
			countMap[cat] = props.plotData.data[0][i] ?? 0
		})
	}

	// Map into fixed COSMIC order using apiKey to look up count
	const barData = CONTEXTS.map(ctx => ({
		value: countMap[ctx.apiKey] ?? 0,
		name: ctx.key,
		itemStyle: {
			color: ctx.color,
			borderRadius: [3, 3, 0, 0],
		},
	}))

	const isFrequency = props.plotData?.mode === 'frequency'

	chartOption.value = {
		tooltip: {
			confine: true,
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
			textStyle: { fontSize: 12, fontFamily: 'Lexend Deca' },
			formatter: params => {
				const p = params[0]
				const ctx = CONTEXTS[p.dataIndex]
				const valDisplay = isFrequency ? `${p.value}%` : p.value.toLocaleString()
				return `
                    <div style="font-family:Lexend Deca;line-height:1.7">
                        <div>${p.marker}<b>${ctx.snvType}</b></div>
                        <span style="color:#64748b">Context</span>: <b>${ctx.key}</b><br/>
                        <span style="color:#64748b">${
							isFrequency ? 'Frequency' : 'Count'
						}</span>: <b>${valDisplay}</b>
                    </div>
                `
			},
		},
		grid: { top: 0, bottom: 0, left: GRID_LEFT, right: 1 },
		xAxis: {
			type: 'category',
			axisLine: { show: true },
			axisTick: { show: true },
			splitLine: { show: true },
			data: CONTEXTS.map(c => c.xLabel),
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
			axisLabel: {
				fontSize: 10,
				fontFamily: 'Lexend Deca',
				formatter: isFrequency ? val => `${val}%` : undefined,
			},
		},
		series: [{ type: 'bar', data: barData, barMaxWidth: 14, barCategoryGap: '15%' }],
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
	height: 20rem;
	width: 100%;
}
</style>
