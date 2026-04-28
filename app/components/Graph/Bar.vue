<template>
	<div class="w-full flex">
		<Skeleton height="20rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
const isLoading = ref(true)

const props = defineProps({
	plotData: {
		type: Object,
		default: () => ({
			categories: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
			data: [Array.from({ length: 7 }, () => Number(Math.random().toFixed(4)))],
		}),
	},
	showAll: { type: Boolean, default: false },
	horizontal: { type: Boolean, default: false },
})

const chartOption = ref({
	tooltip: {
		trigger: 'axis',
		borderColor: '#94a3b8',
		axisPointer: { type: 'shadow' },
		textStyle: { fontSize: 14, fontFamily: 'Lexend Deca' },
		formatter: params => {
			const categoryName = params[0].name
			const rows = params
				.filter(p => p.value !== 0 && p.value != null)
				.map(p => `${p.marker} ${p.seriesName}: <b>${p.value}</b>`)
				.join('<br/>')
			return `<span style="font-family:Lexend Deca">${categoryName}</span><br/>${rows}`
		},
	},
	series: [],
	grid: {
		top: '0%',
		bottom: '0%',
		left: props.horizontal ? '3%' : '1%',
		right: props.horizontal ? '0%' : '1%',
	},
	xAxis: {
		axisTick: { show: true },
		axisLine: { show: true },
		minorTick: { show: true },
		splitLine: { show: true },
		axisLabel: {
			fontSize: 10,
			fontWeight: 400,
			fontFamily: 'Lexend Deca',
			interval: props.showAll ? 0 : 'auto',
		},
	},
	yAxis: {
		show: true,
		axisTick: { show: true },
		axisLine: { show: true },
		minorTick: { show: true },
		splitLine: { show: true },
		inverse: props.horizontal,
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},
})

const updateChart = () => {
	const { categories, data } = props.plotData
	const roundedRadii = props.horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0]

	if (props.horizontal) {
		chartOption.value.yAxis.data = categories
		chartOption.value.yAxis.type = 'category'
		chartOption.value.xAxis.type = 'value'
	} else {
		chartOption.value.xAxis.data = categories
		chartOption.value.xAxis.type = 'category'
		chartOption.value.yAxis.type = 'value'
	}

	chartOption.value.series = data.map((dataSet, index) => ({
		type: 'bar',
		name: 'Count',
		stack: 'total',
		showBackground: false,
		data: dataSet.map((value, i) => {
			let topIdx = -1
			for (let j = data.length - 1; j >= 0; j--) {
				if ((data[j]?.[i] ?? 0) !== 0) {
					topIdx = j
					break
				}
			}
			const isTop = index === topIdx && value !== 0
			return {
				value,
				name: categories[i],
				itemStyle: {
					color: '#1F6F78',
					borderRadius: isTop ? roundedRadii : 0,
				},
			}
		}),
		backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
	}))
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
	height: 21rem;
}
</style>
