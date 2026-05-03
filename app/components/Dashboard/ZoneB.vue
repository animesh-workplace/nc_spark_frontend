<template>
	<section>
		<div
			class="flex gap-4 items-start sm:items-center px-4 py-5 mb-12 text-sm text-white rounded-2xl bg-[#1F6F78]"
		>
			<Icon name="tabler:circle-letter-b-filled" class="w-7! h-7!" />
			<p>
				<span class="font-bold text-xl font-display">Functional & genomic context scoring landscape</span>
			</p>
		</div>

		<div class="flex justify-center mt-3 mb-16">
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

		<div class="my-12">
			<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
				Distribution of scores across key genomic signals
			</div>

			<div class="flex justify-center my-3">
				<div class="max-w-lg w-full">
					<SelectButton
						fluid
						v-model="statMode"
						@change="FetchData2"
						option-label="label"
						option-value="value"
						:allow-empty="false"
						:options="statOptions"
						:pt="{
							pcToggleButton: ({ props }) => ({
								content: '!rounded-xl !transition-all !duration-200',
								root:
									'!bg-[#1F6F78]/35 !border-transparent !text-slate-800 hover:!bg-[#1F6F78]/55',
							}),
						}"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mx-auto w-full">
				<div
					:key="chartData.score"
					v-for="(chartData, index) in domainData"
					:class="index == 0 ? 'lg:col-start-2' : ''"
				>
					<div v-if="isLoading">
						<Skeleton height="8rem" borderRadius="16px" />
					</div>

					<div v-else>
						<div class="bg-white border border-[#E0E6E8] rounded-2xl pt-2 pb-2 shadow-sm">
							<p class="font-sans font-bold text-md text-gray-500 mb-0.5 px-2">
								{{ domain_score_label[chartData.score] || chartData.score }}
							</p>
							<GraphHistogram v-if="selectedView === 'histogram'" :histogramData="chartData.bins" />
							<GraphLine :histogramData="chartData.bins" v-else />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="my-12">
			<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
				Distribution of all annotation scores across variants
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
		</div>

		<div class="my-12">
			<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
				Replication timing signal landscape across cell types
			</div>

			<div v-if="isLoading">
				<Skeleton height="20rem" borderRadius="16px" />
			</div>

			<div v-else>
				<GraphReplicationTiming :plotData="replicationData" />
			</div>
		</div>

		<div class="my-5" v-if="tableData?.results?.length || false">
			<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
				Tabular view of all variants with annotations
			</div>
			<VariantTable :data="tableData" :loading="isLoading" @sort="handleTableSort" @page="handleTablePage" />
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { DistributionAPI, GroupDistributionAPI, FilterAPI, ReplicationAPI } = useGeneAPI()

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

const pageSize = ref(20)
const domainData = ref([])
const currentPage = ref(1)
const isLoading = ref(true)
const histogramData = ref([])
const tableData = ref({ results: [], total_results: 0 })
const replicationData = ref({ stats: [], indicator: [], series_data: [] })
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
const domain_score_label = {
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
		const response = await DistributionAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d')
		histogramData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData2 = async () => {
	try {
		const response = await GroupDistributionAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', statMode.value)
		domainData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData3 = async (page = 1, page_size = 20, sortParams = {}) => {
	isLoading.value = true
	try {
		const response = await FilterAPI({
			page,
			page_size,
			sort_order: 'asc',
			session_id: '01e96769-69c1-40d4-aecf-3c6cae17eb9d',
			...sortParams,
		})
		tableData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData4 = async () => {
	try {
		const response = await ReplicationAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d')
		replicationData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const handleTableSort = event => {
	// Optional: refetch with server-side sort instead of relying on client sort
	FetchData3(currentPage.value, pageSize.value, {
		sort_field: event.sortField,
		sort_order: event.sortOrder == 1 ? 'asc' : 'desc',
	})
}

const handleTablePage = event => {
	currentPage.value = event.page + 1 // PrimeVue is 0-indexed
	pageSize.value = event.rows
	FetchData3(currentPage.value, pageSize.value)
}

onMounted(async () => {
	await nextTick()
	await FetchData()
	await FetchData2()
	await FetchData3()
	await FetchData4()
	isLoading.value = false
})
</script>

<style scoped></style>
