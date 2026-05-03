<template>
	<section>
		<div
			class="flex gap-4 items-start sm:items-center px-4 py-5 mb-12 text-sm text-white rounded-2xl bg-[#1F6F78]"
		>
			<Icon name="tabler:circle-letter-a-filled" class="w-7! h-7!" />
			<p><span class="font-bold text-xl font-display">Genomic landscape overview</span></p>
		</div>

		<div class="flex justify-center mt-3 mb-16">
			<div class="max-w-lg w-full">
				<SelectButton
					fluid
					option-label="label"
					option-value="value"
					:allow-empty="false"
					@change="updateCharts"
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

		<div class="grid grid-cols-4 gap-y-6 gap-x-2">
			<div class="col-span-4">
				<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
					Distribution of substitutions across trinucleotide sequence contexts
					<!-- (SBS96 signature) -->
				</div>
				<GraphTrinucleotideContext :plotData="trinucleotideData" />
			</div>

			<div>
				<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
					Variant distribution across chromosomes
				</div>
				<GraphBar :plotData="variantsPerChr" showAll />
			</div>

			<div class="col-span-2">
				<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
					Single Nucleotide Variant (SNV) Substitution Profile
				</div>
				<GraphBar :plotData="snvChange" showAll />
			</div>

			<div>
				<div class="flex justify-center mb-4 font-semibold text-lg text-gray-700">
					Transition vs Transversion Ratio (Ti/Tv)
				</div>
				<GraphPie :plotData="titvData" />
			</div>
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { VariantsPerChromosomeAPI, SNVChangeAPI, TrinucleotideAPI, TiTvAPI } = useGeneAPI()

const selectedView = ref('count')
const viewOptions = ref([
	{ label: 'Count', value: 'count', icon: 'tabler:antenna-bars-5' },
	{ label: 'Percentage', value: 'frequency', icon: 'tabler:square-rounded-percentage' },
	// { label: 'Box Plot', value: 'boxplot', icon: 'tabler:chart-candle' },
])
const isLoading = ref(true)
const snvChange = ref({ categories: [], data: [[]] })
const variantsPerChr = ref({ categories: [], data: [[]] })
const trinucleotideData = ref({ categories: [], data: [[]] })
const titvData = ref({ categories: [], data: [[]], ti_count: 0, tv_count: 0, titv_ratio: 0 })

const FetchData = async () => {
	try {
		const response = await VariantsPerChromosomeAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', selectedView.value)
		variantsPerChr.value.categories = response.categories.map(chrom => chrom.replace('chr', ''))
		variantsPerChr.value.data = response.data
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData2 = async () => {
	try {
		const response = await SNVChangeAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', selectedView.value)
		snvChange.value.categories = response.categories.map(chrom => chrom.replace('chr', ''))
		snvChange.value.data = response.data
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData3 = async () => {
	try {
		const response = await TrinucleotideAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', selectedView.value)
		trinucleotideData.value = response
	} catch (error) {
		console.error('Error fetching trinucleotide data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData4 = async () => {
	try {
		const response = await TiTvAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', selectedView.value)
		titvData.value = response
	} catch (error) {
		console.error('Error fetching Ti/Tv data:', error)
	} finally {
		isLoading.value = false
	}
}

const updateCharts = async () => {
	await FetchData()
	await FetchData2()
	await FetchData3()
	await FetchData4()
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
