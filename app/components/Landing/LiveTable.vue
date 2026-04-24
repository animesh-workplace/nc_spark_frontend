<template>
	<div class="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-10 mb-10">
		<!-- LOADING STATE -->
		<div
			v-if="isLoading"
			class="w-full h-[260px] rounded-2xl border border-[#E0E6E8] bg-white/70 backdrop-blur-sm animate-pulse flex items-center justify-center"
		>
			<span class="text-[#607D8B] text-sm font-semibold tracking-wide">
				Loading NC-SPARK stream...
			</span>
		</div>

		<!-- TABLE -->
		<div v-else class="w-full overflow-x-auto">
			<DataTable
				scrollable
				stripedRows
				size="small"
				showGridlines
				:value="rows"
				:rowClass="rowClass"
				class="min-w-[900px] rounded-2xl overflow-hidden border border-[#E0E6E8] bg-white/80 backdrop-blur-sm transition-opacity duration-500"
			>
				<Column field="variant" :pt="{ columnHeaderContent: '!justify-center !p-2' }">
					<template #header>
						<span class="font-bold">Variant</span>
					</template>

					<template #body="slotProps">
						<span class="text-xs md:text-sm text-[#263238] justify-center  flex">
							{{ slotProps.data.variant }}
						</span>
					</template>
				</Column>

				<Column :pt="{ columnHeaderContent: '!justify-center' }">
					<template #header>
						<span class="font-bold">Pathogenicity</span>
					</template>

					<template #body="slotProps">
						<ScoreTicker
							textlabel="median"
							chartType="landing"
							:plotData="slotProps.data.pathogenicity"
						/>
					</template>
				</Column>

				<Column :pt="{ columnHeaderContent: '!justify-center' }">
					<template #header>
						<span class="font-bold">Conservation</span>
					</template>

					<template #body="slotProps">
						<ScoreTicker
							textlabel="median"
							chartType="landing"
							:plotData="slotProps.data.conservation"
						/>
					</template>
				</Column>

				<Column :pt="{ columnHeaderContent: '!justify-center' }">
					<template #header>
						<span class="font-bold">Regulatory</span>
					</template>

					<template #body="slotProps">
						<ScoreTicker
							textlabel="median"
							chartType="landing"
							:plotData="slotProps.data.regulatory"
						/>
					</template>
				</Column>

				<Column :pt="{ columnHeaderContent: '!justify-center' }">
					<template #header>
						<span class="font-bold">Replication Timing</span>
					</template>

					<template #body="slotProps">
						<ScoreTicker
							textlabel="median"
							chartType="landing"
							:plotData="slotProps.data.replication"
						/>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>
</template>

<script setup>
const rows = ref([])
const isLoading = ref(true)

const randomScore = () => Number((Math.random() * 0.6 + 0.3).toFixed(2))
const jitter = val => Math.min(1, Math.max(0, Number((val + (Math.random() - 0.5) * 0.05).toFixed(2))))

const randomVariant = () => {
	const chr = Math.floor(Math.random() * 22) + 1
	const pos = Math.floor(Math.random() * 1e6)

	const bases = ['A', 'T', 'G', 'C']

	const reference = bases[Math.floor(Math.random() * bases.length)]

	let alt
	do {
		alt = bases[Math.floor(Math.random() * bases.length)]
	} while (alt === reference) // ensure mutation is valid

	return `chr${chr}:${pos}:${reference}>${alt}`
}

const score_groups = {
	Pathogenicity: ['CADD', 'DANN', 'GPN'],
	Conservation: ['GERP', 'PhyP100', 'PhyP30'],
	Regulatory: ['FunSeq2', 'FIRE', 'REGDB'],
	'Replication Timing': ['RepG1b', 'RepS1', 'RepS2'],
}

const buildTicker = (count, group) => {
	const values = Array.from({ length: count }).map(() => randomScore())

	return {
		categories: Array.from({ length: count }).map((_, i) => score_groups[group][i]),
		data: values.map((v, i) => [i, 0, v]),
		median: values[Math.floor(values.length / 2)],
	}
}

const buildRow = () => ({
	variant: randomVariant(),
	pathogenicity: buildTicker(3, 'Pathogenicity'),
	conservation: buildTicker(3, 'Conservation'),
	regulatory: buildTicker(3, 'Regulatory'),
	replication: buildTicker(3, 'Replication Timing'),
})

const init = async () => {
	rows.value = Array.from({ length: 6 }).map(() => buildRow())

	// simulate real loading delay (important)
	await new Promise(r => setTimeout(r, 1500))

	await nextTick()
	isLoading.value = false
}

const update = () => {
	rows.value = rows.value.map(row => {
		const updateTicker = ticker => {
			ticker.data = ticker.data.map(([x, y, val]) => [x, y, jitter(val)])
			ticker.median = ticker.data[Math.floor(ticker.data.length / 2)][2]
			return ticker
		}

		return {
			...row,
			pathogenicity: updateTicker(row.pathogenicity),
			conservation: updateTicker(row.conservation),
			regulatory: updateTicker(row.regulatory),
			replication: updateTicker(row.replication),
		}
	})

	const newRow = { ...buildRow(), _isNew: true }

	rows.value = [newRow, ...rows.value.slice(0, rows.value.length - 1)]
}

const rowClass = data => (data._isNew ? 'animate-row-in' : '')

onMounted(() => {
	init()

	setInterval(update, 1800)

	setInterval(() => {
		rows.value.forEach(r => delete r._isNew)
	}, 2000)
})
</script>

<style scoped></style>
