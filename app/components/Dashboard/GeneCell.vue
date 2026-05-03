<!-- GeneCell.vue -->
<template>
	<div class="relative inline-flex items-center" @mouseenter="showTooltip" @mouseleave="hideTooltip">
		<div v-if="firstGene" class="flex items-center gap-1 cursor-default">
			<span
				class="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
				:class="firstGene.type === 'overlapping' ? 'bg-emerald-400' : 'bg-blue-400'"
			/>
			<span class="text-[11px] text-slate-700 truncate max-w-[80px]">{{ firstGene.label }}</span>
			<span v-if="firstGene.strand" class="text-[9px] font-bold text-slate-400 bg-slate-100 px-0.5 rounded">
				{{ firstGene.strand }}
			</span>
			<span v-if="extraCount > 0" class="text-[10px] text-slate-400 font-medium whitespace-nowrap">
				+{{ extraCount }}
			</span>
		</div>
		<span v-else class="text-[11px] text-slate-300 italic">—</span>

		<!-- Custom tooltip -->
		<Teleport to="body">
			<div
				v-if="visible"
				ref="tooltipEl"
				:style="tooltipStyle"
				class="fixed z-[9999] rounded-xl shadow-2xl border border-slate-700 bg-slate-800 pointer-events-none"
			>
				<DashboardGenomicContextSVG :genes="allGenes" />
			</div>
		</Teleport>
	</div>
</template>

<script setup>
const props = defineProps({
	geneIfOverlapping: { type: String, default: null },
	nearestGenePlus: { type: String, default: null },
	plusDistance: { type: Number, default: null },
	nearestGeneMinus: { type: String, default: null },
	minusDistance: { type: Number, default: null },
})

// ── Gene list ──────────────────────────────────────────────────────────────
const allGenes = computed(() => {
	const entries = []
	if (props.geneIfOverlapping)
		entries.push({ label: props.geneIfOverlapping, type: 'overlapping', strand: null, distance: null })
	if (props.nearestGenePlus)
		entries.push({ label: props.nearestGenePlus, type: 'nearest', strand: '+', distance: props.plusDistance })
	if (props.nearestGeneMinus)
		entries.push({
			label: props.nearestGeneMinus,
			type: 'nearest',
			strand: '−',
			distance: props.minusDistance,
		})
	return entries
})

const firstGene = computed(() => allGenes.value[0] ?? null)
const extraCount = computed(() => Math.max(0, allGenes.value.length - 1))

// ── Tooltip visibility + positioning ──────────────────────────────────────
const visible = ref(false)
const tooltipEl = ref(null)
const tooltipStyle = ref({})
const anchorEl = ref(null)

function showTooltip(e) {
	anchorEl.value = e.currentTarget
	visible.value = true
	nextTick(() => positionTooltip())
}

function hideTooltip() {
	visible.value = false
}

function positionTooltip() {
	if (!anchorEl.value || !tooltipEl.value) return

	const anchor = anchorEl.value.getBoundingClientRect()
	const tip = tooltipEl.value.getBoundingClientRect()
	const margin = 8
	const vw = window.innerWidth
	const vh = window.innerHeight

	// Prefer right of anchor, fall back to left
	let left = anchor.right + margin
	if (left + tip.width > vw - margin) {
		left = anchor.left - tip.width - margin
	}

	// Prefer aligned to anchor top, clamp to viewport
	let top = anchor.top
	if (top + tip.height > vh - margin) {
		top = vh - tip.height - margin
	}
	if (top < margin) top = margin

	tooltipStyle.value = {
		left: `${left}px`,
		top: `${top}px`,
	}
}
</script>
