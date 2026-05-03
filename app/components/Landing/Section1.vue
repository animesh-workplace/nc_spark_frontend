<template>
	<section
		@mousemove="handleMove"
		@mouseleave="resetField"
		class="hero-gradient relative overflow-hidden pt-28 pb-0 min-h-screen flex flex-col"
	>
		<div class="thatch-overlay"></div>

		<div class="max-w-7xl mx-auto px-5 md:px-8 text-center relative z-10 flex-1 flex flex-col justify-center">
			<!-- Headline -->
			<h1
				class="font-display font-black text-[#263238] leading-[1.05] mb-3 flex gap-4 justify-center items-center"
				style="font-size: clamp(3rem, 7vw, 5.5rem);"
			>
				<NuxtImg src="/images/logo.png" class="w-20 h-20" />
				<span class="text-[#1F6F78]">NC-SPARK</span>
			</h1>

			<p
				class="font-display font-semibold text-[#455A64] mb-6"
				style="font-size: clamp(1rem, 2.2vw, 1.5rem); letter-spacing: -0.01em;"
			>
				Non-coding · Scoring · Prioritization · And Ranking · Knowledgebase
			</p>

			<!-- Sub-heading -->
			<p class="text-[#607D8B] text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
				A high-performance meta-aggregator for functional profiling of non-coding variants. One query
				replaces dozens of manual tool lookups —
				<span class="text-[#1F6F78] font-semibold">CADD</span>,
				<span class="text-[#4CAF50] font-semibold">GERP</span>,
				<span class="text-[#455A64] font-semibold">REMM</span>,
				<span class="text-[#7CB342] font-semibold">PhyloP</span>
				and 20+ more, returned in milliseconds.
			</p>

			<!-- CTAs -->
			<div class="flex flex-wrap justify-center gap-3 mb-14">
				<NuxtLink
					to="/upload"
					class="px-8 py-3.5 text-base font-semibold text-white bg-[#26C6DA] rounded-full hover:bg-[#1FA4B8] transition-all shadow-lg shadow-[#26C6DA]/30"
				>
					Launch Portal
				</NuxtLink>
			</div>

			<!-- Stats bar -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto w-full">
				<div
					v-for="stat in stats"
					:key="stat.label"
					class="bg-white border border-[#E0E6E8] rounded-2xl px-5 py-4 text-center shadow-sm"
				>
					<p class="font-display font-black text-2xl md:text-3xl text-[#263238] mb-0.5">
						{{ stat.value }}
					</p>
					<p class="text-xs font-semibold text-[#607D8B] uppercase tracking-wider">
						{{ stat.label }}
					</p>
				</div>
			</div>
		</div>

		<!-- 🔥 LIVE TABLE (REPLACES TERMINAL) -->
		<LandingLiveTable />
		<div class="h-12 bg-linear-to-b from-transparent to-[#EEF5F7]" />
	</section>
</template>

<script setup>
const stats = [
	{ value: '8B+', label: 'Pre-annotated rows' },
	{ value: '25+', label: 'Integrated tools' },
	{ value: '<50ms', label: 'Median query latency' },
	{ value: '4', label: 'Biological domains' },
]

const handleMove = e => {
	const rect = e.currentTarget.getBoundingClientRect()
	const x = ((e.clientX - rect.left) / rect.width) * 100
	const y = ((e.clientY - rect.top) / rect.height) * 100
	e.currentTarget.style.setProperty('--mx', `${x}%`)
	e.currentTarget.style.setProperty('--my', `${y}%`)
}

const resetField = e => {
	e.currentTarget.style.setProperty('--mx', `50%`)
	e.currentTarget.style.setProperty('--my', `40%`)
}
</script>
