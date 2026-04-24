<template>
	<header
		class="fixed top-0 left-0 right-0 z-50 transition-all duration-100"
		:class="
			scrolled
				? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[#E0E6E8]'
				: 'bg-transparent border-b border-transparent'
		"
	>
		<div class="max-w-full px-5 md:px-8">
			<div class="flex items-center justify-between h-16">
				<!-- Logo -->
				<NuxtLink to="/" class="flex items-center gap-3 shrink-0 group" aria-label="NC-SPARK home">
					<div class="relative">
						<NuxtImg
							src="/images/logo.png"
							alt="NC-SPARK Logo"
							class="w-9 h-9 transition-transform duration-500 ease-in-out group-hover:rotate-180"
						/>
						<!-- subtle spark glow -->
						<div
							class="absolute inset-0 rounded-full bg-[#26C6DA]/20 blur-md opacity-0 group-hover:opacity-100 transition"
						/>
					</div>

					<span class="font-display font-bold text-[#1F6F78] text-2xl tracking-tight">
						NC-SPARK
					</span>
				</NuxtLink>

				<!-- Desktop Navigation -->
				<nav class="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
					<a
						v-for="item in navItems"
						:key="item.label"
						:href="item.href"
						class="px-4 py-2 rounded-lg text-sm font-semibold text-[#607D8B] 
						hover:text-[#1F6F78] hover:bg-[#EEF5F7] 
						transition-all duration-200"
					>
						{{ item.label }}
					</a>
				</nav>

				<!-- Desktop CTA -->
				<div class="hidden lg:flex items-center gap-3">
					<NuxtLink
						to="/upload"
						class="px-5 py-2.5 text-sm font-semibold text-white 
						bg-[#26C6DA] rounded-full 
						hover:bg-[#1FA4B8] 
						shadow-md shadow-[#26C6DA]/30 
						transition-all duration-200"
					>
						Try NC-SPARK
					</NuxtLink>
				</div>

				<!-- Mobile toggle -->
				<button
					class="lg:hidden p-2 rounded-lg text-[#455A64] 
					hover:bg-[#EEF5F7] hover:text-[#1F6F78] 
					transition-all"
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
			<div v-if="mobileOpen" class="lg:hidden border-t border-[#E0E6E8] bg-white/95 backdrop-blur-md">
				<nav class="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
					<NuxtLink
						v-for="item in navItems"
						:key="item.label"
						:href="item.href"
						class="px-3 py-2.5 rounded-lg font-semibold text-[#607D8B] 
						hover:bg-[#EEF5F7] hover:text-[#1F6F78] 
						transition-all"
					>
						{{ item.label }}
					</NuxtLink>

					<div class="pt-3 border-t border-[#EEF2F3] mt-2 flex flex-col gap-2">
						<NuxtLink
							to="/upload"
							class="w-full text-center text-sm py-2.5 font-semibold text-white 
							bg-[#26C6DA] rounded-full 
							hover:bg-[#1FA4B8] 
							transition-all"
						>
							Try NC-SPARK
						</NuxtLink>
					</div>
				</nav>
			</div>
		</Transition>
	</header>
</template>

<script setup>
const scrolled = ref(false)
const mobileOpen = ref(false)

const navItems = []

onMounted(() => {
	const onScroll = () => {
		scrolled.value = window.scrollY > 20
	}
	window.addEventListener('scroll', onScroll, { passive: true })
	onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
