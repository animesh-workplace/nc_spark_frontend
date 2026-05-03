<template>
	<section>
		<div class="flex flex-col gap-4 items-center justify-center mb-3">
			<div class="max-w-lg w-full">
				<SelectButton
					fluid
					option-label="label"
					option-value="value"
					:allow-empty="false"
					v-model="selectedView"
					:options="viewOptions"
					:pt="{
						pcToggleButton: ({ props }) => ({
							content: '!rounded-xl !transition-all !duration-200',
							root: '!bg-[#1F6F78]/35 !border-transparent !text-slate-800 hover:!bg-[#1F6F78]/55',
						}),
					}"
				>
					<template #option="{ option }">
						<Icon :name="option.icon" class="w-5! h-5! mr-2" />
						{{ option.label }}
					</template>
				</SelectButton>
			</div>

			<div class="max-w-lg w-full">
				<SelectButton
					fluid
					v-model="statMode"
					@change="FetchData"
					option-label="label"
					option-value="value"
					:allow-empty="false"
					:options="statOptions"
					:pt="{
						pcToggleButton: ({ props }) => ({
							content: '!rounded-xl !transition-all !duration-200',
							root: '!bg-[#1F6F78]/35 !border-transparent !text-slate-800 hover:!bg-[#1F6F78]/55',
						}),
					}"
				/>
			</div>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mx-auto w-full">
			<div
				:key="chartData.score"
				v-for="(chartData, index) in histogramData"
				:class="index == 0 ? 'lg:col-start-2' : ''"
			>
				<div v-if="isLoading">
					<Skeleton height="8rem" borderRadius="16px" />
				</div>

				<div v-else>
					<div class="bg-white border border-[#E0E6E8] rounded-2xl pt-2 pb-2 shadow-sm">
						<p class="font-sans font-bold text-md text-gray-500 mb-0.5 px-2">
							{{ score_label[chartData.score] || chartData.score }}
						</p>
						<GraphHistogram v-if="selectedView === 'histogram'" :histogramData="chartData.bins" />
						<GraphLine :histogramData="chartData.bins" v-else />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { GroupDistributionAPI } = useGeneAPI()

const selectedView = ref('line')
const viewOptions = ref([
	{ label: 'Line', value: 'line', icon: 'solar:diagram-up-linear' },
	{ label: 'Histogram', value: 'histogram', icon: 'solar:chart-line-duotone' },
])
const statMode = ref('median')
const statOptions = [
	{ label: 'Median', value: 'median' },
	{ label: 'Mean', value: 'mean' },
	{ label: 'Min', value: 'min' },
	{ label: 'Max', value: 'max' },
]

const isLoading = ref(true)
const histogramData = ref([])
const score_label = {
	regulatory_median: 'Regulatory [Median]',
	conservation_median: 'Conservation [Median]',
	pathogenicity_median: 'Pathogenicity [Median]',
	replication_timing_median: 'Replication Timing [Median]',

	regulatory_mean: 'Regulatory [Mean]',
	conservation_mean: 'Conservation [Mean]',
	pathogenicity_mean: 'Pathogenicity [Mean]',
	replication_timing_mean: 'Replication Timing [Mean]',

	regulatory_max: 'Regulatory [Max]',
	conservation_max: 'Conservation [Max]',
	pathogenicity_max: 'Pathogenicity [Max]',
	replication_timing_max: 'Replication Timing [Max]',

	regulatory_min: 'Regulatory [Min]',
	conservation_min: 'Conservation [Min]',
	pathogenicity_min: 'Pathogenicity [Min]',
	replication_timing_min: 'Replication Timing [Min]',
}

const FetchData = async () => {
	try {
		const response = await GroupDistributionAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', statMode.value)
		histogramData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

onMounted(async () => {
	await nextTick()
	await FetchData()
	isLoading.value = false
})
</script>

<style scoped></style>
