<template>
	<section>
		<div
			class="flex gap-4 items-start sm:items-center px-4 py-5 mb-12 text-sm text-white rounded-2xl bg-[#1F6F78]"
		>
			<Icon name="tabler:circle-letter-c-filled" class="w-7! h-7!" />
			<p><span class="font-bold text-xl font-display">Variant prioritization & multi-hit discovery</span></p>
		</div>

		<div class="my-5">
			<div class="flex justify-center my-3">
				<div class="max-w-lg w-full">
					<SelectButton
						fluid
						v-model="statMode"
						@change="FetchData"
						option-label="label"
						option-value="value"
						:allow-empty="false"
						:options="statOptions"
						:pt="{
							pcToggleButton: ({ props }) => ({
								content: '!rounded-xl !transition-all !duration-200',
								root:
									'!bg-[#1F6F78]/35 !border-transparent !text-slate-800 hover:!bg-[#1F6F78]/55',
							}),
						}"
					/>
				</div>
			</div>

			<DashboardTopVariant
				:results="topVariantsData.results"
				:cross-group-hits="topVariantsData.cross_group_hits"
			/>
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/GeneAPI'
const { TopVariantsAPI } = useGeneAPI()

const isLoading = ref(true)
const statMode = ref('median')
const statOptions = [
	{ label: 'Median', value: 'median' },
	{ label: 'Mean', value: 'mean' },
	{ label: 'Min', value: 'min' },
	{ label: 'Max', value: 'max' },
]
const topVariantsData = ref({ results: {}, cross_group_hits: [] })

const FetchData = async () => {
	try {
		const response = await TopVariantsAPI('01e96769-69c1-40d4-aecf-3c6cae17eb9d', {
			limit: 10,
			rank_by: statMode.value,
		})
		topVariantsData.value = response
	} catch (error) {
		console.error('Error fetching data:', error)
	} finally {
		isLoading.value = false
	}
}

onMounted(() => {
	nextTick(async () => {
		await FetchData()
	})
})
</script>

<style scoped></style>
