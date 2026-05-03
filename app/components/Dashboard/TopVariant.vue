<!-- VariantGroupTables.vue -->
<template>
	<div class="w-full flex flex-col gap-4 p-4 font-['Lexend_Deca']">
		<!-- Legend -->
		<div class="flex items-center gap-2.5">
			<span
				class="inline-block w-3.5 h-3.5 rounded-sm bg-amber-100 border-2 border-amber-400 flex-shrink-0"
			/>
			<span class="text-xs text-slate-500 font-medium tracking-wide">
				Highlighted rows indicate cross-group hits — variant appears in multiple ranking groups
			</span>
		</div>

		<!-- 4 Tables Grid -->
		<div class="grid grid-cols-4 gap-3 items-stretch">
			<div
				v-for="(groupData, groupKey) in results"
				:key="groupKey"
				class="flex flex-col rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white"
			>
				<!-- Group Header -->
				<div
					class="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 border-b border-slate-200 flex-shrink-0"
				>
					<span class="text-sm font-semibold text-slate-700 capitalize tracking-wide">
						{{ formatGroupName(groupData.group) }}
					</span>
					<span
						class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 whitespace-nowrap"
					>
						{{ groupData.rank_by }}
					</span>
				</div>

				<!-- Table fills remaining height -->
				<div class="flex-1">
					<DataTable
						:value="groupData.top"
						:rowClass="row => getRowClass(row)"
						size="small"
						stripedRows
						showGridlines
						class="text-xs h-full"
					>
						<!-- Rank -->
						<Column
							header="#"
							style="width: 2rem; text-align: center"
							:pt="{
								headerCell:
									'px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200 text-center',
							}"
						>
							<template #body="{ index }">
								<span class="text-[11px] font-bold text-slate-400 tabular-nums">
									{{ index + 1 }}
								</span>
							</template>
						</Column>

						<!-- Variant -->
						<Column
							field="variant"
							header="Variant"
							style="min-width: 120px"
							:pt="{
								headerCell:
									'px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200',
							}"
						>
							<template #body="{ data }">
								<div class="flex items-center gap-1.5">
									<span class="text-[11px] text-slate-700">{{ data.variant }}</span>
									<span
										v-if="isCrossHit(data.variant)"
										class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold bg-amber-400 text-white cursor-default flex-shrink-0"
										v-tooltip.top="getCrossHitTooltip(data.variant)"
									>
										{{ getCrossHitCount(data.variant) }}
									</span>
								</div>
							</template>
						</Column>

						<!-- Score -->
						<Column
							field="group_score"
							header="Score"
							style="width: 64px; text-align: right"
							:pt="{
								headerCell:
									'px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200 text-right',
							}"
						>
							<template #body="{ data }">
								<span
									class="text-[11px] font-semibold tabular-nums text-indigo-600 block text-right"
								>
									{{ data.group_score.toFixed(3) }}
								</span>
							</template>
						</Column>

						<!-- Gene -->
						<Column
							header="Gene"
							:pt="{
								headerCell:
									'px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200',
							}"
						>
							<template #body="{ data }">
								<DashboardGeneCell
									:gene-if-overlapping="data.gene_if_overlapping"
									:nearest-gene-plus="data.nearest_gene_plus"
									:plus-distance="data.plus_distance"
									:nearest-gene-minus="data.nearest_gene_minus"
									:minus-distance="data.minus_distance"
								/>
							</template>
						</Column>
					</DataTable>
				</div>
			</div>
		</div>

		<!-- Cross-Group Hits Summary -->
		<div class="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
			<div class="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
				<div class="flex items-center gap-2">
					<span class="inline-block w-2 h-6 rounded-full bg-indigo-500" />
					<span class="text-sm font-semibold text-slate-700 tracking-wide">Cross-Group Hits</span>
				</div>
				<span class="text-xs text-slate-400 font-normal">
					Variants appearing in multiple ranking groups
				</span>
				<span
					class="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100"
				>
					{{ crossGroupHits.length }} variants
				</span>
			</div>

			<DataTable
				:value="crossGroupHits"
				:rowClass="row => (row.group_count >= 3 ? 'cross-hit-row-high' : 'cross-hit-row-low')"
				size="small"
				showGridlines
				class="text-xs"
			>
				<Column
					field="variant"
					header="Variant"
					style="min-width: 200px"
					:pt="{
						headerCell:
							'px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200',
					}"
				>
					<template #body="{ data }">
						<span class="text-[11px] text-slate-700">{{ data.variant }}</span>
					</template>
				</Column>

				<Column
					header="Nearest Gene"
					:pt="{
						headerCell:
							'px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200',
					}"
				>
					<template #body="{ data }">
						<DashboardGeneCell
							:gene-if-overlapping="data.gene_if_overlapping"
							:nearest-gene-plus="data.nearest_gene_plus"
							:plus-distance="data.plus_distance"
							:nearest-gene-minus="data.nearest_gene_minus"
							:minus-distance="data.minus_distance"
						/>
					</template>
				</Column>

				<Column
					field="appears_in"
					header="Appears In"
					:pt="{
						headerCell:
							'px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200',
					}"
				>
					<template #body="{ data }">
						<div class="flex flex-wrap gap-1">
							<span
								v-for="grp in data.appears_in"
								:key="grp"
								class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border"
								:class="groupTagClass(grp)"
							>
								{{ formatGroupName(grp) }}
							</span>
						</div>
					</template>
				</Column>

				<Column
					field="group_count"
					header="Groups"
					style="width: 80px; text-align: center"
					:pt="{
						headerCell:
							'px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-white border-b border-slate-200 text-center',
					}"
				>
					<template #body="{ data }">
						<div class="flex justify-center">
							<span
								class="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
								:class="
									data.group_count >= 3
										? 'bg-red-100 text-red-600 ring-1 ring-red-300'
										: 'bg-amber-100 text-amber-600 ring-1 ring-amber-300'
								"
							>
								{{ data.group_count }}
							</span>
						</div>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	results: { type: Object, required: true },
	crossGroupHits: { type: Array, required: true },
})

