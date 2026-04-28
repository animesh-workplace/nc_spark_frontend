<template>
	<section>
		<div class="flex justify-center mb-3">
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

		<div class="grid grid-cols-4 gap-2">
			<GraphBar :plotData="variantsPerChr" showAll />
			<GraphTrinucleotideContext class="col-span-3" />
			<GraphBar :plotData="snvChange" showAll class="col-span-2" />
			<GraphPie class="col-span-2" />
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { VariantsPerChromosomeAPI, SNVChangeAPI } = useGeneAPI()

const selectedView = ref('count')
const viewOptions = ref([
	{ label: 'Count', value: 'count', icon: 'tabler:antenna-bars-5' },
	{ label: 'Percentage', value: 'frequency', icon: 'tabler:square-rounded-percentage' },
	// { label: 'Box Plot', value: 'boxplot', icon: 'tabler:chart-candle' },
])
const isLoading = ref(true)
const snvChange = ref({ categories: [], data: [[]] })
const variantsPerChr = ref({ categories: [], data: [[]] })

const FetchData = async () => {
	try {
		const response = await VariantsPerChromosomeAPI('8cf25054-5824-45d4-9072-b3343732a7a5', selectedView.value)
		variantsPerChr.value.categories = response.categories.map(chrom => chrom.replace('chr', ''))
		variantsPerChr.value.data = response.data
		console.log('Fetched data:', variantsPerChr.value)
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData2 = async () => {
	try {
		const response = await SNVChangeAPI('8cf25054-5824-45d4-9072-b3343732a7a5', selectedView.value)
		snvChange.value.categories = response.categories.map(chrom => chrom.replace('chr', ''))
		snvChange.value.data = response.data
		console.log('Fetched data:', snvChange.value)
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const updateCharts = async () => {
	await FetchData()
	await FetchData2()
}

onMounted(async () => {
	await nextTick()
	await FetchData()
	await FetchData2()
	isLoading.value = false
})
</script>

<style scoped></style>
