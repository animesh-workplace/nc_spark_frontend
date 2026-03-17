<template>
	<div class="rounded-lg border border-surface-200 bg-white dark:bg-surface-900 dark:border-surface-700 p-3">
		<VChart v-if="hasData" :option="chartOption" :style="{ height: chartHeight }" autoresize />
		<div
			v-else
			class="flex items-center justify-center text-xs text-surface-400 italic"
			:style="{ height: chartHeight }"
		>
			No data
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	// { [scoreName]: { min, q1, median, q3, max } }
	boxplotData: {
		type: Object,
		required: true,
		default: () => ({}),
	},
	// Optional: { [scoreName]: value } — draws a red dashed marker per score
	markerValues: {
		type: Object,
		default: () => ({}),
	},
	chartHeight: {
		type: String,
		default: '340px',
	},
	title: {
		type: String,
		default: '',
	},
})

const scoreNames = computed(() => Object.keys(props.boxplotData))

const hasData = computed(
	() =>
		scoreNames.value.length > 0 &&
		scoreNames.value.every(k => {
			const s = props.boxplotData[k]
			return ['min', 'q1', 'median', 'q3', 'max'].every(f => typeof s[f] === 'number')
		}),
)

// ECharts boxplot transform expects each row as raw values array.
// Since we already have pre-computed stats, we reconstruct a minimal
// synthetic dataset: [min, q1, median, q3, max] as a single-row proxy
// and use a custom series instead of the transform pipeline.
// This keeps full compatibility with the dataset API pattern.
const chartOption = computed(() => {
	const names = scoreNames.value

	// Build one "group" per score: a row of 5 representative values
	// that reproduce the exact pre-computed stats via the boxplot transform.
	// Strategy: feed [min, q1, median, q3, max] as the raw source row —
	// the transform will compute identical stats from sorted 5-point data.
	const source = names.map(name => {
		const { min, q1, median, q3, max } = props.boxplotData[name]
		// 5-point sorted array → transform produces exactly these as the box stats
		return [min, q1, median, q3, max]
	})

	// Build markLine data for any markerValues provided
	const markLineData = names
		.filter(name => props.markerValues?.[name] != null)
		.map(name => ({
			yAxis: props.markerValues[name],
			name: name,
			lineStyle: { color: '#ef4444', width: 1.5, type: 'dashed' },
			label: {
				formatter: `${name}: ${props.markerValues[name]}`,
				position: 'insideEndTop',
				fontSize: 10,
				color: '#ef4444',
			},
		}))

	return {
		backgroundColor: 'transparent',
		title: props.title
			? [
					{
						text: props.title,
						left: 'center',
						textStyle: { fontSize: 13, fontWeight: '600', color: '#374151' },
					},
			  ]
			: [],
		dataset: [
			{
				// Each row = one boxplot group (score), columns = raw values
				source,
			},
			{
				// Transform dataset[0] into boxplot + outlier datasets
				transform: {
					type: 'boxplot',
					config: {
						itemNameFormatter: params => names[params.value],
					},
				},
			},
			{
				// Outliers output from the transform
				fromDatasetIndex: 1,
				fromTransformResult: 1,
			},
		],
		tooltip: {
			trigger: 'item',
			confine: true,
			axisPointer: { type: 'shadow' },
			formatter: params => {
				if (params.seriesName === 'boxplot') {
					const [name, mn, q1v, med, q3v, mx] = params.data
					return `
                        <b>${name}</b><br/>
                        Max:    <b>${mx.toFixed(4)}</b><br/>
                        Q3:     <b>${q3v.toFixed(4)}</b><br/>
                        Median: <b>${med.toFixed(4)}</b><br/>
                        Q1:     <b>${q1v.toFixed(4)}</b><br/>
                        Min:    <b>${mn.toFixed(4)}</b><br/>
                        IQR:    <b>${(q3v - q1v).toFixed(4)}</b>
                    `
				}
				if (params.seriesName === 'outlier') {
					return `<b>Outlier</b><br/>Value: <b>${params.data[1].toFixed(4)}</b>`
				}
			},
		},
		grid: { top: props.title ? 40 : 12, right: 24, bottom: 48, left: 56 },
		xAxis: {
			type: 'category',
			boundaryGap: true,
			nameGap: 30,
			axisLabel: { fontSize: 11, color: '#6b7280' },
			splitArea: { show: false },
			splitLine: { show: false },
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				fontSize: 11,
				color: '#6b7280',
				formatter: v => v.toFixed(2),
			},
			splitLine: { lineStyle: { type: 'dashed', color: '#f3f4f6' } },
			splitArea: { show: true, areaStyle: { color: ['rgba(250,250,250,0.4)', 'rgba(240,240,240,0.4)'] } },
		},
		series: [
			{
				name: 'boxplot',
				type: 'boxplot',
				datasetIndex: 1,
				itemStyle: {
					color: 'rgba(99,102,241,0.2)',
					borderColor: '#6366f1',
					borderWidth: 1.5,
				},
				emphasis: {
					itemStyle: {
						color: 'rgba(99,102,241,0.4)',
						borderColor: '#4f46e5',
						borderWidth: 2,
					},
				},
				markLine: markLineData.length
					? {
							silent: true,
							symbol: 'none',
							data: markLineData,
					  }
					: undefined,
			},
			{
				name: 'outlier',
				type: 'scatter',
				datasetIndex: 2,
				symbolSize: 6,
				itemStyle: { color: '#f59e0b', opacity: 0.8 },
			},
		],
	}
})
</script>
