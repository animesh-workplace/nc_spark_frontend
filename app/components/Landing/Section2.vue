<template>
	<section class="py-12 bg-[#F8FBFC]">
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<!-- Header stays same -->
			<div class="text-center mb-16">
				<span
					class="inline-flex px-4 py-1.5 rounded-full bg-[#263238] text-white text-xs font-bold uppercase mb-6"
				>
					The Problem
				</span>

				<h2
					class="font-display font-black text-[#263238] mb-5 leading-tight"
					style="font-size: clamp(2rem, 4vw, 3rem);"
				>
					Non-coding interpretation is<br class="hidden md:inline" />
					broken by fragmentation
				</h2>

				<p class="text-[#607D8B] text-lg max-w-2xl mx-auto">
					Multiple tools, incompatible scores, slow workflows. NC-SPARK replaces this with a unified
					system.
				</p>
			</div>

			<!-- Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
				<!-- BEFORE -->
				<div class="relative rounded-3xl p-8 overflow-hidden bg-[#263238] text-white shadow-lg">
					<!-- Thatch -->
					<div
						class="absolute inset-0 opacity-20 pointer-events-none"
						style="background-image:
							repeating-linear-gradient(
								45deg,
								rgba(144,164,174,0.12) 0px,
								rgba(144,164,174,0.12) 1px,
								transparent 1px,
								transparent 6px
							);"
					></div>

					<div class="relative z-10">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-full bg-[#37474F] flex items-center justify-center">
								<Icon name="tabler:x" class="text-[#90A4AE]" />
							</div>
							<h3 class="font-display font-bold text-white text-xl">
								Fragmented Workflow
							</h3>
						</div>

						<ul class="space-y-3">
							<li
								v-for="b in before"
								:key="b"
								class="flex gap-3 text-sm text-[#CFD8DC] items-center"
							>
								<Icon name="tabler:circle-x" class="text-[#90A4AE]" />
								{{ b }}
							</li>
						</ul>
					</div>
				</div>

				<!-- AFTER -->
				<div class="relative rounded-3xl p-8 overflow-hidden bg-[#1F6F78] text-white shadow-lg">
					<!-- Thatch -->
					<div
						class="absolute inset-0 opacity-20 pointer-events-none"
						style="background-image:
							repeating-linear-gradient(
								45deg,
								rgba(255,255,255,0.08) 0px,
								rgba(255,255,255,0.08) 1px,
								transparent 1px,
								transparent 6px
							);"
					></div>

					<!-- subtle glow -->
					<div
						class="absolute inset-0 opacity-30 blur-3xl pointer-events-none"
						style="
							background:
							radial-gradient(circle at 30% 40%, rgba(38,198,218,0.25), transparent 50%);
						"
					></div>

					<div class="relative z-10">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
								<Icon name="tabler:check" class="text-[#26C6DA]" />
							</div>

							<h3 class="font-display font-bold text-white text-xl">
								Unified NC-SPARK System
							</h3>
						</div>

						<ul class="space-y-3">
							<li v-for="a in after" :key="a" class="flex gap-3 text-sm text-white/90 items-center">
								<Icon name="tabler:circle-check" class="text-[#26C6DA]" />
								{{ a }}
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Quote -->
			<blockquote class="max-w-3xl mx-auto text-center">
				<p class="font-display text-xl md:text-2xl text-[#455A64] mb-4">
					"Transform fragmented annotation into a real-time unified scoring system."
				</p>
				<footer class="text-sm text-[#90A4AE]">
					NC-SPARK · BRIC-NIBMG
				</footer>
			</blockquote>
		</div>
	</section>
</template>

<script setup lang="ts">
const before = [
	'Run CADD, GERP, DANN, REMM, PhyloP as separate command-line jobs',
	'Hours of compute time per 50,000-variant cohort',
	'Incompatible score scales requiring manual normalization',
	'No unified ranking — must export/merge CSVs manually',
]
const after = [
	'Single API call returns 25+ scores',
	'Pre-annotated knowledgebase with 8B+ rows',
	'All scores normalized to a unified comparative scale',
	'Automated multi-domain prioritization ranking output',
	'Always up-to-date — no local tool installations needed',
	'Batch-upload VCF/CSV/TSV for 50k variants with real-time progress',
]
</script>
