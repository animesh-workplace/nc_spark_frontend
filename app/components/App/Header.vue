<template>
	<header
		class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
		:class="
			scrolled
				? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200'
				: 'bg-transparent border-b border-transparent'
		"
	>
		<div class="max-w-full px-5 md:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<NuxtLink to="/" class="flex items-center gap-2 shrink-0 group" aria-label="NC-SPARK home">
					<NuxtImg
						src="/images/logo.png"
						alt="NC-SPARK Logo"
						class="w-8 h-8 transform transition-transform duration-500 ease-in-out group-hover:rotate-180"
					/>
					<div class="leading-none">
						<span class="font-display font-bold text-stone-950 text-2xl tracking-tight">NC-SPARK</span>
					</div>
				</NuxtLink>

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
					<NuxtLink
						to="/upload"
						class="px-4 py-2 text-sm font-semibold text-white bg-pink-600 rounded-full hover:bg-pink-700 transition-all"
					>
						Try NC-SPARK
					</NuxtLink>
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
	// { label: 'Features', href: '#features' },
	// { label: 'Scoring Domains', href: '#domains' },
	// { label: 'Architecture', href: '#architecture' },
	// { label: 'Tools', href: '#tools' },
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
