<template>
	<div class="p-8">
		<div class="flex items-center justify-center w-full">
			<label
				for="dropzone-file"
				@drop.prevent="handleDrop"
				@dragover.prevent="isDragging = true"
				@dragleave.prevent="isDragging = false"
				class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
			>
				<div
					v-if="parsedData.length > 0"
					class="flex flex-col items-center justify-center pt-5 pb-6 text-center"
				>
					<Icon name="solar:check-circle-line-duotone" class="w-12! h-12! mb-4 text-green-500" />
					<p class="text-sm text-green-600 font-semibold">
						Successfully parsed {{ parsedData.length }} variants!
					</p>
					<p class="text-xs text-gray-500 mt-1">{{ fileName }}</p>
					<p v-if="parseTime > 0" class="text-xs text-gray-500 mt-1">Parsed in {{ parseTime }}ms</p>
					<p v-if="uploadTime > 0" class="text-xs text-gray-500 mt-1">Uploaded in {{ uploadTime }}ms</p>
					<p class="text-xs text-gray-500 mt-4">Click to upload a different file.</p>
				</div>

				<div v-else-if="isLoading" class="flex flex-col items-center justify-center pt-5 pb-6">
					<!-- <Icon name="svg-spinners:270-ring" class="w-12! h-12! mb-4 text-blue-500" /> -->
					<p class="text-sm text-blue-600 font-semibold">Parsing file: {{ fileName }}</p>
					<p v-if="parseTime > 0" class="text-xs text-gray-500 mt-2">Parse time: {{ parseTime }}ms</p>
				</div>

				<div class="flex flex-col items-center justify-center pt-5 pb-6" v-else>
					<Icon name="solar:cloud-upload-line-duotone" class="w-12! h-12! mb-4 text-gray-500" />
					<p class="mb-2 text-sm text-gray-500">
						<span class="font-semibold">Click to upload</span> or drag and drop
					</p>
					<p class="text-xs text-gray-500">(TSV file with headers: chrom, pos, ref, alt)</p>
				</div>

				<input
					type="file"
					class="hidden"
					id="dropzone-file"
					accept=".tsv,.txt"
					@change="handleFileSelect"
				/>
			</label>
		</div>

		<div class="flex justify-between">
			<button
				type="button"
				class="mt-2 text-[#025964] hover:text-white border border-[#025964] hover:bg-[#025964] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2 text-center mb-2"
				@click="UploadData"
				:disabled="isUploading || parsedData.length === 0"
			>
				<template v-if="isUploading">
					<!-- <Icon name="svg-spinners:270-ring" class="w-4! h-4! mr-2" /> -->
					Uploading...
				</template>
				<template v-else>Submit</template>
			</button>

			<button
				type="button"
				class="mt-2 text-[#025964] hover:text-white border border-[#025964] hover:bg-[#025964] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2 text-center mb-2"
				@click="FetchData"
				:disabled="!session_id"
			>
				Get Variants
			</button>
		</div>

		<!-- Upload status display -->
		<div v-if="uploadTime > 0" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
			<div class="flex items-center">
				<Icon name="solar:check-circle-line-duotone" class="w-5! h-5! text-green-500 mr-2" />
				<p class="text-sm text-green-800">
					Upload completed in <strong>{{ uploadTime }}ms</strong>
					<span v-if="parsedData.length > 0"> for {{ parsedData.length }} variants</span>
				</p>
			</div>
			<p v-if="session_id" class="text-xs text-green-600 mt-1">Session ID: {{ session_id }}</p>
		</div>

		<div class="my-5">
			<!-- Switcher -->
			<div class="flex justify-start mb-3">
				<SelectButton
					option-label="label"
					option-value="value"
					:allow-empty="false"
					v-model="selectedView"
					:options="viewOptions"
				>
					<template #option="{ option }">
						<Icon :name="option.icon" class="w-5! h-5! text-gray-500 mr-2" />
						{{ option.label }}
					</template>
				</SelectButton>
			</div>

			<!-- Conditional chart render -->
			<ScoreHistogram v-if="selectedView === 'histogram'" :histogramData="histogramData" />
			<ScoreLine v-else :histogramData="histogramData" />
		</div>

		<div class="my-5">
			<div class="flex justify-start mb-3">
				<SelectButton
					option-label="label"
					option-value="value"
					:allow-empty="false"
					v-model="selectedView"
					:options="viewOptions"
				>
					<template #option="{ option }">
						<Icon :name="option.icon" class="w-5! h-5! text-gray-500 mr-2" />
						{{ option.label }}
					</template>
				</SelectButton>
			</div>
			<div class=" grid grid-cols-1 md:grid-cols-4 gap-2">
				<!-- Switcher -->

				<BarChart :plotData="variantsPerChromosomeData" horizontal showAll />
				<BarChart :plotData="trinucleotideData" horizontal showAll />
				<BarChart :plotData="snvChangeData" horizontal showAll />
				<BarChart :plotData="tiTvData" />
			</div>
		</div>

		<div class="my-5 grid grid-cols-1 md:grid-cols-3 gap-6">
			<ReplicationRadarChart :plotData="replicationData" />
		</div>

		<div class="my-5" v-if="tableData?.results?.length || false">
			<VariantTable :data="tableData" :loading="isLoading" @sort="handleTableSort" @page="handleTablePage" />
		</div>
	</div>
</template>

<script setup>
import Papa from 'papaparse'
import { useGeneAPI } from '@/api/GeneAPI'

