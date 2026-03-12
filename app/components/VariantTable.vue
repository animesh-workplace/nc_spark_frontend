<template>
	<div>
		<!-- Stat Mode Selector -->
		<div class="flex items-center gap-3 mb-3">
			<span class="text-sm font-medium text-surface-600">Score Summary:</span>
			<SelectButton
				v-model="statMode"
				option-label="label"
				option-value="value"
				:allow-empty="false"
				:options="statOptions"
			/>
		</div>

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
			:loading="loading"
			@sort="handleSort"
			@page="handlePage"
			:value="localResults"
			:totalRecords="data.total_results"
			:rowsPerPageOptions="[20, 50, 100, 200, 500]"
		>
			<Column
				sortable
				:key="col.field"
				:field="col.field"
				:header="col.header"
				:frozen="col.frozen"
				v-for="col of columns"
				:pt="{ columnHeaderContent: '!justify-center' }"
			>
				<template #body="slotProps">
					<template v-if="col.field === 'pathogenicity'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								:textlabel="statMode"
								chartType="pathogenicity"
								:plotData="{
									data: slotProps.data.pathogenicity,
									categories: score_groups.Pathogenicity,
									median: slotProps.data[`pathogenicity_${statMode}`],
								}"
							/>
						</ClientOnly>
					</template>

					<template v-else-if="col.field === 'conservation'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								:textlabel="statMode"
								chartType="conservation"
								:plotData="{
									data: slotProps.data.conservation,
									categories: score_groups.Conservation,
									median: slotProps.data[`conservation_${statMode}`],
								}"
							/>
						</ClientOnly>
					</template>

					<template v-else-if="col.field === 'regulatory'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								:textlabel="statMode"
								chartType="regulatory"
								:plotData="{
									data: slotProps.data.regulatory,
									categories: score_groups.Regulatory,
									median: slotProps.data[`regulatory_${statMode}`],
								}"
							/>
						</ClientOnly>
					</template>

					<template v-else-if="col.field === 'replication_timing'">
						<ClientOnly fallback-tag="span" fallback="Loading scores...">
							<ScoreTicker
								:textlabel="statMode"
								chartType="replication_timing"
								:plotData="{
									data: slotProps.data.replication_timing,
									categories: score_groups['Replication Timing'],
									median: slotProps.data[`replication_timing_${statMode}`],
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
const props = defineProps({
	loading: { type: Boolean, default: false },
	data: {
		type: Object,
		default: () => ({ results: [], total_results: 0 }),
	},
})

const emit = defineEmits(['sort', 'page'])

const noOfRows = ref(20)

// Stat mode selector state
const statMode = ref('median')
const statOptions = [
	{ label: 'Median', value: 'median' },
	{ label: 'Mean', value: 'mean' },
	{ label: 'Min', value: 'min' },
	{ label: 'Max', value: 'max' },
]

const scoreFieldMap = {
	pathogenicity: [
		'CADD',
		'CSCAPE_NONCODING',
		'DANN',
		'FATHMM_MKL_NONCODING',
		'FATHMM_XF_NONCODING',
		'GPN',
		'GWRVIS',
		'JARVIS',
		'LINSIGHT',
		'NCER',
		'ORION',
		'REMM',
	],
	conservation: ['GERP', 'PhyloP_100way', 'PhyloP_30way', 'MACIE_CONSERVED'],
	regulatory: ['FUNSEQ2', 'FIRE', 'REGULOMEDB', 'MACIE_REGULATORY'],
	replication_timing: [
		'REPLISEQ_G1B',
		'REPLISEQ_S1',
		'REPLISEQ_S2',
		'REPLISEQ_S3',
		'REPLISEQ_S4',
		'REPLISEQ_G2',
	],
}

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
	Conservation: ['GERP', 'PhyP100', 'PhyP30', 'MACIEC'],
	Regulatory: ['FunSeq2', 'FIRE', 'REGDB', 'MACIER'],
	'Replication Timing': ['RepG1b', 'RepS1', 'RepS2', 'RepS3', 'RepS4', 'RepG2'],
}

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

const transformRow = row => ({
	...row, // preserves all _mean, _median, _min, _max fields from API
	regulatory: scoreFieldMap.regulatory.map((field, i) => [i, 0, row[field]]),
	conservation: scoreFieldMap.conservation.map((field, i) => [i, 0, row[field]]),
	pathogenicity: scoreFieldMap.pathogenicity.map((field, i) => [i, 0, row[field]]),
	replication_timing: scoreFieldMap.replication_timing.map((field, i) => [i, 0, row[field]]),
})

const localResults = ref([])

watch(
	() => props.data.results,
	rows => {
		localResults.value = (rows ?? []).map(transformRow)
	},
	{ immediate: true },
)

// Sort key follows the selected statMode dynamically
const handleSort = event => {
	emit('sort', event)

	const statKey = `${event.sortField}_${statMode.value}`
	const isScoreCol = Object.keys(scoreFieldMap).includes(event.sortField)

	if (isScoreCol) {
		localResults.value.sort((a, b) => event.sortOrder * ((a[statKey] ?? 0) - (b[statKey] ?? 0)))
	}
}

const handlePage = event => {
	emit('page', event)
}
</script>
