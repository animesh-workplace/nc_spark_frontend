<template>
	<section class="py-20 min-h-screen bg-stone-200 px-5 md:px-8">
		<DashboardZoneA class="mb-20" />
		<DashboardDistribution class="mb-10" />
		<div class="my-5" v-if="tableData?.results?.length || false">
			<VariantTable :data="tableData" :loading="isLoading" @sort="handleTableSort" @page="handleTablePage" />
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { FilterAPI } = useGeneAPI()

const tableData = ref({ results: [], total_results: 0 })
const isLoading = ref(true)
const currentPage = ref(1)

const FetchData = async (page = 1, page_size = 20, sortParams = {}) => {
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

const handleTableSort = event => {
	// Optional: refetch with server-side sort instead of relying on client sort
	// FetchData(currentPage.value, pageSize.value, { sort_field: event.sortField, sort_order: event.sortOrder })
}

const handleTablePage = event => {
	currentPage.value = event.page + 1 // PrimeVue is 0-indexed
	pageSize.value = event.rows
	FetchData(currentPage.value, pageSize.value)
}

onMounted(() => {
	nextTick(async () => {
		await FetchData()
	})
})
</script>

<style scoped></style>
