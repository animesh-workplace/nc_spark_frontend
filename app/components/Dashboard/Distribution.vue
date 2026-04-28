<template>
	<section>
		<div class="flex justify-center mb-3">
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
		</div>

		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3 mx-auto w-full">
			<div v-for="chartData in histogramData" :key="chartData.score">
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
const { DistributionAPI } = useGeneAPI()

const selectedView = ref('line')
const viewOptions = ref([
	{ label: 'Line', value: 'line', icon: 'solar:diagram-up-linear' },
	{ label: 'Histogram', value: 'histogram', icon: 'solar:chart-line-duotone' },
])
const isLoading = ref(true)
const histogramData = ref([])
const score_label = {
	GWRVIS: 'gwRVIS',
	FUNSEQ2: 'FunSeq2',
	REGULOMEDB: 'RegulomeDB',
	CSCAPE_NONCODING: 'CSCAPE',
	REPLISEQ_S1: 'RepliSeq S1',
	REPLISEQ_S2: 'RepliSeq S2',
	REPLISEQ_S3: 'RepliSeq S3',
	REPLISEQ_S4: 'RepliSeq S4',
	REPLISEQ_G2: 'RepliSeq G2',
	REPLISEQ_G1B: 'RepliSeq G1B',
	PhyloP_30way: 'PhyloP-30 Way',
	PhyloP_100way: 'PhyloP-100 Way',
	FATHMM_XF_NONCODING: 'FATHMM-XF',
	FATHMM_MKL_NONCODING: 'FATHMM-MKL',
	MACIE_CONSERVED: 'MACIE-Conserved',
	MACIE_REGULATORY: 'MACIE-Regulatory',
}

const FetchData = async () => {
	try {
		const response = await DistributionAPI('8cf25054-5824-45d4-9072-b3343732a7a5')
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
