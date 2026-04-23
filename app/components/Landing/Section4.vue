<template>
	<section class="pt-24 bg-pink-50" id="architecture" aria-labelledby="arch-heading">
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<!-- Header -->
			<div class="text-center mb-16 reveal">
				<span
					class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold tracking-widest uppercase mb-6"
				>
					Core Architecture
				</span>
				<h2
					id="arch-heading"
					class="font-display font-black text-stone-950 mb-5 leading-tight"
					style="font-size: clamp(2rem, 4vw, 3rem)"
				>
					Built for speed at genomic scale
				</h2>
				<p class="text-stone-600 text-lg max-w-2xl mx-auto">
					Every layer of the NC-SPARK stack is chosen specifically for the latency and throughput demands
					of billion-row genomic annotation queries.
				</p>
			</div>

			<!-- Architecture flow diagram -->
			<div class="mb-20 reveal">
				<div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
					<div
						v-for="(node, i) in flowNodes"
						:key="node.label"
						class="flex flex-col md:flex-row items-center gap-4 md:gap-0 w-full md:w-auto"
					>
						<!-- Node card -->
						<div
							class="bg-white rounded-2xl border p-5 text-center w-full md:w-40 shrink-0 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
							:style="{ borderColor: node.border }"
						>
							<div
								class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl"
								:style="{ background: node.iconBg }"
							>
								{{ node.icon }}
							</div>
							<p class="font-mono text-xs font-bold mb-1" :class="node.color">
								{{ node.tag }}
							</p>
							<p class="font-display font-bold text-stone-950 text-sm">
								{{ node.label }}
							</p>
							<p class="text-[11px] text-stone-400 mt-1 leading-tight">
								{{ node.sub }}
							</p>
						</div>
						<!-- Arrow — desktop horizontal -->
						<div
							v-if="i < flowNodes.length - 1"
							class="hidden md:flex items-center justify-center w-10 shrink-0"
						>
							<svg width="28" height="14" viewBox="0 0 28 14" fill="none">
								<path d="M0 7 H22" stroke="#d6d3d1" stroke-width="1.5" />
								<path
									d="M18 3 L26 7 L18 11"
									stroke="#a8a29e"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									fill="none"
								/>
							</svg>
						</div>
						<!-- Arrow — mobile vertical -->
						<div v-if="i < flowNodes.length - 1" class="flex md:hidden">
							<svg width="14" height="24" viewBox="0 0 14 24" fill="none">
								<path d="M7 0 V18" stroke="#d6d3d1" stroke-width="1.5" />
								<path
									d="M3 14 L7 22 L11 14"
									stroke="#a8a29e"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
									fill="none"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Tech stack detail cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div
					v-for="tech in techStack"
					:key="tech.name"
					class="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all reveal"
				>
					<div class="flex items-center gap-3 mb-4">
						<div
							class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
							:style="{ background: tech.iconBg }"
						>
							{{ tech.icon }}
						</div>
						<div>
							<p class="font-display font-bold text-stone-950">
								{{ tech.name }}
							</p>
							<p class="text-xs font-mono font-semibold" :class="tech.color">
								{{ tech.tag }}
							</p>
						</div>
					</div>
					<p class="text-sm text-stone-600 leading-relaxed mb-4">
						{{ tech.desc }}
					</p>
					<ul class="space-y-1.5">
						<li
							v-for="feat in tech.features"
							:key="feat"
							class="flex items-center gap-2 text-xs text-stone-600"
						>
							<Icon name="tabler-check" :class="tech.color" />
							{{ feat }}
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="mt-10 h-20 bg-linear-to-b from-transparent to-white" aria-hidden="true" />
	</section>
</template>

<script setup lang="ts">
const flowNodes = [
	{
		icon: '📂',
		tag: 'Input',
		iconBg: '#fce7f3',
		border: '#fbcfe8',
		label: 'VCF / CSV',
		color: 'text-[#db2777]',
		sub: 'VCF or tabular upload',
	},
	{
		icon: '⚡',
		tag: 'API',
		label: 'FastAPI',
		iconBg: '#fef3c7',
		border: '#fde68a',
		color: 'text-[#d97706]',
		sub: 'Async · normalization',
	},
	{
		icon: '🗄️',
		tag: 'Engine',
		label: 'Database',
		iconBg: '#dcfce7',
		border: '#bbf7d0',
		color: 'text-[#16a34a]',
		sub: 'Columnar · vectorized',
	},
	{
		icon: '🔬',
		tag: 'Process',
		iconBg: '#ede9fe',
		border: '#ddd6fe',
		label: 'Scoring Logic',
		color: 'text-[#7c3aed]',
		sub: 'Multi-domain join',
	},
	{
		icon: '📊',
		tag: 'Output',
		iconBg: '#fce7f3',
		border: '#fbcfe8',
		label: 'Ranked Results',
		color: 'text-[#db2777]',
		sub: 'Normalized · prioritized',
	},
]

const techStack = [
	{
		icon: '🗄️',
		name: 'Engine',
		iconBg: '#dcfce7',
		tag: 'Database Layer',
		color: 'text-[#16a34a]',
		desc:
			'Columnar analytical database purpose-built for OLAP workloads. Enables sub-second retrieval across datasets spanning billions of pre-annotated variant rows using vectorized query execution.',
		features: [
			'Columnar storage + LZ4/ZSTD compression',
			'Bloom filter skip indexes on (chr, pos, ref, alt)',
			'Vectorized query execution engine',
			'ORDER BY (chr, pos, ref, alt) primary key',
		],
	},
	{
		icon: '⚡',
		name: 'FastAPI',
		iconBg: '#fef3c7',
		color: 'text-[#d97706]',
		tag: 'API Layer · Python',
		desc:
			'Asynchronous Python API framework managing concurrent variant annotation requests, VCF parsing, allele normalization, and session-based batch processing pipelines.',
		features: [
			'Async/await for concurrent batch jobs',
			'VCF normalization (left-align, trim)',
			'Session-based upload & progress tracking',
			'Celery + Redis task queue for large batches',
		],
	},
	{
		icon: '🧬',
		iconBg: '#ede9fe',
		tag: 'Scoring Logic',
		color: 'text-[#7c3aed]',
		name: 'Prioritization Engine',
		desc:
			'Single-pass join against the pre-annotated knowledgebase replaces running individual tools. Normalization harmonizes raw scores from diverse tools for comparative multi-domain ranking.',
		features: [
			'Single-pass join replaces individual CLI tools',
			'Score normalization across incompatible scales',
			'Multi-domain ranking (pathogenicity + conservation)',
			'GRCh38/hg38 coordinate-indexed mapping',
		],
	},
]
</script>
