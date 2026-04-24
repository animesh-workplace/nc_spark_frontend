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

const NULL_SENTINEL = -1 // ⭐ sentinel value to represent null

const chartOption = ref({
	grid: {
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
	},
	xAxis: {
		type: 'category',
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

	// Piecewise visualMap: sentinel -1 → black, 0–1 → gradient
	// visualMap: {
	// 	type: 'piecewise',
	// 	show: false,
	// 	pieces: [
	// 		{ min: -1, max: -0.5, color: '#1a1a1a', opacity: 0.5 },
	// 		{ min: 0, max: 0.1, color: '#313695', opacity: 1 },
	// 		{ min: 0.1, max: 0.2, color: '#4575b4', opacity: 1 },
	// 		{ min: 0.2, max: 0.3, color: '#74add1', opacity: 1 },
	// 		{ min: 0.3, max: 0.4, color: '#abd9e9', opacity: 1 },
	// 		{ min: 0.4, max: 0.5, color: '#e0f3f8', opacity: 1 },
	// 		{ min: 0.5, max: 0.6, color: '#ffffbf', opacity: 1 },
	// 		{ min: 0.6, max: 0.7, color: '#fee090', opacity: 1 },
	// 		{ min: 0.7, max: 0.8, color: '#fdae61', opacity: 1 },
	// 		{ min: 0.8, max: 0.9, color: '#f46d43', opacity: 1 },
	// 		{ min: 0.9, max: 0.98, color: '#d73027', opacity: 1 },
	// 		{ min: 0.99, max: 1.0, color: '#a50026', opacity: 1 },
	// 	],
	// },
	visualMap: {
		type: 'continuous',
		show: false,
		min: 0,
		max: 1,
		inRange: {
			color: ['#EEF5F7', '#26C6DA', '#1F6F78'],
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
				formatter: p => (p.data.rawValue === null ? 'NA' : p.data.value[2]),
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
		let radius = 0
		const isFirst = index === 0
		const isNull = value === null
		const isLast = index === data.length - 1

		if (isFirst) radius = [5, 0, 0, 5]
		else if (isLast) radius = [0, 5, 5, 0]

		return {
			value: [x, y, isNull ? NULL_SENTINEL : value],
			rawValue: value,
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

.landing {
	width: 10rem;
}
</style>
