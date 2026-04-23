<template>
	<section class="py-16 bg-amber-50" id="tools" aria-labelledby="pub-heading">
		<div class="max-w-5xl mx-auto px-5 md:px-8">
			<!-- All tools table header -->
			<div class="text-center mb-14 reveal">
				<span
					class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold tracking-widest uppercase mb-6"
				>
					Integrated Tools Reference
				</span>
				<h2
					id="pub-heading"
					class="font-display font-black text-stone-950 mb-5 leading-tight"
					style="font-size: clamp(1.75rem, 3.5vw, 2.75rem)"
				>
					25+ tools, four domains, one interface
				</h2>
				<p class="text-stone-600 max-w-xl mx-auto leading-relaxed">
					Every tool integrated into NC-SPARK is listed below with its biological domain, score
					directionality, and reference genome.
				</p>
			</div>

			<!-- Table -->
			<div class="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm mb-20 reveal">
				<div class="overflow-x-auto">
					<table class="w-full text-sm" aria-label="NC-SPARK integrated tools">
						<thead>
							<tr class="border-b border-stone-100 bg-stone-50">
								<th
									class="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-500"
								>
									Tool
								</th>
								<th
									class="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-500"
								>
									Domain
								</th>
								<th
									class="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-500 hidden md:table-cell"
								>
									Score Direction
								</th>
								<th
									class="text-left px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-stone-500 hidden lg:table-cell"
								>
									Notes
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(tool, i) in tools"
								:key="tool.name"
								class="border-b border-stone-50 hover:bg-stone-50 transition-colors"
								:class="i % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'"
							>
								<td class="px-5 py-3">
									<span
										class="font-mono text-xs font-bold"
										:style="{ color: domainColors[tool.domain] }"
										>{{ tool.name }}</span
									>
								</td>
								<td class="px-5 py-3">
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
										:style="{
											background: domainPillBg[tool.domain],
											color: domainPillColor[tool.domain],
										}"
										>{{ tool.domain }}</span
									>
								</td>
								<td class="px-5 py-3 hidden md:table-cell">
									<span class="text-xs text-stone-600 flex items-center gap-1.5">
										<svg
											v-if="tool.dir === 'higher'"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#16a34a"
											stroke-width="2.5"
										>
											<path d="M12 19V5M5 12l7-7 7 7" />
										</svg>
										<svg
											v-else-if="tool.dir === 'lower'"
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#dc2626"
											stroke-width="2.5"
										>
											<path d="M12 5v14M5 12l7 7 7-7" />
										</svg>
										<svg
											v-else
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#a8a29e"
											stroke-width="2.5"
										>
											<path d="M8 12h8" />
										</svg>
										{{
											tool.dir === 'higher'
												? 'Higher = more deleterious'
												: tool.dir === 'lower'
												? 'Lower = more conserved'
												: 'Probability score'
										}}
									</span>
								</td>
								<td class="px-5 py-3 text-xs text-stone-500 hidden lg:table-cell">
									{{ tool.note }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const domainColors: Record<string, string> = {
	pathogenicity: '#be123c',
	conservation: '#166534',
	regulatory: '#5b21b6',
	replication: '#92400e',
}
const domainPillBg: Record<string, string> = {
	pathogenicity: '#fee2e2',
	conservation: '#dcfce7',
	regulatory: '#ede9fe',
	replication: '#fef3c7',
}
const domainPillColor: Record<string, string> = {
	pathogenicity: '#991b1b',
	conservation: '#14532d',
	regulatory: '#4c1d95',
	replication: '#78350f',
}

const tools = [
	// Pathogenicity
	{
		name: 'CADD',
		domain: 'pathogenicity',
		dir: 'higher',
		note: 'Combined Annotation-Dependent Depletion (Phred-scaled)',
	},
	{
		name: 'CSCAPE_NONCODING',
		domain: 'pathogenicity',
		dir: 'prob',
		note: 'Cancer-specific non-coding pathogenicity score',
	},
	{
		name: 'DANN',
		domain: 'pathogenicity',
		dir: 'prob',
		note: 'Deep learning retraining of CADD features',
	},
	{
		name: 'FATHMM-MKL',
		domain: 'pathogenicity',
		dir: 'prob',
		note: 'Multiple kernel learning functional annotation',
	},
	{
		name: 'FATHMM-XF',
		domain: 'pathogenicity',
		dir: 'prob',
		note: 'Deep learning extension of FATHMM',
	},
	{
		name: 'GPN',
		domain: 'pathogenicity',
		dir: 'prob',
		note: 'Genomic pre-trained network (DNA language model)',
	},
	{
		name: 'GWRVIS',
		domain: 'pathogenicity',
		dir: 'higher',
		note: 'Population constraint on non-coding regions',
	},
	{
		name: 'JARVIS',
		domain: 'pathogenicity',
		dir: 'higher',
		note: 'Genome-wide constraint based on population variation',
	},
	{
		name: 'LINSIGHT',
		domain: 'pathogenicity',
		dir: 'higher',
		note: 'Functional and evolutionary constraint integration',
	},
	{
		name: 'NCER',
		domain: 'pathogenicity',
		dir: 'higher',
		note: 'Non-coding essential region score',
	},
	{
		name: 'ORION',
		domain: 'pathogenicity',
		dir: 'higher',
		note: 'Optimal non-coding region importance score',
	},
	{
		name: 'REMM',
		domain: 'pathogenicity',
		dir: 'prob',
		note: 'Regulatory Mendelian Mutation score (ENCODE)',
	},
	// Conservation
	{
		name: 'GERP',
		domain: 'conservation',
		dir: 'higher',
		note: 'Genomic evolutionary rate profiling (rejected subs.)',
	},
	{
		name: 'PhyloP_100way',
		domain: 'conservation',
		dir: 'higher',
		note: '100-vertebrate species phylogenetic conservation',
	},
	{
		name: 'PhyloP_30way',
		domain: 'conservation',
		dir: 'higher',
		note: '30-mammal phylogenetic conservation (UCSC)',
	},
	{
		name: 'MACIE_CONSERVED',
		domain: 'conservation',
		dir: 'higher',
		note: 'MACIE conservation component score',
	},
	// Regulatory
	{
		name: 'FUNSEQ2',
		domain: 'regulatory',
		dir: 'higher',
		note: 'Functional sequencing score for regulatory variants',
	},
	{
		name: 'FIRE',
		domain: 'regulatory',
		dir: 'prob',
		note: 'Functional inference of regulatory elements',
	},
	{
		name: 'REGULOMEDB',
		domain: 'regulatory',
		dir: 'lower',
		note: 'Lower rank = higher regulatory evidence (1a–7)',
	},
	{
		name: 'MACIE_REGULATORY',
		domain: 'regulatory',
		dir: 'higher',
		note: 'MACIE regulatory component score',
	},
	// Replication Timing
	{
		name: 'RepliSeq_G1b',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase G1b (early replication)',
	},
	{
		name: 'RepliSeq_S1',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S1',
	},
	{
		name: 'RepliSeq_S2',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S2',
	},
	{
		name: 'RepliSeq_S3',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S3',
	},
	{
		name: 'RepliSeq_S4',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S4',
	},
	{
		name: 'RepliSeq_G2',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase G2 (late replication)',
	},
]
</script>
