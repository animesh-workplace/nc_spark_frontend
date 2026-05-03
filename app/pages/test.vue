<template>
	<main class="hero-gradient min-h-screen py-16 relative overflow-hidden">
		<!-- <section class="py-20 min-h-screen px-5 md:px-8"> -->
		<div class="max-w-7xl mx-auto px-5 md:px-8 pt-12">
			<!-- Header -->
			<div class="text-center mb-10">
				<span
					class="inline-flex px-4 py-1.5 rounded-full bg-[#263238] text-white text-xs font-bold uppercase mb-4"
				>
					Dashboard
				</span>
				<h1 class="font-display font-black text-[#263238] mb-2 text-3xl">
					Results from your variant file
				</h1>
				<p class="text-[#607D8B] max-w-md mx-auto text-sm">
					Explore your variant annotations across 25+ scoring systems. Dive into detailed metrics,
					distributions, and top hits to uncover insights from your data.
				</p>
			</div>
		</div>

		<section class="mx-auto px-5 md:px-8">
			<DashboardZoneA class="mb-20" />
			<DashboardZoneB class="mb-20" />

			<!-- <DashboardDistribution2 class="mb-10" />
			<DashboardDistribution class="mb-10" />
			<ReplicationRadarChart :plotData="replicationData" />
			<div class="my-5" v-if="tableData?.results?.length || false">
				<VariantTable
					:data="tableData"
					:loading="isLoading"
					@sort="handleTableSort"
					@page="handleTablePage"
				/>
			</div>

			<div class="my-5">
				<TopVariantTable
					:results="topVariantsData.results"
					:cross-group-hits="topVariantsData.cross_group_hits"
				/>
			</div> -->
		</section>
	</main>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { FilterAPI, TopVariantsAPI, ReplicationAPI } = useGeneAPI()

const currentPage = ref(1)
const isLoading = ref(true)
const tableData = ref({ results: [], total_results: 0 })
const topVariantsData = ref({ results: {}, cross_group_hits: [] })
const replicationData = ref({ stats: [], indicator: [], series_data: [] })

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

const FetchData2 = async () => {
	try {
		const response = await TopVariantsAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', {
			limit: 10,
			rank_by: 'median',
		})
		topVariantsData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

const FetchData3 = async () => {
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
		await FetchData2()
		await FetchData3()
	})
})

function handleMove(e) {
	const el = e.currentTarget
	const rect = el.getBoundingClientRect()
	el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
	el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}
</script>

<style scoped></style>
