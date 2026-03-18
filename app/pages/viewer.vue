<!-- app/pages/genome.vue -->
<template>
	<div class="p-4">
		<h1 class="text-xl font-bold mb-4">hg19 Genome Browser</h1>
		<ClientOnly fallback-tag="p" fallback="Loading HiGlass...">
			<!-- <HiGlassViewer /> -->
			<IGViewer />
		</ClientOnly>
	</div>
</template>

<script setup></script>

<style scoped></style>
