<!-- GenomicContextSvg.vue -->
<template>
	<div
		v-if="props.genes?.length"
		:style="`padding:10px 14px;width:${W + 28}px;box-sizing:border-box;font-family:'Lexend Deca',sans-serif`"
	>
		<!-- Header -->
		<div
			style="font-size:9px;font-weight:700;letter-spacing:0.1em;color:#94a3b8;
            text-transform:uppercase;padding-bottom:6px;margin-bottom:4px;
            border-bottom:1px solid rgba(255,255,255,0.1)"
		>
			Genomic Context
		</div>

		<!-- SVG diagram -->
		<svg
			:viewBox="`0 0 ${W} ${svgH}`"
			:width="W"
			:height="svgH"
			xmlns="http://www.w3.org/2000/svg"
			style="display:block;overflow:visible"
		>
			<!-- Chromosome baseline -->
			<line :x1="16" :y1="baselineY" :x2="W - 16" :y2="baselineY" stroke="#475569" stroke-width="1" />
			<text :x="18" :y="baselineY + 10" font-size="7" fill="#64748b" :font-family="FONT">5'</text>
			<text :x="W - 20" :y="baselineY + 10" font-size="7" fill="#64748b" :font-family="FONT">3'</text>

			<!-- Gene bars -->
			<template v-for="bar in bars" :key="bar.label">
				<!-- Bar -->
				<rect
					:x="bar.barX"
					:y="bar.barY"
					:width="bar.w"
					:height="BAR_H"
					rx="3"
					:fill="bar.color"
					:fill-opacity="bar.isOverlapping ? 0.25 : 0.15"
					:stroke="bar.color"
					:stroke-width="bar.isOverlapping ? 1.5 : 1"
				/>
				<!-- Strand arrow -->
				<path v-if="bar.arrowPath" :d="bar.arrowPath" :fill="bar.color" opacity="0.85" />
				<!-- Gene label -->
				<text
					:x="bar.labelX"
					:y="bar.labelY"
					:text-anchor="bar.labelAnchor"
					font-size="8.5"
					font-weight="600"
					:fill="bar.color"
					:font-family="FONT"
				>
					{{ bar.displayLabel }}
				</text>
				<!-- Distance label -->
				<text
					v-if="!bar.isOverlapping && bar.distance != null"
					:x="bar.distX"
					:y="bar.y + 3"
					:text-anchor="bar.distAnchor"
					font-size="7.5"
					fill="#94a3b8"
					:font-family="FONT"
				>
					{{ bar.distance.toLocaleString() }} bp
				</text>
			</template>

			<!-- Variant dashed line -->
			<line
				:x1="VAR_X"
				:y1="10"
				:x2="VAR_X"
				:y2="baselineY"
				stroke="#f59e0b"
				stroke-width="1.5"
				stroke-dasharray="3,2.5"
				opacity="0.85"
			/>
			<!-- Variant label badge -->
			<rect
				:x="VAR_X - 19"
				y="2"
				width="38"
				height="13"
				rx="3"
				fill="#fef3c7"
				stroke="#f59e0b"
				stroke-width="1"
			/>
			<text
				:x="VAR_X"
				y="11.5"
				text-anchor="middle"
				font-size="7.5"
				font-weight="700"
				fill="#92400e"
				:font-family="FONT"
			>
				variant
			</text>
		</svg>

		<!-- Legend -->
		<div
			style="display:flex;flex-wrap:wrap;gap:5px 12px;margin-top:8px;padding-top:6px;
            border-top:1px solid rgba(255,255,255,0.08)"
		>
			<div v-if="overlapping" style="display:flex;align-items:center;gap:5px;font-size:9px;color:#94a3b8">
				<span
					style="width:10px;height:3px;border-radius:1px;background:#10b981;display:inline-block"
				></span>
				Overlapping
			</div>
			<div v-if="plusGene" style="display:flex;align-items:center;gap:5px;font-size:9px;color:#94a3b8">
				<span
					style="width:10px;height:3px;border-radius:1px;background:#60a5fa;display:inline-block"
				></span>
				+ strand
			</div>
			<div v-if="minusGene" style="display:flex;align-items:center;gap:5px;font-size:9px;color:#94a3b8">
				<span
					style="width:10px;height:3px;border-radius:1px;background:#a78bfa;display:inline-block"
				></span>
				− strand
			</div>
			<div style="display:flex;align-items:center;gap:5px;font-size:9px;color:#94a3b8">
				<span style="width:1.5px;height:10px;border-left:1.5px dashed #f59e0b;display:inline-block"></span>
				Variant
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	genes: { type: Array, required: true },
})

