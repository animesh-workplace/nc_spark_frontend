<template>
	<DataTable
		lazy
		rowHover
		paginator
		scrollable
		class="p-1"
		stripedRows
		size="small"
		showGridlines
		removableSort
		:rows="noOfRows"
		resizableColumns
		@sort="HandleSort"
		@page="HandlePage"
		:loading="isLoading"
		columnResizeMode="expand"
		:value="searchData.results"
		:totalRecords="searchData.total_results"
		:rowsPerPageOptions="[20, 50, 100, 200, 500]"
	>
		<Column sortable :key="col.field" :field="col.field" :header="col.header" v-for="col of columns"> </Column>
	</DataTable>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { FilterAPI } = useGeneAPI()

const props = defineProps({
	tableData: { type: Object, required: true },
	tableParams: { type: Object, required: true },
})

const noOfRows = ref(20)
const searchData = ref({})
const isLoading = ref(false)
const currentRequestController = ref(null) // To cancel previous requests

const columns = [
	{ field: 'chr', header: 'Chromosome' },
	{ field: 'pos', header: 'Position' },
	{ field: 'ref', header: 'Reference Allele' },
	{ field: 'alt', header: 'Alternate Allele' },
	{ field: 'GPN', header: 'GPN' },
	{ field: 'GERP', header: 'GERP' },
	{ field: 'NCER', header: 'NCER' },
	{ field: 'DANN', header: 'DANN' },
	{ field: 'REPLISEQ_S2', header: 'RepliSeq S2' },
	{ field: 'REPLISEQ_G1B', header: 'RepliSeq G1B' },
	{ field: 'REPLISEQ_S4', header: 'RepliSeq S4' },
	{ field: 'REPLISEQ_S1', header: 'RepliSeq S1' },
	{ field: 'REPLISEQ_G2', header: 'RepliSeq G2' },
	{ field: 'REPLISEQ_S3', header: 'RepliSeq S3' },
	{ field: 'FATHMM_MKL_CODING', header: 'FATHMM MKL (Coding)' },
	{ field: 'FATHMM_MKL_NONCODING', header: 'FATHMM MKL (Non-Coding)' },
	{ field: 'ORION', header: 'ORION' },
	{ field: 'CSCAPE_NONCODING', header: 'CScape (Non-Coding)' },
	{ field: 'CSCAPE_CODING', header: 'CScape (Coding)' },
	{ field: 'CADD', header: 'CADD' },
	{ field: 'PhyloP_100way', header: 'PhyloP 100-way' },
	{ field: 'PhyloP_30way', header: 'PhyloP 30-way' },
	{ field: 'LINSIGHT', header: 'LINSIGHT' },
	{ field: 'JARVIS', header: 'JARVIS' },
	{ field: 'REMM', header: 'REMM' },
	{ field: 'FIRE', header: 'FIRE' },
	{ field: 'FUNSEQ2', header: 'FunSeq2' },
	{ field: 'FATHMM_XF_NONCODING', header: 'FATHMM XF (Non-Coding)' },
	{ field: 'FATHMM_XF_CODING', header: 'FATHMM XF (Coding)' },
	{ field: 'MACIE_REGULATORY', header: 'MACIE (Regulatory)' },
	{ field: 'MACIE_CONSERVED', header: 'MACIE (Conserved)' },
	{ field: 'REGULOMEDB', header: 'RegulomeDB' },
	{ field: 'GWRVIS', header: 'GWRVIS' },
]

// Debounce function to prevent multiple rapid calls
const debounce = (func, wait) => {
	let timeout
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout)
			func(...args)
		}
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}

const HandleSort = async (event) => {
	await handleTableChange(event)
}

const HandlePage = async (event) => {
	noOfRows.value = event.rows
	await handleTableChange(event)
}

// Unified handler for both sort and page events
const handleTableChange = debounce(async (event) => {
	let sortOrder = 'asc'
	if (event.sortOrder === -1) {
		sortOrder = 'desc'
	}

	await searchByAPI(event.sortField, sortOrder, (event.page ?? 0) + 1)
}, 150) // 150ms debounce delay

const searchByAPI = async (sort_by = null, sort_order = 'asc', page = 1) => {
	// Cancel previous request if it exists
	if (currentRequestController.value) {
		currentRequestController.value.abort()
	}

	// Create new AbortController for this request
	currentRequestController.value = new AbortController()

	try {
		isLoading.value = true

		const response = await FilterAPI(
			{
				sort_by,
				page: page,
				sort_order,
				page_size: noOfRows.value, // Make sure to use .value
				session_id: props.tableParams?.session_id || '792e178c-b34b-4ad8-bad2-8756f8788ef6',
			},
			{
				signal: currentRequestController.value.signal,
			},
		)

		searchData.value = response
	} catch (error) {
		// Only log if it's not an abort error
		if (error.name !== 'AbortError') {
			console.error('Error fetching search data:', error)
		}
	} finally {
		isLoading.value = false
		currentRequestController.value = null
	}
}

// Add a method to manually refresh data if needed
const refreshData = () => {
	searchByAPI(null, 'asc', 1)
}

watch(
	() => props.tableData,
	(newData) => {
		searchData.value = newData
	},
	{ immediate: true, deep: true },
)

watch(
	() => props.tableParams?.session_id,
	(newSessionId) => {
		if (newSessionId) {
			// Refresh data when session_id changes
			refreshData()
		}
	},
)

onMounted(() => {
	searchData.value = props.tableData
})

// Cleanup on unmount
onUnmounted(() => {
	if (currentRequestController.value) {
		currentRequestController.value.abort()
	}
})
</script>

<style scoped></style>
