<!-- TiTvPieChart.vue -->
<template>
	<div class="w-full">
		<Skeleton height="20rem" v-if="isLoading" />
		<template v-else>
			<VChart :option="chartOption" class="chart" autoresize />
		</template>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const COLORS = {
	Ti: '#1F6F78',
	Tv: '#A1CE63',
}

const props = defineProps({
	plotData: {
		type: Object,
		default: () => ({
			categories: ['Ti', 'Tv'],
			data: [[4651, 4652]],
			ti_count: 4651,
			tv_count: 4652,
			titv_ratio: 0.9998,
			mode: 'count',
		}),
	},
})

const isLoading = ref(true)
const chartOption = ref({})

const headerStats = computed(() => [
	{ label: 'Transitions (Ti)', value: props.plotData.ti_count, color: COLORS.Ti },
	{ label: 'Transversions (Tv)', value: props.plotData.tv_count, color: COLORS.Tv },
	{ label: 'Ti/Tv Ratio', value: props.plotData.titv_ratio, color: '#6366f1' },
])

const updateChart = () => {
	const { categories, data, mode, titv_ratio } = props.plotData
	const counts = data[0]
	const total = counts.reduce((a, b) => a + b, 0)
	const isFrequency = mode === 'frequency'

	const pieData = categories.map((cat, i) => ({
		name: cat,
		value: counts[i],
		itemStyle: {
			color: COLORS[cat] ?? '#94a3b8',
			borderRadius: 6,
			borderWidth: 2,
		},
	}))

	const ratioDisplay = titv_ratio != null ? Number(titv_ratio).toFixed(2) : 'N/A'

	chartOption.value = {
		backgroundColor: 'transparent',
		tooltip: {
			trigger: 'item',
			confine: true,
			borderColor: '#94a3b8',
			borderWidth: 1,
			padding: [8, 12],
			textStyle: { fontSize: 12, fontFamily: 'Lexend Deca' },
			formatter: params => {
				const pct = ((params.value / total) * 100).toFixed(2)
				return `
                    <div style="font-family:Lexend Deca;line-height:1.8">
                        <span style="
                            display:inline-block;width:10px;height:10px;
                            border-radius:50%;background:${params.color};
                            margin-right:6px;vertical-align:middle
                        "></span>
                        <b>${params.name}</b><br/>
                        <span style="color:#64748b">Count</span>: <b>${params.value.toLocaleString()}</b><br/>
                        <span style="color:#64748b">Share</span>: <b>${pct}%</b>
                    </div>
                `
			},
		},
		legend: {
			bottom: 0,
			left: 'center',
			itemWidth: 12,
			itemHeight: 12,
			itemStyle: { borderRadius: 3 },
			textStyle: { fontSize: 12, fontFamily: 'Lexend Deca', color: '#6b7280' },
		},
		series: [
			{
				type: 'pie',
				radius: ['60%', '90%'],
				center: ['50%', '46%'],
				avoidLabelOverlap: true,
				padAngle: 3,
				data: pieData,
				// emphasis: {
				// 	scale: true,
				// 	scaleSize: 8,
				// 	itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.15)' },
				// },
				label: {
					show: true,
					position: 'inside',
					formatter: p =>
						isFrequency ? `${((p.value / total) * 100).toFixed(1)}%` : p.value.toLocaleString(),
					fontSize: 14,
					color: '#fff',
					fontWeight: 500,
					fontFamily: 'Lexend Deca',
				},
				labelLine: { show: false },
			},
			{
				type: 'pie',
				radius: ['0%', '0%'],
				center: ['50%', '46%'],
				silent: true,
				label: {
					show: true,
					position: 'center',
					formatter: () => `{ratio|${ratioDisplay}}\n{label|Ti/Tv}`,
					rich: {
						ratio: {
							fontSize: 22,
							lineHeight: 32,
							fontWeight: 700,
							color: '#111827',
							fontFamily: 'Lexend Deca',
						},
						label: {
							fontSize: 11,
							lineHeight: 18,
							fontWeight: 400,
							color: '#6b7280',
							fontFamily: 'Lexend Deca',
						},
					},
				},
				labelLine: { show: false },
				data: [{ value: 1, itemStyle: { color: 'transparent' } }],
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
	height: 21rem;
	width: 100%;
}
</style>
