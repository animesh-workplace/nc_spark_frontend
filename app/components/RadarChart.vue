<template>
	<div class="max-w-3xl mx-auto w-full mb-0">
		<div class="bg-white/80 backdrop-blur-sm border border-[#E0E6E8] rounded-3xl shadow-md p-6 md:p-8">
			<!-- Title -->
			<div class="text-center mb-6">
				<p class="text-sm text-[#607D8B] font-semibold uppercase tracking-wide mb-2">
					Variant Profile
				</p>
				<p class="font-mono text-lg text-[#263238]">
					chr17:7674220 <span class="text-[#1F6F78] font-semibold">G → A</span>
				</p>
			</div>

			<!-- Radar Chart -->
			<div class="flex justify-center items-center">
				<svg viewBox="0 0 300 300" class="w-64 h-64">
					<!-- Grid circles -->
					<circle cx="150" cy="150" r="100" fill="none" stroke="#E0E6E8" />
					<circle cx="150" cy="150" r="70" fill="none" stroke="#E0E6E8" />
					<circle cx="150" cy="150" r="40" fill="none" stroke="#E0E6E8" />

					<!-- Axes -->
					<line x1="150" y1="150" x2="150" y2="50" stroke="#E0E6E8" />
					<line x1="150" y1="150" x2="250" y2="150" stroke="#E0E6E8" />
					<line x1="150" y1="150" x2="150" y2="250" stroke="#E0E6E8" />
					<line x1="150" y1="150" x2="50" y2="150" stroke="#E0E6E8" />

					<!-- Data polygon -->
					<polygon :points="points" fill="rgba(38,198,218,0.2)" stroke="#26C6DA" stroke-width="2" />

					<!-- Axis labels -->
					<text x="150" y="30" text-anchor="middle" class="fill-[#1F6F78] text-xs font-semibold">
						Pathogenicity
					</text>

					<text x="275" y="155" text-anchor="middle" class="fill-[#455A64] text-xs font-semibold">
						Regulatory
					</text>

					<text x="150" y="285" text-anchor="middle" class="fill-[#7CB342] text-xs font-semibold">
						Replication
					</text>

					<text x="25" y="155" text-anchor="middle" class="fill-[#4CAF50] text-xs font-semibold">
						Conservation
					</text>
				</svg>
			</div>

			<!-- Unified Score -->
			<div class="text-center mt-6">
				<p class="text-xs text-[#607D8B] font-semibold uppercase tracking-wider mb-1">
					Unified Score
				</p>
				<p class="text-3xl font-black text-[#1F6F78]">0.82</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'

/* Normalized scores (0–1) */
const scores = {
	p: 0.78,
	r: 0.64,
	t: 0.52,
	c: 0.91,
}

/* Convert to radar points */
const points = computed(() => {
	const center = 150
	const radius = 100

	const scale = value => value * radius

	const p = scale(scores.p)
	const r = scale(scores.r)
	const t = scale(scores.t)
	const c = scale(scores.c)

	return [
		`${center},${center - p}`, // top
		`${center + r},${center}`, // right
		`${center},${center + t}`, // bottom
		`${center - c},${center}`, // left
	].join(' ')
})
</script>
