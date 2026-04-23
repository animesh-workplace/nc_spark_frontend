<!-- components/GeneAnnotationCell.vue -->
<template>
	<div v-tooltip.top="tooltipText" class="flex flex-wrap items-center gap-1 cursor-default min-w-0">
		<!-- Overlapping genes (comma-separated, one tag each) -->
		<template v-if="overlappingGenes.length">
			<span
				v-for="gene in overlappingGenes"
				:key="gene"
				class="inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold leading-tight bg-emerald-100 text-emerald-800 border border-emerald-200 max-w-[88px] truncate"
				:title="gene"
			>
				{{ gene }}
			</span>
		</template>

		<!-- Closest flanking gene -->
		<template v-else-if="closestFlank">
			<span class="flex flex-col items-center gap-1 min-w-0">
				<span
					class="text-[12px] font-semibold text-blue-800 leading-tight"
					:class="closestFlank.gene.length > 11 ? 'max-w-[88px] truncate' : ''"
					:title="closestFlank.gene.length > 11 ? closestFlank.gene : undefined"
				>
					{{ closestFlank.gene }}
				</span>
				<span class="inline-flex items-center gap-0.5 shrink-0">
					<span class="text-[10px] text-surface-400 whitespace-nowrap">
						{{ formatDist(closestFlank.dist) }}
					</span>
					<span
						class="inline-block rounded-sm px-1 text-[10px] font-bold leading-tight bg-indigo-100 text-indigo-700 border border-indigo-200 whitespace-nowrap"
					>
						{{ closestFlank.strand }}
					</span>
				</span>
			</span>
		</template>

		<!-- No annotation -->
		<template v-else>
			<span class="text-[11px] text-surface-300 select-none">—</span>
		</template>
	</div>
</template>

<script setup>
import { computed } from 'vue'

// ── Props ──────────────────────────────────────────────────────────────────
const props = defineProps({
	geneIfOverlapping: { type: String, default: '' },
	nearestGenePlus: { type: String, default: '' },
	plusDistance: { type: Number, default: null },
	nearestGeneMinus: { type: String, default: '' },
	minusDistance: { type: Number, default: null },
})

// ── Normalised accessors ───────────────────────────────────────────────────

// Split comma-separated overlapping genes, trim whitespace, drop empty strings
const overlappingGenes = computed(() =>
	(props.geneIfOverlapping || '')
		.split(',')
		.map(g => g.trim())
		.filter(Boolean),
)

const nearestPlus = computed(() => props.nearestGenePlus || '')
const nearestMinus = computed(() => props.nearestGeneMinus || '')
const plusDist = computed(() => props.plusDistance ?? null)
const minusDist = computed(() => props.minusDistance ?? null)

// ── Closest flanking gene (smallest absolute distance) ─────────────────────
const closestFlank = computed(() => {
	if (!nearestPlus.value && !nearestMinus.value) return null

	const hasBoth = nearestPlus.value && nearestMinus.value && plusDist.value !== null && minusDist.value !== null

	if (hasBoth) {
		return plusDist.value <= minusDist.value
			? { gene: nearestPlus.value, dist: plusDist.value, strand: '+' }
			: { gene: nearestMinus.value, dist: minusDist.value, strand: '−' }
	}

	if (nearestPlus.value) return { gene: nearestPlus.value, dist: plusDist.value, strand: '+' }
	return { gene: nearestMinus.value, dist: minusDist.value, strand: '−' }
})

// ── Tooltip — full annotation detail on hover ──────────────────────────────
const tooltipText = computed(() => {
	const parts = []
	if (overlappingGenes.value.length) parts.push(`Overlapping: ${overlappingGenes.value.join(', ')}`)
	if (nearestPlus.value)
		parts.push(
			`+strand: ${nearestPlus.value}${plusDist.value !== null ? ` (${formatDist(plusDist.value)})` : ''}`,
		)
	if (nearestMinus.value)
		parts.push(
			`−strand: ${nearestMinus.value}${minusDist.value !== null ? ` (${formatDist(minusDist.value)})` : ''}`,
		)
	return parts.join('\n') || 'No gene annotation'
})

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDist(bp) {
	if (bp === null || bp === undefined) return ''
	return bp >= 1000 ? `${(bp / 1000).toFixed(1)} kb` : `${bp} bp`
}
</script>
