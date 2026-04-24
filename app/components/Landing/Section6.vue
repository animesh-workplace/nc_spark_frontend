<template>
	<section class="py-20 relative bg-[#a8ca88]" id="tools">
		<!-- subtle background field -->
		<div
			class="absolute inset-0 pointer-events-none opacity-50"
			style="
				background:
				radial-gradient(circle at 20% 30%, rgba(38,198,218,0.08), transparent 50%),
				radial-gradient(circle at 80% 70%, rgba(76,175,80,0.08), transparent 50%);
			"
		></div>

		<div class="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
			<!-- Header -->
			<div class="text-center mb-14">
				<span
					class="inline-flex px-4 py-1.5 rounded-full bg-[#263238] text-white text-xs font-bold uppercase mb-6"
				>
					Integrated Tools Reference
				</span>

				<h2
					class="font-display font-black text-[#263238] mb-5 leading-tight"
					style="font-size: clamp(1.75rem, 3.5vw, 2.75rem)"
				>
					25+ tools. Four domains. One system.
				</h2>

				<p class="text-[#607D8B] max-w-xl mx-auto">
					All integrated scoring models with domain classification and normalized interpretation
					behavior.
				</p>
			</div>

			<!-- TABLE -->
			<div
				class="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#E0E6E8] overflow-hidden shadow-sm"
			>
				<div class="overflow-x-auto max-h-[520px]">
					<table class="w-full text-sm">
						<!-- HEADER -->
						<thead class="sticky top-0 bg-[#F4F8FA] border-b border-[#E0E6E8] z-10">
							<tr>
								<th
									class="px-5 py-5 text-xs font-bold uppercase tracking-widest text-[#90A4AE] text-center"
								>
									Tool
								</th>
								<th
									class="px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#90A4AE] text-center"
								>
									Domain
								</th>
								<th
									class="px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#90A4AE] text-center hidden md:table-cell"
								>
									Direction
								</th>
								<th
									class="px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#90A4AE] text-center hidden lg:table-cell"
								>
									Description
								</th>
							</tr>
						</thead>

						<tbody>
							<tr
								v-for="(tool, i) in tools"
								:key="tool.name"
								class="group border-b border-[#F0F3F4] transition-all text-center"
								:class="i % 2 === 0 ? 'bg-white' : 'bg-[#FAFCFD]'"
							>
								<!-- TOOL -->
								<td
									class="px-5 py-3 font-semibold text-xs"
									:style="{ color: domainColors[tool.domain] }"
								>
									{{ tool.name }}
								</td>

								<!-- DOMAIN -->
								<td class="px-5 py-3">
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
										:style="{
											background: domainPillBg[tool.domain],
											color: domainPillColor[tool.domain],
										}"
									>
										{{ tool.domain }}
									</span>
								</td>

								<!-- DIRECTION -->
								<td class="px-5 py-3 hidden md:table-cell text-xs text-[#607D8B]">
									<span class="flex items-center justify-center gap-1.5">
										<span v-if="tool.dir === 'higher'" class="text-[#1F6F78] font-semibold">
											↑ Higher = deleterious
										</span>

										<span
											v-else-if="tool.dir === 'lower'"
											class="text-[#7CB342] font-semibold"
										>
											↓ Lower = conserved
										</span>

										<span v-else class="text-[#455A64] font-semibold">
											Probability
										</span>
									</span>
								</td>

								<!-- DESCRIPTION -->
								<td class="px-5 py-3 text-xs text-[#90A4AE] hidden lg:table-cell">
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

<script setup>
const domainColors = {
	pathogenicity: '#1F6F78',
	conservation: '#4CAF50',
	regulatory: '#455A64',
	replication: '#7CB342',
}

const domainPillBg = {
	pathogenicity: '#1F6F781A',
	conservation: '#4CAF501A',
	regulatory: '#455A641A',
	replication: '#7CB3421A',
}

const domainPillColor = {
	pathogenicity: '#1F6F78',
	conservation: '#4CAF50',
	regulatory: '#455A64',
	replication: '#7CB342',
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
		name: 'PhyloP 100way',
		domain: 'conservation',
		dir: 'higher',
		note: '100-vertebrate species phylogenetic conservation',
	},
	{
		name: 'PhyloP 30way',
		domain: 'conservation',
		dir: 'higher',
		note: '30-mammal phylogenetic conservation (UCSC)',
	},
	{
		name: 'MACIE CONSERVED',
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
		name: 'MACIE REGULATORY',
		domain: 'regulatory',
		dir: 'higher',
		note: 'MACIE regulatory component score',
	},
	// Replication Timing
	{
		name: 'RepliSeq G1b',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase G1b (early replication)',
	},
	{
		name: 'RepliSeq S1',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S1',
	},
	{
		name: 'RepliSeq S2',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S2',
	},
	{
		name: 'RepliSeq S3',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S3',
	},
	{
		name: 'RepliSeq S4',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase S4',
	},
	{
		name: 'RepliSeq G2',
		domain: 'replication',
		dir: 'prob',
		note: 'Replication timing phase G2 (late replication)',
	},
]
</script>
