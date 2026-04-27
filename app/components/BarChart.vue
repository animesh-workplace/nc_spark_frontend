<template>
	<div class="w-full flex">
		<Skeleton height="24rem" v-if="isLoading" />
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
	series: [],
	legend: {
		show: true,
		textStyle: {
			fontFamily: 'Lexend Deca, sans-serif',
			fontSize: 12,
			color: '#607D8B',
		},
	},
	grid: {
		top: '0%',
		bottom: '0%',
		outerBoundsMode: 'same',
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
		inverse: props.horizontal ? true : false,
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
		stack: 'total',
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
				itemStyle: {
					// color: value > 0.5 ? '#ef4444' : undefined,
					borderRadius: isTop ? roundedRadii : 0,
				},
			}
		}),
		name: `Bl${index + 1}`,
		showBackground: false,
		backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
	}))
}

watch(
	() => props.plotData,
	() => {
		updateChart()
	},
	{ immediate: true, deep: true },
)

// Initialize on mount
onMounted(() => {
	nextTick(() => {
		isLoading.value = false
		updateChart()
	})
})
</script>

<style scoped>
.chart {
	width: 30rem;
	height: 36rem;
}
</style>
