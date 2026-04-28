<template>
	<section>
		<div class="grid grid-cols-4 gap-2">
			<GraphBar :plotData="histogramData" showAll />
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { VariantsPerChromosomeAPI } = useGeneAPI()

const isLoading = ref(true)
const histogramData = ref({ categories: [], data: [[]] })

const FetchData = async () => {
	try {
		const response = await VariantsPerChromosomeAPI('8cf25054-5824-45d4-9072-b3343732a7a5', 'count')
		histogramData.value.categories = response.categories.map(chrom => chrom.replace('chr', ''))
		histogramData.value.data = response.data
		console.log('Fetched data:', histogramData.value)
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
