<template>
	<section class="py-12 bg-linear-to-br from-[#e6e5e5] to-[#EEF5F7]" id="domains">
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<!-- Header -->
			<div class="text-center mb-16">
				<span
					class="inline-flex px-4 py-1.5 rounded-full bg-[#263238] text-white text-xs font-bold uppercase mb-6"
				>
					Unified Scoring Framework
				</span>

				<h2
					class="font-display font-black text-[#263238] mb-5 leading-tight"
					style="font-size: clamp(2rem, 4vw, 3rem);"
				>
					Four biological domains.<br class="hidden md:inline" />
					One ranked output.
				</h2>

				<p class="text-[#607D8B] text-lg max-w-2xl mx-auto">
					NC-SPARK aggregates variant scores into four biological domains, creating a unified
					multi-parametric interpretation.
				</p>
			</div>

			<!-- Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
				<article
					v-for="domain in domains"
					:key="domain.id"
					class="relative rounded-3xl p-7 border shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1"
					:style="{ background: domain.bg, borderColor: domain.border }"
				>
					<!-- subtle thatch -->
					<div
						class="absolute inset-0 opacity-10 pointer-events-none"
						style="background-image:
							repeating-linear-gradient(
								45deg,
								rgba(255,255,255,0.1) 0px,
								rgba(255,255,255,0.1) 1px,
								transparent 5px,
								transparent 10px
							);"
					></div>

					<div class="relative z-10">
						<!-- Header -->
						<div class="flex items-center gap-3 mb-5">
							<div
								class="w-11 h-11 rounded-xl flex items-center justify-center"
								:style="{ background: domain.iconBg }"
							>
								<Icon :name="domain.icon" class="w-7! h-7! text-gray-700" />
							</div>

							<div>
								<h3 class="font-display font-bold text-white text-lg">
									{{ domain.name }}
								</h3>

								<span
									class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold mt-1"
									:style="{ background: domain.pillBg, color: domain.pillColor }"
								>
									{{ domain.count }} tools
								</span>
							</div>
						</div>

						<!-- Description -->
						<p class="text-sm text-white/80 mb-5 leading-relaxed">
							{{ domain.desc }}
						</p>

						<!-- Tags -->
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tool in domain.tools"
								:key="tool"
								class="px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border"
								:style="{
									background: domain.tagBg,
									color: domain.tagColor,
									borderColor: domain.tagBorder,
								}"
							>
								{{ tool }}
							</span>
						</div>
					</div>
				</article>
			</div>

			<!-- Marquee -->
			<div class="text-center mb-5">
				<p class="text-xs font-bold uppercase tracking-widest text-[#90A4AE]">
					All integrated scoring tools
				</p>
			</div>

			<div class="overflow-hidden relative w-full">
				<div class="flex w-max gap-3 py-2 animate-marquee">
					<span
						v-for="(tool, i) in [...allTools, ...allTools]"
						:key="tool + i"
						class="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-[#EEF5F7] text-[#455A64] border border-[#E0E6E8]"
					>
						{{ tool }}
					</span>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const domains = [
	{
		id: 'pathogenicity',
		name: 'Pathogenicity',
		icon: 'tabler:virus',
		iconColor: 'text-[#1F6F78]',
		bg: '#1F6F7899',
		border: '#1F6F7899',
		iconBg: 'rgba(255,255,255,0.2)',
		pillBg: 'rgba(255,255,255,0.15)',
		pillColor: '#E0F7FA',
		tagBg: 'rgba(255,255,255,0.08)',
		tagColor: '#E0F7FA',
		tagBorder: 'rgba(255,255,255,0.2)',
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
		id: 'replication',
		name: 'Replication Timing',
		icon: 'tabler:stopwatch',
		iconColor: 'text-[#7CB342]',
		bg: '#7CB34299',
		border: '#7CB34299',
		iconBg: 'rgba(255,255,255,0.1)',
		pillBg: 'rgba(255,255,255,0.15)',
		pillColor: '#F1F8E9',
		tagBg: 'rgba(255,255,255,0.08)',
		tagColor: '#F1F8E9',
		tagBorder: 'rgba(255,255,255,0.2)',
		count: 6,
		desc:
			'Captures replication timing phase data via RepliSeq, allowing correlation of variant position with mutation rate biases across S-phase, which is relevant to somatic cancer mutation signatures.',
		tools: ['RepliSeq G1b', 'RepliSeq S1', 'RepliSeq S2', 'RepliSeq S3', 'RepliSeq S4', 'RepliSeq G2'],
	},
	{
		id: 'conservation',
		name: 'Conservation',
		icon: 'tabler:leaf',
		iconColor: 'text-[#4CAF50]',
		bg: '#4CAF5099',
		border: '#4CAF5099',
		iconBg: 'rgba(255,255,255,0.1)',
		pillBg: 'rgba(255,255,255,0.15)',
		pillColor: '#E8F5E9',
		tagBg: 'rgba(255,255,255,0.08)',
		tagColor: '#E8F5E9',
		tagBorder: 'rgba(255,255,255,0.2)',
		count: 4,
		desc:
			'Measures evolutionary conservation across vertebrate species using phylogenetic models, identifying positions under purifying selection that are likely functionally constrained.',
		tools: ['GERP', 'PhyloP 100way', 'PhyloP 30way', 'MACIE Conservation'],
	},
	{
		id: 'regulatory',
		name: 'Regulatory',
		icon: 'tabler:shield',
		iconColor: 'text-[#455A64]',
		bg: '#455A6499',
		border: '#455A6499',
		iconBg: 'rgba(255,255,255,0.1)',
		pillBg: 'rgba(255,255,255,0.15)',
		pillColor: '#ECEFF1',
		tagBg: 'rgba(255,255,255,0.08)',
		tagColor: '#ECEFF1',
		tagBorder: 'rgba(255,255,255,0.2)',
		count: 4,
		desc:
			'Evaluates the regulatory potential of non-coding positions by integrating ENCODE/Roadmap epigenomics data, transcription factor binding sites, and chromatin accessibility signals.',
		tools: ['FUNSEQ2', 'FIRE', 'RegulomeDB', 'MACIE Regulatory'],
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
