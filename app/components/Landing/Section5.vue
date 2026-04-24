<template>
	<section
		class="py-12 bg-linear-to-br from-[#e6e5e5] to-[#EEF5F7]"
		id="features"
		aria-labelledby="features-heading"
	>
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<!-- Header -->
			<div class="text-center mb-16 reveal">
				<span
					class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold tracking-widest uppercase mb-6"
				>
					How It Works
				</span>
				<h2
					id="features-heading"
					class="font-display font-black text-stone-950 mb-5 leading-tight"
					style="font-size: clamp(2rem, 4vw, 3rem)"
				>
					From VCF to ranked variants<br class="hidden md:inline" />
					in three steps
				</h2>
				<p class="text-stone-600 text-lg max-w-xl mx-auto">
					No tool installation. No waiting. No score-reconciliation spreadsheets.
				</p>
			</div>

			<!-- Step cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
				<div
					:key="step.title"
					v-for="(step, i) in steps"
					class="bg-[#23717a]/20 rounded-3xl p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden reveal"
				>
					<!-- Step number watermark -->
					<div
						class="absolute top-4 right-5 font-display font-black text-7xl text-gray-400 leading-none select-none"
						aria-hidden="true"
					>
						{{ i + 1 }}
					</div>

					<div
						class="w-12 h-12 rounded-xl mb-5 flex items-center justify-center text-2xl"
						:style="{ background: step.iconBg }"
					>
						{{ step.icon }}
					</div>
					<p class="font-mono text-xs font-bold mb-2" :style="{ color: step.color }">Step {{ i + 1 }}</p>
					<h3 class="font-display font-bold text-stone-950 text-xl mb-3">
						{{ step.title }}
					</h3>
					<p class="text-sm text-stone-600 leading-relaxed mb-4">
						{{ step.desc }}
					</p>

					<ul class="space-y-1.5">
						<li
							:key="detail"
							v-for="detail in step.details"
							class="flex items-start gap-2 text-xs text-stone-500"
						>
							<span
								class="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
								:style="{ background: step.color }"
							/>
							{{ detail }}
						</li>
					</ul>
				</div>
			</div>

			<!-- Feature grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				<div
					v-for="feat in features"
					:key="feat.title"
					class="bg-white rounded-2xl border p-6 border-stone-200 shadow-sm transition-all reveal flex gap-4 hover:-translate-y-0.5"
					style="background-image:
							repeating-linear-gradient(
								45deg,
								rgba(255,255,255,0.2) 0px,
								rgba(255,255,255,0.2) 1px,
								transparent 5px,
								transparent 10px
							);"
				>
					<div
						class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xl"
						:style="{ background: feat.iconBg }"
					>
						{{ feat.icon }}
					</div>
					<div>
						<h4 class="font-display font-bold text-stone-950 mb-1.5 text-sm">
							{{ feat.title }}
						</h4>
						<p class="text-xs text-stone-600 leading-relaxed">
							{{ feat.desc }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const steps = [
	{
		title: 'Upload Variants',
		icon: '📤',
		color: '#db2777',
		iconBg: '#fce7f3',
		desc:
			'Submit a VCF or CSV file containing your variant cohort. NC-SPARK handles allele normalization and coordinate mapping to GRCh38/hg38 automatically.',
		details: [
			'Accepts VCF 4.1+ and tabular CSV/TSV',
			'Left-align and trim normalization',
			'Indexed by Chr · Start · End · Ref · Alt',
			'Up to 50,000+ variants per session',
		],
	},
	{
		title: 'Single-Pass Annotation',
		icon: '⚙️',
		color: '#16a34a',
		iconBg: '#dcfce7',
		desc:
			'A single JOIN against the pre-annotated NC-SPARK knowledgebase replaces running 25+ individual command-line tools. Results arrive in milliseconds, not hours.',
		details: [
			'Pre-annotated 8 billion-row knowledgebase',
			'Vectorized columnar query engine',
			'Bloom filter indexes for sub-50ms lookups',
			'Concurrent async batch processing',
		],
	},
	{
		title: 'Multi-Domain Ranking',
		icon: '🏆',
		color: '#7c3aed',
		iconBg: '#ede9fe',
		desc:
			'Scores from all four biological domains are normalized and combined into a prioritization ranking that highlights variants consistently scoring high across multiple evidence streams.',
		details: [
			'Pathogenicity + Conservation + Regulatory + Timing',
			'Normalized cross-tool score comparison',
			'Ranked output highlights top-priority candidates',
			'Export to CSV / JSON for downstream analysis',
		],
	},
]

const features = [
	{
		title: 'Near Real-Time Queries',
		icon: '⚡',
		iconBg: '#fce7f3',
		desc: 'Near real-time annotation via the FastAPI endpoint.',
	},
	{
		title: 'VCF/CSV/TSV Support',
		icon: '📂',
		iconBg: '#dcfce7',
		desc: 'Standard genomic input formats supported out of the box with automatic normalization.',
	},
	{
		title: 'Score Normalization',
		icon: '📏',
		iconBg: '#fef3c7',
		desc: 'Raw scores from incompatible tools and scales harmonized for meaningful comparison.',
	},
	{
		title: 'Batch Processing',
		icon: '📦',
		iconBg: '#fee2e2',
		desc: 'Celery + Redis task queue handles large 50k+ variant uploads asynchronously.',
	},
	{
		title: 'Genome Browser Link',
		icon: '🗺️',
		iconBg: '#ede9fe',
		desc: 'Variant loci link directly to UCSC / Ensembl genome browser for visual context.',
	},
	{
		title: 'Exportable Results',
		icon: '💾',
		iconBg: '#dcfce7',
		desc: 'Prioritization results can be exported in CSV or JSON format for downstream analysis.',
	},
]
</script>
