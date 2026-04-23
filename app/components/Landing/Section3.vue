<template>
	<section class="pt-24 bg-white" id="domains" aria-labelledby="domains-heading">
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<!-- Header -->
			<div class="text-center mb-16 reveal">
				<span
					class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold tracking-widest uppercase mb-6"
				>
					Unified Scoring Framework
				</span>
				<h2
					id="domains-heading"
					class="font-display font-black text-stone-950 mb-5 leading-tight"
					style="font-size: clamp(2rem, 4vw, 3rem);"
				>
					Four biological domains.<br class="hidden md:inline" />
					One ranked output.
				</h2>
				<p class="text-stone-600 text-lg max-w-2xl mx-auto">
					NC-SPARK aggregates variant scores into four distinct biological domains, providing a
					multi-parametric view of variant impact from a single query.
				</p>
			</div>

			<!-- Domain cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
				<article
					v-for="domain in domains"
					:key="domain.id"
					class="bg-white rounded-3xl border border-stone-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 reveal"
				>
					<!-- Domain header -->
					<div class="flex items-start justify-between mb-5">
						<div class="flex items-center gap-3">
							<div
								class="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
								:style="{ background: domain.iconBg }"
							>
								{{ domain.icon }}
							</div>
							<div>
								<h3 class="font-display font-bold text-stone-950 text-lg leading-tight">
									{{ domain.name }}
								</h3>
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide mt-0.5"
									:style="{ background: domain.pillBg, color: domain.pillColor }"
								>
									{{ domain.count }} tools
								</span>
							</div>
						</div>
					</div>

					<!-- Description -->
					<p class="text-sm text-stone-600 mb-5 leading-relaxed">{{ domain.desc }}</p>

					<!-- Tool tags -->
					<div class="flex flex-wrap gap-2">
						<span
							v-for="tool in domain.tools"
							:key="tool"
							class="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-semibold border"
							:style="{
								background: domain.tagBg,
								color: domain.tagColor,
								borderColor: domain.tagBorder,
							}"
						>
							{{ tool }}
						</span>
					</div>
				</article>
			</div>

			<!-- Scrolling tool marquee -->
			<div class="text-center mb-5">
				<p class="text-xs font-bold uppercase tracking-widest text-stone-400">
					All integrated scoring tools
				</p>
			</div>
			<div class="marquee-container">
				<div class="marquee-track gap-3 py-1" style="animation: marquee 40s linear infinite;">
					<span
						v-for="(tool, i) in [...allTools, ...allTools]"
						:key="tool + i"
						class="inline-block mx-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-stone-100 text-stone-600 border border-stone-200"
					>
						{{ tool }}
					</span>
				</div>
			</div>
		</div>

		<div class="mt-10 h-20 bg-linear-to-b from-transparent to-pink-50" aria-hidden="true" />
	</section>
</template>

<script setup lang="ts">
const domains = [
	{
		id: 'pathogenicity',
		name: 'Pathogenicity',
		icon: '🧬',
		iconBg: '#fee2e2',
		pillBg: '#fee2e2',
		pillColor: '#991b1b',
		tagBg: '#fff1f2',
		tagColor: '#be123c',
		tagBorder: '#fecdd3',
		count: 12,
		desc:
			'Predicts the deleteriousness of non-coding variants using ensemble models trained on known pathogenic sites, regulatory disruption, and population constraint.',
		tools: [
			'CADD',
			'CSCAPE',
			'DANN',
			'FATHMM-MKL',
			'FATHMM-XF',
			'GPN',
			'gwRVIS',
			'JARVIS',
			'LINSIGHT',
			'ncER',
			'ORION',
			'REMM',
		],
	},
	{
		id: 'conservation',
		name: 'Conservation',
		icon: '🌿',
		iconBg: '#dcfce7',
		pillBg: '#dcfce7',
		pillColor: '#14532d',
		tagBg: '#f0fdf4',
		tagColor: '#166534',
		tagBorder: '#bbf7d0',
		count: 4,
		desc:
			'Measures evolutionary conservation across vertebrate species using phylogenetic models, identifying positions under purifying selection that are likely functionally constrained.',
		tools: ['GERP', 'PhyloP 100way', 'PhyloP 30way', 'MACIE Conserved'],
	},
	{
		id: 'regulatory',
		name: 'Regulatory',
		icon: '🔬',
		iconBg: '#ede9fe',
		pillBg: '#ede9fe',
		pillColor: '#4c1d95',
		tagBg: '#f5f3ff',
		tagColor: '#5b21b6',
		tagBorder: '#ddd6fe',
		count: 4,
		desc:
			'Evaluates the regulatory potential of non-coding positions by integrating ENCODE/Roadmap epigenomics data, transcription factor binding sites, and chromatin accessibility signals.',
		tools: ['FUNSEQ2', 'FIRE', 'RegulomeDB', 'MACIE Regulatory'],
	},
	{
		id: 'replication',
		name: 'Replication Timing',
		icon: '⏱️',
		iconBg: '#fef3c7',
		pillBg: '#fef3c7',
		pillColor: '#78350f',
		tagBg: '#fffbeb',
		tagColor: '#92400e',
		tagBorder: '#fde68a',
		count: 6,
		desc:
			'Captures replication timing phase data via RepliSeq, allowing correlation of variant position with mutation rate biases across S-phase, which is relevant to somatic cancer mutation signatures.',
		tools: ['RepliSeq G1b', 'RepliSeq S1', 'RepliSeq S2', 'RepliSeq S3', 'RepliSeq S4', 'RepliSeq G2'],
	},
]

const allTools = [
	'CADD',
	'CSCAPE',
	'DANN',
	'FATHMM-MKL',
	'FATHMM-XF',
	'GPN',
	'GWRVIS',
	'JARVIS',
	'LINSIGHT',
	'NCER',
	'ORION',
	'REMM',
	'GERP++',
	'PhyloP_100way',
	'PhyloP_30way',
	'MACIE',
	'FUNSEQ2',
	'FIRE',
	'REGULOMEDB',
	'RepliSeq_G1b',
	'RepliSeq_S1',
	'RepliSeq_S2',
	'RepliSeq_S3',
	'RepliSeq_S4',
	'RepliSeq_G2',
]
</script>
