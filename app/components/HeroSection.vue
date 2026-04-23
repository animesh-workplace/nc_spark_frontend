<template>
	<!-- ============================================================
    HeroSection — NC-SPARK · Outseta warm theme
    Warm pink→yellow gradient hero, dark serif headlines,
    pink CTA, API terminal mock with light/cream treatment
    ============================================================ -->
	<section
		class="hero-gradient relative overflow-hidden pt-28 pb-0 min-h-screen flex flex-col"
		aria-labelledby="hero-heading"
	>
		<div class="max-w-6xl mx-auto px-5 md:px-8 text-center relative z-10 flex-1 flex flex-col justify-center">
			<!-- Headline -->
			<h1
				id="hero-heading"
				class="font-display font-black text-stone-950 leading-[1.05] mb-3"
				style="font-size: clamp(3rem, 7vw, 5.5rem);"
			>
				<span class="text-pink-600">NC-SPARK</span>
			</h1>
			<p
				class="font-display font-semibold text-stone-700 mb-6"
				style="font-size: clamp(1rem, 2.2vw, 1.5rem); letter-spacing: -0.01em;"
			>
				Non-coding · Scoring · Prioritization · And Ranking · Knowledgebase
			</p>

			<!-- Sub-heading -->
			<p class="text-stone-600 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
				A high-performance meta-aggregator for functional profiling of non-coding variants. One query
				replaces dozens of manual tool lookups —
				<span class="text-pink-600 font-semibold">CADD</span>,
				<span class="text-amber-600 font-semibold">GERP++</span>,
				<span class="text-violet-600 font-semibold">REMM</span>,
				<span class="text-orange-500 font-semibold">PhyloP</span>
				and 20+ more, returned in milliseconds.
			</p>

			<!-- CTAs -->
			<div class="flex flex-wrap justify-center gap-3 mb-14">
				<a
					href="#try"
					class="px-8 py-3.5 text-base font-semibold text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-all shadow-lg shadow-pink-200"
					>Launch Portal</a
				>
				<a
					href="#architecture"
					class="px-8 py-3.5 text-base font-semibold text-stone-800 bg-white/80 border border-stone-300 rounded-full hover:bg-white hover:border-stone-400 transition-all backdrop-blur-sm"
					>View Architecture</a
				>
			</div>

			<!-- Stats bar -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto w-full">
				<div
					v-for="stat in stats"
					:key="stat.label"
					class="bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl px-5 py-4 text-center shadow-sm"
				>
					<p class="font-display font-black text-2xl md:text-3xl text-stone-950 mb-0.5">
						{{ stat.value }}
					</p>
					<p class="text-xs font-semibold text-stone-500 uppercase tracking-wider">{{ stat.label }}</p>
				</div>
			</div>

			<!-- API terminal mock -->
			<div class="max-w-3xl mx-auto w-full mb-0">
				<div class="bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
					<!-- Terminal bar -->
					<div class="flex items-center gap-2 px-4 py-3 border-b border-stone-800 bg-stone-900">
						<span class="w-3 h-3 rounded-full bg-red-500" />
						<span class="w-3 h-3 rounded-full bg-yellow-400" />
						<span class="w-3 h-3 rounded-full bg-green-500" />
						<span class="ml-2 font-mono text-xs text-stone-400">POST /api/v1/annotate</span>
						<span class="ml-auto text-xs font-bold text-green-400 flex items-center gap-1.5">
							<span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
							Live
						</span>
					</div>
					<!-- Request/response split -->
					<div
						class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-800"
					>
						<!-- Request -->
						<div class="p-5">
							<p class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
								Request (VCF coordinate)
							</p>
							<pre class="font-mono text-xs text-stone-300 leading-6 text-left">{
  <span class="text-pink-400">"chr"</span>:   <span class="text-amber-300">"chr17"</span>,
  <span class="text-pink-400">"start"</span>:  <span class="text-green-400">7674220</span>,
  <span class="text-pink-400">"end"</span>:    <span class="text-green-400">7674220</span>,
  <span class="text-pink-400">"ref"</span>:   <span class="text-amber-300">"G"</span>,
  <span class="text-pink-400">"alt"</span>:   <span class="text-amber-300">"A"</span>,
  <span class="text-pink-400">"genome"</span>: <span class="text-amber-300">"hg38"</span>
}</pre>
						</div>
						<!-- Response -->
						<div class="p-5">
							<p class="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
								Response (25+ scores, ~42ms)
							</p>
							<pre
								class="font-mono text-xs text-stone-300 leading-6 text-left"
							><span class="text-pink-400">CADD_PHRED</span>:  <span class="text-white">24.3</span>
<span class="text-amber-400">GERP_RS</span>:     <span class="text-white">4.89</span>
<span class="text-violet-400">REMM</span>:        <span class="text-white">0.971</span>
<span class="text-orange-400">PHYLOP_100</span>:  <span class="text-white">3.22</span>
<span class="text-green-400">DANN</span>:        <span class="text-white">0.994</span>
<span class="text-stone-500">... +20 more scores</span></pre>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Gradient fade to cream body -->
		<div class="mt-12 h-20 bg-gradient-to-b from-transparent to-cream-50" aria-hidden="true" />
	</section>
</template>

<script setup lang="ts">
const stats = [
	{ value: '8B+', label: 'Pre-annotated rows' },
	{ value: '25+', label: 'Integrated tools' },
	{ value: '<50ms', label: 'Median query latency' },
	{ value: '4', label: 'Biological domains' },
]
</script>
