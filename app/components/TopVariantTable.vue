<!-- VariantGroupTables.vue -->
<template>
	<div class="variant-group-tables p-4">
		<!-- Legend -->
		<div class="flex align-items-center gap-3 mb-4">
			<span class="cross-hit-legend-dot"></span>
			<span class="text-sm font-medium text-color-secondary">
				Highlighted rows = Cross-group hits (variant appears in multiple groups)
			</span>
		</div>

		<!-- 4 Tables Grid -->
		<div class="grid grid-cols-4 gap-4">
			<div v-for="(groupData, groupKey) in results" :key="groupKey">
				<div class="card shadow-2 border-round-lg overflow-hidden">
					<!-- Table Header -->
					<div class=" px-3 py-2 flex align-items-center justify-content-between border border-gray-200">
						<span class="font-bold text-lg capitalize mr-2">
							{{ formatGroupName(groupData.group) }}
						</span>
						<Tag
							rounded
							:value="`Ranked by ${groupData.rank_by}`"
							severity="info"
							class="text-xs mr-2"
						/>
					</div>

					<DataTable
						:value="groupData.top"
						:rowClass="row => getRowClass(row)"
						size="small"
						stripedRows
						showGridlines
						class="group-table"
					>
						<!-- Rank Column -->
						<Column header="#" style="width: 3rem; text-align: center">
							<template #body="{ index }">
								<span class="font-bold text-color-secondary">{{ index + 1 }}</span>
							</template>
						</Column>

						<!-- Variant Column -->
						<Column field="variant" header="Variant" style="min-width: 200px">
							<template #body="{ data }">
								<div class="flex items-center gap-2">
									<span class="text-sm">{{ data.variant }}</span>
									<!-- Cross-hit badge -->
									<Tag
										severity="warning"
										v-if="isCrossHit(data.variant)"
										class="text-xs cross-hit-badge"
										:value="`×${getCrossHitCount(data.variant)}`"
										v-tooltip.top="getCrossHitTooltip(data.variant)"
									/>
								</div>
							</template>
						</Column>

						<!-- Score Column -->
						<Column field="group_score" header="Score" style="width: 120px; text-align: right">
							<template #body="{ data }">
								<div class="flex align-center gap-2 justify-content-end">
									<ProgressBar :value="data.group_score" />
									<span class="font-semibold text-sm">
										{{ data.group_score.toFixed(3) }}
									</span>
								</div>
							</template>
						</Column>
					</DataTable>
				</div>
			</div>
		</div>

		<!-- Cross-group Hits Summary Table -->
		<div class="card shadow-2 border-round-lg mt-2 overflow-hidden">
			<div class="border border-gray-200 px-3 py-2">
				<span class="font-bold text-lg">Cross-Group Hits Summary</span>
				<span class="text-sm ml-2 text-color-secondary">
					Variants appearing in multiple ranking groups
				</span>
			</div>

			<DataTable
				:value="crossGroupHits"
				:rowClass="row => (row.group_count >= 3 ? 'cross-hit-row-high' : 'cross-hit-row-low')"
				size="small"
				showGridlines
			>
				<Column field="variant" header="Variant" style="min-width: 220px">
					<template #body="{ data }">
						<span class="text-sm">{{ data.variant }}</span>
					</template>
				</Column>

				<Column field="appears_in" header="Appears In">
					<template #body="{ data }">
						<div class="flex flex-wrap gap-1">
							<Tag
								v-for="grp in data.appears_in"
								:key="grp"
								:value="formatGroupName(grp)"
								:severity="groupTagSeverity(grp)"
								class="text-xs"
							/>
						</div>
					</template>
				</Column>

				<Column field="group_count" header="Group Count" style="width: 130px; text-align: center">
					<template #body="{ data }">
						<Badge
							:value="data.group_count"
							:severity="data.group_count >= 3 ? 'danger' : 'warning'"
						/>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>
</template>

<script setup>
// ── Props ──────────────────────────────────────────────────────────────────
const props = defineProps({
	results: {
		type: Object,
		required: true,
	},
	crossGroupHits: {
		type: Array,
		required: true,
	},
})

// ── Derived sets for O(1) lookups ──────────────────────────────────────────
const crossHitMap = computed(() => {
	const map = {}
	props.crossGroupHits.forEach(hit => {
		map[hit.variant] = hit
	})
	return map
})

// ── Helpers ────────────────────────────────────────────────────────────────
function isCrossHit(variant) {
	return !!crossHitMap.value[variant]
}

function getCrossHitCount(variant) {
	return crossHitMap.value[variant]?.group_count ?? 0
}

function getCrossHitTooltip(variant) {
	const hit = crossHitMap.value[variant]
	if (!hit) return ''
	return `Also in: ${hit.appears_in.join(', ')}`
}

function getRowClass(row) {
	if (!isCrossHit(row.variant)) return ''
	const count = getCrossHitCount(row.variant)
	return count >= 3 ? 'cross-hit-row-high' : 'cross-hit-row-low'
}

function formatGroupName(group) {
	return group.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const GROUP_SEVERITIES = {
	pathogenicity: 'danger',
	regulatory: 'info',
	conservation: 'success',
	replication_timing: 'warning',
}

function groupTagSeverity(group) {
	return GROUP_SEVERITIES[group] ?? 'secondary'
}
</script>

<style scoped>
/* ── Group table header bar ── */
.table-group-header {
	background: linear-gradient(90deg, #1e3a5f 0%, #2563eb 100%);
	color: #fff;
}

.cross-summary-header {
	background: linear-gradient(90deg, #7c3aed 0%, #a855f7 100%);
}

/* ── Cross-hit row colours (used by :rowClass) ── */
:deep(.cross-hit-row-high) {
	background-color: #fef3c7 !important; /* amber-100 */
	font-weight: 600;
}

:deep(.cross-hit-row-high:hover) {
	background-color: #fde68a !important;
}

:deep(.cross-hit-row-low) {
	background-color: #eff6ff !important; /* blue-50 */
}

:deep(.cross-hit-row-low:hover) {
	background-color: #dbeafe !important;
}

/* ── Mini score bar ── */
.score-bar-bg {
	width: 60px;
	height: 8px;
	background: #e5e7eb;
	border-radius: 4px;
	overflow: hidden;
}

.score-bar-fill {
	height: 100%;
	background: linear-gradient(90deg, #3b82f6, #6366f1);
	border-radius: 4px;
	transition: width 0.3s ease;
}

/* ── Legend dot ── */
.cross-hit-legend-dot {
	display: inline-block;
	width: 14px;
	height: 14px;
	border-radius: 3px;
	background: #fef3c7;
	border: 2px solid #f59e0b;
}

/* ── Monospaced variant labels ── */
.variant-label {
	font-family: 'Courier New', monospace;
	font-size: 0.78rem;
}

.cross-hit-badge {
	cursor: help;
}
</style>
