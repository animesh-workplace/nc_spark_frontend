<template>
	<footer class="bg-stone-950 pt-16 pb-8" role="contentinfo">
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<!-- Top grid -->
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-14">
				<!-- Brand -->
				<div class="col-span-2 lg:col-span-2">
					<a href="/" class="flex items-center gap-2.5 mb-4">
						<!-- <svg width="32" height="32" viewBox="0 0 34 34" fill="none">
              <rect width="34" height="34" rx="8" fill="#292524"/>
              <path d="M9 7 Q17 13 25 7" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
              <path d="M9 27 Q17 21 25 27" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
              <path d="M9 17 Q17 11 25 17" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" fill="none"/>
              <line x1="13" y1="9.5"  x2="13" y2="15.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
              <line x1="17" y1="11"   x2="17" y2="14"   stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
              <line x1="21" y1="9.5"  x2="21" y2="15.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
              <line x1="13" y1="18.5" x2="13" y2="24.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
              <line x1="17" y1="20"   x2="17" y2="23"   stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
              <line x1="21" y1="18.5" x2="21" y2="24.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
            </svg> -->
						<div>
							<p class="font-display font-bold text-white">NC-SPARK</p>
							<!-- <p class="font-mono text-[10px] text-pink-400 tracking-widest">Non-Coding Variant Profiler</p> -->
						</div>
					</a>
					<p class="text-sm text-stone-400 leading-relaxed max-w-xs mb-5">
						A high-performance meta-aggregator for functional profiling of non-coding genomic variants.
						Built at BRIC · NIBMG, Kalyani.
					</p>
					<div class="flex items-center gap-2.5">
						<a
							v-for="social in socials"
							:key="social.label"
							:href="social.href"
							:aria-label="social.label"
							target="_blank"
							rel="noopener"
							class="w-9 h-9 rounded-lg border border-stone-700 flex items-center justify-center text-stone-500 hover:text-pink-400 hover:border-pink-500 transition-all"
							v-html="social.icon"
						/>
					</div>
				</div>

				<!-- Nav columns -->
				<div v-for="col in footerCols" :key="col.heading">
					<h3 class="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">
						{{ col.heading }}
					</h3>
					<ul class="space-y-2.5" role="list">
						<li v-for="link in col.links" :key="link.label">
							<a
								:href="link.href"
								class="text-sm text-stone-400 hover:text-white transition-colors"
								>{{ link.label }}</a
							>
						</li>
					</ul>
				</div>
			</div>

			<!-- Bottom bar -->
			<div
				class="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500"
			>
				<p>
					© {{ new Date().getFullYear() }} NC-SPARK · BRIC-NIBMG · Kalyani, India. All rights reserved.
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
const footerCols = [
	{
		heading: 'Tool',
		links: [
			{ label: 'Launch Portal', href: '#try' },
			{ label: 'API Reference', href: '#docs' },
			{ label: 'Scoring Domains', href: '#domains' },
			{ label: 'Architecture', href: '#architecture' },
			{ label: 'Integrated Tools', href: '#tools' },
		],
	},
	{
		heading: 'Research',
		links: [
			{ label: 'Publication', href: '#publication' },
			{ label: 'Methods', href: '#methods' },
			{ label: 'Benchmarks', href: '#benchmarks' },
			{ label: 'Use Cases', href: '#usecases' },
			{ label: 'TCGA Analysis', href: '#tcga' },
		],
	},
	{
		heading: 'Project',
		links: [
			{ label: 'GitHub', href: 'https://github.com' },
			{ label: 'Changelog', href: '#changelog' },
			{ label: 'BRIC-NIBMG', href: 'https://www.nibmg.ac.in' },
			{ label: 'Contact', href: '#contact' },
			{ label: 'License', href: '#license' },
		],
	},
]

const socials = [
	{
		label: 'GitHub',
		href: 'https://github.com',
		icon:
			'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>',
	},
	{
		label: 'Twitter',
		href: '#',
		icon:
			'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
	},
]
</script>
