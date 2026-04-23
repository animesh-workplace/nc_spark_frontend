<template>
	<section class="pt-24 bg-pink-50" id="problem" aria-labelledby="problem-heading">
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<div class="text-center mb-16 reveal">
				<span
					class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold tracking-widest uppercase mb-6"
				>
					The Problem
				</span>
				<h2
					id="problem-heading"
					class="font-display font-black text-stone-950 mb-5 leading-tight"
					style="font-size: clamp(2rem, 4vw, 3rem);"
				>
					Non-coding interpretation is<br class="hidden md:inline" />
					broken by fragmentation
				</h2>
				<p class="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
					Interpreting non-coding variants today means running 10+ separate command-line tools, waiting
					hours for results, and manually reconciling incompatible score scales. NC-SPARK replaces all of
					that with a single API call.
				</p>
			</div>

			<!-- Before / After cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
				<!-- Before -->
				<div class="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm reveal">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
							<Icon name="tabler:x" class="text-red-500" />
						</div>
						<h3 class="font-display font-bold text-stone-950 text-xl">Without NC-SPARK</h3>
					</div>
					<ul class="space-y-3" role="list">
						<li v-for="b in before" :key="b" class="flex items-center gap-3 text-sm text-stone-600">
							<Icon name="tabler:circle-x" class="text-red-500" />
							{{ b }}
						</li>
					</ul>
				</div>

				<!-- After -->
				<div class="bg-white rounded-3xl border-2 border-green-200 p-8 shadow-sm reveal">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
							<Icon name="tabler:check" class="text-green-500" />
						</div>
						<h3 class="font-display font-bold text-stone-950 text-xl">With NC-SPARK</h3>
					</div>
					<ul class="space-y-3" role="list">
						<li v-for="a in after" :key="a" class="flex items-center  gap-3 text-sm text-stone-700">
							<Icon name="tabler:circle-check" class="text-green-500" />
							{{ a }}
						</li>
					</ul>
				</div>
			</div>

			<!-- Use-case quote -->
			<blockquote class="max-w-3xl mx-auto text-center reveal">
				<p class="font-display text-xl md:text-2xl text-stone-800 leading-relaxed mb-4">
					"Transform the waiting-heavy annotation process into a real-time, query-based experience —
					enabling researchers to prioritize potential regulatory drivers in large-scale cohorts
					instantaneously."
				</p>
				<footer class="text-sm text-stone-500">NC-SPARK Design Principle · BRIC-NIBMG</footer>
			</blockquote>
		</div>

		<div class="mt-10 h-20 bg-linear-to-b from-transparent to-white" aria-hidden="true" />
	</section>
</template>

<script setup lang="ts">
const before = [
	'Run CADD, GERP, DANN, REMM, PhyloP as separate command-line jobs',
	'Hours of compute time per 50,000-variant cohort',
	'Incompatible score scales requiring manual normalization',
	'No unified ranking — must export/merge CSVs manually',
	'Tool version drift and installation dependency hell',
	'No real-time feedback during TCGA or oral-cancer cohort analysis',
]
const after = [
	'Single API call returns 25+ scores in < 50 ms',
	'Pre-annotated ClickHouse knowledgebase with 8B+ rows',
	'All scores normalized to a unified comparative scale',
	'Automated multi-domain prioritization ranking output',
	'Always up-to-date — no local tool installations needed',
	'Batch-upload VCF/CSV for 50k variants with real-time progress',
]
</script>