const FONT = `'Lexend Deca', sans-serif`
const W = 260
const BAR_H = 10
const VAR_X = W / 2
const GENE_W = 110 // gene bar width
const ARROW = 6
const ROW_SPACING = 36
const START_Y = 38

const overlapping = computed(() => (props.genes ?? []).find(g => g.type === 'overlapping') ?? null)
const plusGene = computed(() => (props.genes ?? []).find(g => g.strand === '+') ?? null)
const minusGene = computed(() => (props.genes ?? []).find(g => g.strand === '−') ?? null)

// Assign Y rows: + strand above, overlapping middle, − strand below
const rowYMap = computed(() => {
	if (!props.genes?.length) return {}
	const map = {}
	let row = 0
	if (plusGene.value) {
		map.plus = START_Y + row++ * ROW_SPACING
	}
	if (overlapping.value) {
		map.overlap = START_Y + row++ * ROW_SPACING
	}
	if (minusGene.value) {
		map.minus = START_Y + row++ * ROW_SPACING
	}
	return map
})

const rowCount = computed(() => Object.keys(rowYMap.value).length)
const svgH = computed(() => START_Y + rowCount.value * ROW_SPACING + 20)
const baselineY = computed(() => START_Y + rowCount.value * ROW_SPACING + 4)

const bars = computed(() => {
	if (!props.genes?.length) return []
	const result = []

	const makeBar = ({ y, color, label, distance, strand, isOverlapping }) => {
		const barY = y - BAR_H / 2

		let barX, barEndX
		if (isOverlapping) {
			barX = VAR_X - GENE_W / 2
			barEndX = VAR_X + GENE_W / 2
		} else if (strand === '+') {
			barX = VAR_X
			barEndX = VAR_X + GENE_W
		} else {
			barX = VAR_X - GENE_W
			barEndX = VAR_X
		}

		const w = barEndX - barX

		const arrowPath =
			strand === '+'
				? `M${barEndX} ${y} l-${ARROW} ${-ARROW / 2} l0 ${ARROW} Z`
				: strand === '−'
				? `M${barX} ${y} l${ARROW} ${-ARROW / 2} l0 ${ARROW} Z`
				: ''

		const displayLabel = label.length > 18 ? label.slice(0, 16) + '…' : label

		// For + strand and overlapping: label above bar, distance below label
		// For − strand: label below bar, distance below that
		const isAbove = strand !== '−'
		const labelY = isAbove ? barY - 5 : barY + BAR_H + 11
		const distLabelY = isAbove ? barY - 5 + 9 : barY + BAR_H + 11 + 9 // directly below gene name

		const labelAnchor = isOverlapping ? 'middle' : strand === '+' ? 'start' : 'end'
		const labelX = isOverlapping ? barX + w / 2 : strand === '+' ? barX + 2 : barEndX - 2

		// Distance shares same x and anchor as label — sits directly beneath it
		const distX = labelX
		const distAnchor = labelAnchor

		return {
			y,
			barY,
			barX,
			barEndX,
			w,
			color,
			label,
			displayLabel,
			distance,
			strand,
			isOverlapping,
			arrowPath,
			labelX,
			labelY,
			labelAnchor,
			distX,
			distLabelY,
			distAnchor,
		}
	}

	if (plusGene.value)
		result.push(
			makeBar({
				y: rowYMap.value.plus,
				color: '#60a5fa',
				label: plusGene.value.label,
				distance: plusGene.value.distance,
				strand: '+',
				isOverlapping: false,
			}),
		)

	if (overlapping.value)
		result.push(
			makeBar({
				y: rowYMap.value.overlap,
				color: '#10b981',
				label: overlapping.value.label,
				distance: null,
				strand: null,
				isOverlapping: true,
			}),
		)

	if (minusGene.value)
		result.push(
			makeBar({
				y: rowYMap.value.minus,
				color: '#a78bfa',
				label: minusGene.value.label,
				distance: minusGene.value.distance,
				strand: '−',
				isOverlapping: false,
			}),
		)

	return result
})
</script>
