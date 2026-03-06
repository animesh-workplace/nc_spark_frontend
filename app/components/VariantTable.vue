<template>
	<div>
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
			@sort="HandleSort"
			:loading="isLoading"
			:value="searchData.results"
			:totalRecords="searchData.total_results"
			:rowsPerPageOptions="[20, 50, 100, 200, 500]"
		>
			<Column
				sortable
				:key="col.field"
				:field="col.field"
				:header="col.header"
				:frozen="col.frozen"
				v-for="col of columns"
				:pt="{
					columnHeaderContent: '!justify-center',
				}"
			>
				<template #body="slotProps">
					<template v-if="col.field === 'pathogenicity'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								chartType="pathogenicity"
								:plotData="{
									data: slotProps.data.pathogenicity,
									categories: score_groups.Pathogenicity,
									median: slotProps.data.pathogenicity_median,
								}"
							/>
						</ClientOnly>
					</template>

					<template v-else-if="col.field === 'conservation'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								chartType="conservation"
								:plotData="{
									data: slotProps.data.conservation,
									categories: score_groups.Conservation,
									median: slotProps.data.conservation_median,
								}"
							/>
						</ClientOnly>
					</template>

					<template v-else-if="col.field === 'regulatory'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								chartType="regulatory"
								:plotData="{
									data: slotProps.data.regulatory,
									categories: score_groups.Regulatory,
									median: slotProps.data.regulatory_median,
								}"
							/>
						</ClientOnly>
					</template>

					<template v-else-if="col.field === 'replication_timing'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								chartType="replication_timing"
								:plotData="{
									data: slotProps.data.replication_timing,
									categories: score_groups['Replication Timing'],
									median: slotProps.data.replication_timing_median,
								}"
							/>
						</ClientOnly>
					</template>

					<template v-else>
						{{ slotProps.data[col.field] }}
					</template>
				</template>
			</Column>
		</DataTable>
	</div>
</template>

<script setup>
const noOfRows = ref(20)
const search_results = Array.from({ length: 30 }).map((_, i) => ({
	chr: `chr${Math.floor(Math.random() * 22) + 1}`,
	pos: Math.floor(Math.random() * 10000),
	ref: 'A',
	alt: 'T',
	pathogenicity_median: 0,
	conservation_median: 0,
	regulatory_median: 0,
	replication_timing_median: 0,
	pathogenicity: Array.from({ length: 12 }).map((_, j) => [j, 0, Number(Math.random().toFixed(2))]),
	conservation: Array.from({ length: 4 }).map((_, j) => [j, 0, Number(Math.random().toFixed(2))]),
	regulatory: Array.from({ length: 4 }).map((_, j) => [j, 0, Number(Math.random().toFixed(2))]),
	replication_timing: Array.from({ length: 6 }).map((_, j) => [j, 0, Number(Math.random().toFixed(2))]),
}))

const searchData = ref({
	results: search_results,
	total_results: 300,
})

// Calculate the median scores for each variant
searchData.value.results.forEach((element) => {
	element.pathogenicity_median = parseFloat(
		element.pathogenicity
			.map((score) => score[2])
			.sort((a, b) => a - b)
			[Math.floor(element.pathogenicity.length / 2)].toFixed(2),
	)
	element.conservation_median = parseFloat(
		element.conservation
			.map((score) => score[2])
			.sort((a, b) => a - b)
			[Math.floor(element.conservation.length / 2)].toFixed(2),
	)
	element.regulatory_median = parseFloat(
		element.regulatory
			.map((score) => score[2])
			.sort((a, b) => a - b)
			[Math.floor(element.regulatory.length / 2)].toFixed(2),
	)
	element.replication_timing_median = parseFloat(
		element.replication_timing
			.map((score) => score[2])
			.sort((a, b) => a - b)
			[Math.floor(element.replication_timing.length / 2)].toFixed(2),
	)
})

const score_groups = {
	Pathogenicity: [
		'CADD',
		'CScape',
		'DANN',
		'fatMKL',
		'fatXF',
		'GPN',
		'gwRVIS',
		'JARVIS',
		'LINSIG',
		'nCER',
		'ORION',
		'ReMM',
	],
	Regulatory: ['FunSeq2', 'FIRE', 'REGDB', 'MACIER'],
	Conservation: ['GERP', 'PhyP100', 'PhyP30', 'MACIEC'],
	'Replication Timing': ['RepS1', 'RepS2', 'RepS3', 'RepS4', 'RepG1b', 'RepG2'],
}

const isLoading = ref(false)

const columns = [
	{ field: 'chr', header: 'Chrom', frozen: false },
	{ field: 'pos', header: 'Pos', frozen: false },
	{ field: 'ref', header: 'Ref', frozen: false },
	{ field: 'alt', header: 'Alt', frozen: false },
	{ field: 'pathogenicity', header: 'Pathogenicity', frozen: false },
	{ field: 'conservation', header: 'Conservation', frozen: false },
	{ field: 'regulatory', header: 'Regulatory', frozen: false },
	{ field: 'replication_timing', header: 'Replication Timing', frozen: false },
]

const HandleSort = async (event) => {
	if (event.sortField === 'pathogenicity') {
		searchData.value.results.sort((a, b) => {
			return event.sortOrder * (a.pathogenicity_median - b.pathogenicity_median)
		})
	} else if (event.sortField === 'conservation') {
		searchData.value.results.sort((a, b) => {
			return event.sortOrder * (a.conservation_median - b.conservation_median)
		})
	} else if (event.sortField === 'regulatory') {
		searchData.value.results.sort((a, b) => {
			return event.sortOrder * (a.regulatory_median - b.regulatory_median)
		})
	} else if (event.sortField === 'replication_timing') {
		searchData.value.results.sort((a, b) => {
			return event.sortOrder * (a.replication_timing_median - b.replication_timing_median)
		})
	}
}
</script>

<style></style>
