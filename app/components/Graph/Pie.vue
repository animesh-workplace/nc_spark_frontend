<!-- TiTvPieChart.vue -->
<template>
	<div class="w-full">
		<Skeleton height="20rem" v-if="isLoading" />
		<template v-else>
			<div class="grid grid-cols-2 gap-2">
				<!-- Header stats strip -->
				<div class="grid grid-cols-2 gap-2 mb-3">
					<div
						v-for="stat in headerStats"
						:key="stat.label"
						class="flex flex-col rounded-lg px-3 py-2  items-center justify-center"
						:class="stat.label == 'Ti/Tv Ratio' ? 'col-span-2' : ''"
						:style="{ backgroundColor: stat.color + '20' }"
					>
						<p class="text-xs font-semibold uppercase tracking-wider" :style="{ color: stat.color }">
							{{ stat.label }}
						</p>
						<p class="text-lg font-bold text-gray-700 font-sans">
							{{ stat.value.toLocaleString() }}
						</p>
					</div>
				</div>

				<VChart :option="chartOption" class="chart" autoresize />
			</div>
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
	const { categories, data, mode } = props.plotData
	const counts = data[0] // flat array of values matching categories

	const pieData = categories.map((cat, i) => ({
		name: cat,
		value: counts[i],
		itemStyle: {
			color: COLORS[cat] ?? '#94a3b8',
			borderRadius: 6,
			borderWidth: 2,
			// borderColor: '#fff',
		},
	}))

	const total = counts.reduce((a, b) => a + b, 0)
	const unit = mode === 'fraction' ? '' : ''

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
                        <span style="color:#64748b">Count</span>: <b>${params.value.toLocaleString()}${unit}</b><br/>
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
				radius: ['42%', '70%'], // donut
				center: ['50%', '46%'],
				avoidLabelOverlap: true,
				padAngle: 3, // gap between slices
				data: pieData,
				emphasis: {
					scale: true,
					scaleSize: 8,
					itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.15)' },
				},
				// label: {
				// 	show: true,
				// 	position: 'inside',
				// 	formatter: p => `${((p.value / total) * 100).toFixed(1)}%`,
				// 	fontSize: 13,
				// 	fontWeight: 700,
				// 	fontFamily: 'Lexend Deca',
				// 	color: '#fff',
				// },
				labelLine: { show: false },
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