const crossHitMap = computed(() => {
	const map = {}
	props.crossGroupHits.forEach(hit => {
		map[hit.variant] = hit
	})
	return map
})

function isCrossHit(variant) {
	return !!crossHitMap.value[variant]
}
function getCrossHitCount(variant) {
	return crossHitMap.value[variant]?.group_count ?? 0
}
function getCrossHitTooltip(variant) {
	const hit = crossHitMap.value[variant]
	return hit ? `Also in: ${hit.appears_in.join(', ')}` : ''
}
function getRowClass(row) {
	if (!isCrossHit(row.variant)) return ''
	return getCrossHitCount(row.variant) >= 3 ? 'cross-hit-row-high' : 'cross-hit-row-low'
}
function formatGroupName(group) {
	return group.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const GROUP_TAG_CLASSES = {
	pathogenicity: 'bg-red-50 text-red-600 border-red-200',
	regulatory: 'bg-blue-50 text-blue-600 border-blue-200',
	conservation: 'bg-emerald-50 text-emerald-600 border-emerald-200',
	replication_timing: 'bg-amber-50 text-amber-600 border-amber-200',
}
function groupTagClass(group) {
	return GROUP_TAG_CLASSES[group] ?? 'bg-slate-50 text-slate-500 border-slate-200'
}
</script>

<style>
.cross-hit-row-high > td {
	background-color: #fef3c7 !important;
	font-weight: 600;
}
.cross-hit-row-high:hover > td {
	background-color: #fde68a !important;
}
.cross-hit-row-low > td {
	background-color: #eff6ff !important;
}
.cross-hit-row-low:hover > td {
	background-color: #dbeafe !important;
}
</style>