const error = ref(null)
const fileName = ref('')
const parseTime = ref(0)
const parsedData = ref([])
const isDragging = ref(false)
const uploadTime = ref(0) // Add upload time ref
const isUploading = ref(false) // Add upload loading state
const viewOptions = ref([
	{ label: 'Line', value: 'line', icon: 'solar:diagram-up-linear' },
	{ label: 'Histogram', value: 'histogram', icon: 'solar:chart-line-duotone' },
])

const selectedView = ref('line') // default is line
const {
	TiTvAPI,
	UploadAPI,
	FilterAPI,
	SNVChangeAPI,
	ReplicationAPI,
	DistributionAPI,
	TrinucleotideAPI,
	VariantsPerChromosomeAPI,
} = useGeneAPI()

function handleFileSelect(event) {
	const file = event.target.files[0]
	if (file) {
		processFile(file)
	}
}

function handleDrop(event) {
	isDragging.value = false
	const file = event.dataTransfer.files[0]
	if (file) {
		processFile(file)
	}
}

function processFile(file) {
	// Reset state
	error.value = null
	parseTime.value = 0
	parsedData.value = []
	isLoading.value = true
	fileName.value = file.name
	uploadTime.value = 0 // Reset upload time when processing new file

	// Check file type
	if (!file.name.endsWith('.tsv') && file.type !== 'text/tab-separated-values' && !file.name.endsWith('.txt')) {
		error.value = 'Invalid file type. Please upload a .tsv file.'
		isLoading.value = false
		return
	}

	// Start timing
	const startTime = performance.now()

	// Use Papa Parse to stream the file
	Papa.parse(file, {
		delimiter: '\t',
		header: true,
		skipEmptyLines: true,
		transformHeader: header => header.toLowerCase().trim(),

		// This is called when parsing is complete
		complete: results => {
			// Calculate parse time
			const endTime = performance.now()
			parseTime.value = Math.round(endTime - startTime)

			if (results.errors.length > 0) {
				console.error('Papa Parse errors:', results.errors)
				error.value = `Failed to parse file: ${results.errors[0].message}`
				isLoading.value = false
				return
			}

			// Check for required columns
			const requiredCols = ['chromosome', 'start_position', 'reference_allele', 'tumor_seq_allele2']

			// Map the data to our required structure
			const finalData = results.data.map(row => ({
				pos: row.start_position,
				ref: row.reference_allele,
				alt: row.tumor_seq_allele2,
				chr: `chr${row.chromosome}`,
			}))

			parsedData.value = finalData
			isLoading.value = false
			console.log(`Parsed ${finalData.length} variants in ${parseTime.value}ms`)
		},
		// This is called if there's a critical file reading error
		error: err => {
			// Calculate parse time even on error
			const endTime = performance.now()
			parseTime.value = Math.round(endTime - startTime)

			console.error('Papa Parse critical error:', err)
			error.value = 'Failed to read the file.'
			isLoading.value = false
		},
	})
}

const UploadData = async () => {
	if (parsedData.value.length === 0 || isUploading.value) return
	const startTime = performance.now()

	try {
		isUploading.value = true
		uploadTime.value = 0 // Reset upload time

		// Start upload timing

		const response = await UploadAPI(parsedData.value, { genome: 'hg38' })

		// Calculate upload time
		const endTime = performance.now()
		uploadTime.value = Math.round(endTime - startTime)

		session_id.value = response.session_id

		console.log(`Upload completed in ${uploadTime.value}ms for ${parsedData.value.length} variants`)
	} catch (error) {
		// Calculate upload time even on error
		const endTime = performance.now()
		uploadTime.value = Math.round(endTime - startTime)

		console.error('Error uploading data:', error)
		// You might want to show an error message to the user
	} finally {
		isUploading.value = false
	}
}

const pageSize = ref(20)
const currentPage = ref(1)
const isLoading = ref(false)
const histogramData = ref([])
const session_id = ref('21552306-907c-42db-b870-1e22d40f349d')
const tableData = ref({ results: [], total_results: 0 })
const trinucleotideData = ref({ data: [], categories: [] })
const replicationData = ref({ stats: [], indicator: [], series_data: [] })
const snvChangeData = ref({ data: [], categories: [] })
const variantsPerChromosomeData = ref({ data: [], categories: [] })
const tiTvData = ref({ data: [], categories: [] })

const FetchData = async (page = 1, page_size = 20, sortParams = {}) => {
	isLoading.value = true
	try {
		const response = await FilterAPI({
			page,
			page_size,
			sort_order: 'asc',
			session_id: session_id.value,
			...sortParams,
		})
		tableData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData2 = async () => {
	try {
		const response = await DistributionAPI(session_id.value)
		histogramData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}
const FetchData3 = async () => {
	try {
		const response = await ReplicationAPI(session_id.value)
		replicationData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData4 = async () => {
	try {
		const response = await TrinucleotideAPI(session_id.value)
		trinucleotideData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData5 = async () => {
	try {
		const response = await SNVChangeAPI(session_id.value)
		snvChangeData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData6 = async () => {
	try {
		const response = await VariantsPerChromosomeAPI(session_id.value)
		variantsPerChromosomeData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData7 = async () => {
	try {
		const response = await TiTvAPI(session_id.value)
		tiTvData.value = response
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

watch(isLoading, val => {
	console.log('isLoading changed to:', val)
})

onMounted(() => {
	nextTick(async () => {
		await FetchData()
		await FetchData2()
		await FetchData3()
		await FetchData4()
		await FetchData5()
		await FetchData6()
		await FetchData7()
	})
})
</script>

<style scoped>
/* Add some disabled state styling */
button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}
</style>
