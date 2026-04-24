<template>
	<!-- Accessible animated spinner ring -->
	<svg
		:width="size"
		:height="size"
		:viewBox="`0 0 ${size} ${size}`"
		fill="none"
		class="animate-spin"
		aria-hidden="true"
		role="presentation"
	>
		<circle
			:cx="size / 2"
			:cy="size / 2"
			:r="size / 2 - stroke"
			:stroke-width="stroke"
			class="opacity-20"
			stroke="currentColor"
		/>
		<path :d="arcPath" :stroke-width="stroke" stroke="currentColor" stroke-linecap="round" />
	</svg>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		size?: number
		stroke?: number
	}>(),
	{
		size: 32,
		stroke: 3,
	},
)

// Draw a ~270° arc for the spinner quarter that's "cut"
const arcPath = computed(() => {
	const r = props.size / 2 - props.stroke
	const cx = props.size / 2
	const cy = props.size / 2
	// Arc from top (270°) spanning 270° clockwise to the left
	const start = { x: cx, y: cy - r } // top
	const end = { x: cx - r, y: cy } // left
	return `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`
})
</script>
