<template>
	<Menubar
		:model="items"
		:pt="{
			start: '!bg-[#025964]',
			rootList: '!bg-[#025964]',
			itemContent: 'group !rounded-2xl',
			root: '!bg-[#025964] shadow !border-0 !justify-between !px-7 !py-4 top-0 z-50 !sticky',
		}"
	>
		<!-- Dont forget to add !sticky to root in menubar -->
		<template #start>
			<div class="flex items-center hover:scale-105 transition-transform duration-500 ease-in-out">
				<div class="text-2xl font-extrabold cursor-pointer">
					<span class="text-white">NC-SPARK</span>
				</div>
			</div>
		</template>

		<template #item="{ item, props }">
			<NuxtLink
				v-ripple
				:to="item.href"
				v-if="item.type === 'button'"
				class="flex items-center py-2 rounded-2xl px-3"
			>
				<div class="flex items-center gap-2">
					<Icon :name="item.icon" class="w-5! h-5! text-blue-50 group-hover:text-[#025964]" />
					<span class="text-white group-hover:text-[#025964]"> {{ item.label }} </span>
				</div>
			</NuxtLink>

			<div class="flex items-center py-2 rounded-2xl px-3" v-else @click="item.action">
				<div class="flex items-center">
					<Icon
						:name="item.icon_dark"
						v-if="colorMode == 'light'"
						class="w-5! h-5! text-blue-50 group-hover:text-[#025964]"
					/>
					<Icon
						:name="item.icon_light"
						class="w-5! h-5! text-blue-50 group-hover:text-[#025964]"
						v-else
					/>
					<span class="text-white group-hover:text-[#025964]"> {{ item.label }} </span>
				</div>
			</div>
		</template>
	</Menubar>
</template>

<script setup>
const { colorMode, toggle } = useTheme()

const items = ref([
	{ label: 'Home', icon: 'solar:home-2-bold-duotone', href: '/viewer', type: 'button' },
	// { label: 'AI Search', icon: 'solar:magnifer-bold-duotone', href: '/vocal', type: 'button' },
	// { label: 'Help', icon: 'solar:question-square-bold-duotone', href: '/help', type: 'button' },
	// { label: 'Contact us', icon: 'solar:user-speak-bold-duotone', href: '/contact', type: 'button' },
	// {
	// 	label: '',
	// 	icon_light: 'solar:sun-2-bold-duotone',
	// 	icon_dark: 'solar:moon-bold-duotone',
	// 	action: toggle,
	// 	type: 'action',
	// },
	// { label: 'Test', icon: 'solar:code-scan-bold-duotone', href: '/test', type: 'button' },
])
</script>
