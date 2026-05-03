<template>
	<main class="hero-gradient min-h-screen py-16 relative overflow-hidden">
		<!-- <section class="py-20 min-h-screen px-5 md:px-8"> -->
		<div class="max-w-7xl mx-auto px-5 md:px-8 pt-12">
			<!-- Header -->
			<div class="text-center mb-10">
				<span
					class="inline-flex px-4 py-1.5 rounded-full bg-[#263238] text-white text-xs font-bold uppercase mb-4"
				>
					Dashboard
				</span>
				<h1 class="font-display font-black text-[#263238] mb-2 text-3xl">
					Results from your variant file
				</h1>
				<p class="text-[#607D8B] max-w-md mx-auto text-sm">
					Explore your variant annotations across 25+ scoring systems. Dive into detailed metrics,
					distributions, and top hits to uncover insights from your data.
				</p>
			</div>
		</div>

		<section class="mx-auto px-5 md:px-8">
			<DashboardZoneA class="mb-20" />
			<DashboardZoneB class="mb-20" />
			<DashboardZoneC class="mb-20" />
		</section>
	</main>
</template>

<script setup></script>

<style scoped></style>
