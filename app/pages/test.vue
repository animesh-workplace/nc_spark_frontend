<template>
	<section class="py-20 min-h-screen bg-stone-200 mx-auto px-5 md:px-8">
		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3 mb-16 mx-auto w-full">
			<div
				:key="file"
				v-for="file in [
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
					17,
					18,
					19,
					20,
					21,
					22,
					23,
					24,
					25,
					26,
				]"
				class="bg-white border border-[#E0E6E8] rounded-2xl pt-4 pb-2 shadow-sm"
			>
				<p class="font-display font-black text-xl md:text-xl text-gray-500 mb-0.5 px-4">
					{{ chartData.score }}
				</p>

				<p class="text-xs font-semibold text-[#607D8B] uppercase tracking-wider">
					<GraphLine :histogramData="chartData.bins" />
				</p>
			</div>
		</div>
	</section>
</template>

<script setup>
const chartData = {
	score: 'GPN',
	bins: [
		{ bin_start: 0.0, bin_end: 0.05, count: 4 },
		{ bin_start: 0.05, bin_end: 0.1, count: 48 },
		{ bin_start: 0.1, bin_end: 0.15, count: 52 },
		{ bin_start: 0.15, bin_end: 0.2, count: 83 },
		{ bin_start: 0.2, bin_end: 0.25, count: 79 },
		{ bin_start: 0.25, bin_end: 0.3, count: 75 },
		{ bin_start: 0.3, bin_end: 0.35, count: 62 },
		{ bin_start: 0.35, bin_end: 0.4, count: 42 },
		{ bin_start: 0.4, bin_end: 0.45, count: 44 },
		{ bin_start: 0.45, bin_end: 0.5, count: 59 },
		{ bin_start: 0.5, bin_end: 0.55, count: 24 },
		{ bin_start: 0.55, bin_end: 0.6, count: 6 },
		{ bin_start: 0.6, bin_end: 0.65, count: 1 },
		{ bin_start: 0.65, bin_end: 0.7, count: 1 },
		{ bin_start: 0.7, bin_end: 0.75, count: 0 },
		{ bin_start: 0.75, bin_end: 0.8, count: 0 },
		{ bin_start: 0.8, bin_end: 0.85, count: 0 },
		{ bin_start: 0.85, bin_end: 0.9, count: 0 },
		{ bin_start: 0.9, bin_end: 0.95, count: 0 },
		{ bin_start: 0.95, bin_end: 1.0, count: 0 },
	],
}
</script>

<style scoped></style>
