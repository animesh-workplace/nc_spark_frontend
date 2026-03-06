<template>
	<div class="w-full flex justify-center">
		<Skeleton height="24rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" :class="props.chartType" autoresize v-else />
	</div>
</template>

<script setup>
const isLoading = ref(true)

const props = defineProps({
	plotData: {
		type: Object,
		default: () => ({
			categories: ['CADD', 'DANN', 'FUNS', 'CSCA', 'L5', 'L6', 'L7'],
			data: Array.from({ length: 7 }).map((_, i) => [i, 0, Number(Math.random().toFixed(2))]),
		}),
	},
	chartType: { type: String },
	showAll: { type: Boolean, default: false },
	showLabel: { type: Boolean, default: true },
	horizontal: { type: Boolean, default: false },
})

const chartOption = ref({
	grid: {
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
	},
	xAxis: {
		// position: 'top',
		type: 'category',
		// show: props.showLabel,
		axisLine: { show: false },
		data: props.plotData.categories,
		axisLabel: {
			fontSize: 10,
			fontWeight: 400,
			fontFamily: 'Lexend Deca',
			interval: props.showAll ? 0 : 'auto',
		},
	},
	yAxis: {
		data: [],
		type: 'category',
		show: false,
	},

	// ⭐ Gradient from low → high
	visualMap: {
		min: 0,
		max: 1,
		show: false,
		calculable: false,
		inRange: {
			color: [
				'#313695',
				'#4575b4',
				'#74add1',
				'#abd9e9',
				'#e0f3f8',
				'#ffffbf',
				'#fee090',
				'#fdae61',
				'#f46d43',
				'#d73027',
				'#a50026',
			],
		},
	},

	series: [
		{
			type: 'heatmap',
			data: [],
			label: {
				show: true,
				opacity: 0.4,
				fontWeight: 400,
				fontFamily: 'Lexend Deca',
				formatter: (p) => p.data[2],
			},
			itemStyle: {
				borderWidth: 0,
				borderColor: '#fff',
				borderJoin: 'round',
			},
		},
	],
})

const updateChart = () => {
	const { categories, data } = props.plotData

	chartOption.value.xAxis.data = categories
	chartOption.value.series[0].data = data.map(([x, y, value], index) => {
		const isFirst = index === 0
		const isLast = index === data.length - 1

		let radius = 0

		if (isFirst) radius = [5, 0, 0, 5] // left rounded
		else if (isLast) radius = [0, 5, 5, 0] // right rounded
		else radius = 0 // middle cells square

		return {
			value: [x, y, value],
			itemStyle: {
				borderRadius: radius,
			},
		}
	})
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
	/* width: 16rem; */
	height: 3rem;
}

.pathogenicity {
	width: 33rem;
}

.regulatory {
	width: 12rem;
}

.conservation {
	width: 12rem;
}

.replication_timing {
	width: 18rem;
}
</style>
