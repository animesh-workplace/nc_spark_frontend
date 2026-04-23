<template>
	<header
		class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
		:class="
			scrolled
				? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200'
				: 'bg-transparent border-b border-transparent'
		"
	>
		<div class="max-w-7xl mx-auto px-5 md:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-2.5 shrink-0 group" aria-label="NC-SPARK home">
					<!-- DNA icon — warm-tinted for Outseta palette -->
					<!-- <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true" class="group-hover:scale-105 transition-transform duration-200">
            <rect width="34" height="34" rx="8" fill="#1c1917"/>
            <path d="M9 7 Q17 13 25 7" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path d="M9 27 Q17 21 25 27" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
            <path d="M9 17 Q17 11 25 17" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" fill="none"/>
            <line x1="13" y1="9.5" x2="13" y2="15.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
            <line x1="17" y1="11"  x2="17" y2="14"   stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
            <line x1="21" y1="9.5" x2="21" y2="15.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
            <line x1="13" y1="18.5" x2="13" y2="24.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
            <line x1="17" y1="20"   x2="17" y2="23"   stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
            <line x1="21" y1="18.5" x2="21" y2="24.5" stroke="#db2777" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
          </svg> -->
					<div class="leading-none">
						<span class="font-display font-bold text-stone-950 text-lg tracking-tight">NC-SPARK</span>
						<!-- <span class="hidden sm:block text-[10px] font-mono text-pink-600 tracking-widest uppercase opacity-80">Non-Coding Variant Profiler</span> -->
					</div>
				</a>

				<!-- Desktop Navigation -->
				<nav class="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
					<a
						v-for="item in navItems"
						:key="item.label"
						:href="item.href"
						class="px-3.5 py-2 rounded-lg text-sm font-semibold text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-all duration-150"
					>
						{{ item.label }}
					</a>
				</nav>

				<!-- Desktop CTA -->
				<div class="hidden lg:flex items-center gap-3">
					<a
						href="#try"
						class="px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-all"
						>Try NC-SPARK</a
					>
				</div>

				<!-- Mobile toggle -->
				<button
					class="lg:hidden p-2 rounded-lg hover:bg-stone-100 transition-all text-stone-700"
					@click="mobileOpen = !mobileOpen"
					:aria-expanded="mobileOpen"
					aria-label="Toggle menu"
				>
					<svg
						v-if="!mobileOpen"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M3 12h18M3 6h18M3 18h18" />
					</svg>
					<svg
						v-else
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M18 6 6 18M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile menu -->
		<Transition
			enter-active-class="transition-all duration-200 ease-out"
			enter-from-class="opacity-0 -translate-y-2"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition-all duration-150 ease-in"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div v-if="mobileOpen" class="lg:hidden border-t border-stone-200 bg-white/98 backdrop-blur-sm">
				<nav class="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
					<a
						v-for="item in navItems"
						:key="item.label"
						:href="item.href"
						class="px-3 py-2.5 rounded-lg font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 transition-all"
					>
						{{ item.label }}
					</a>
					<div class="pt-3 border-t border-stone-100 mt-2 flex flex-col gap-2">
						<a
							href="#docs"
							class="w-full text-center text-sm py-2.5 font-semibold text-stone-700 border border-stone-300 rounded-full hover:border-stone-500 transition-all"
							>Documentation</a
						>
						<a
							href="#try"
							class="w-full text-center text-sm py-2.5 font-semibold text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-all"
							>Try NC-SPARK</a
						>
					</div>
				</nav>
			</div>
		</Transition>
	</header>
</template>

<script setup lang="ts">
const scrolled = ref(false)
const mobileOpen = ref(false)

const navItems = [
	{ label: 'Features', href: '#features' },
	{ label: 'Scoring Domains', href: '#domains' },
	{ label: 'Architecture', href: '#architecture' },
	{ label: 'Tools', href: '#tools' },
	// { label: "Publication", href: "#publication" },
]

onMounted(() => {
	const onScroll = () => {
		scrolled.value = window.scrollY > 20
	}
	window.addEventListener('scroll', onScroll, { passive: true })
	onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
