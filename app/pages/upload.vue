<!-- pages/upload.vue -->
<template>
	<div
		class="min-h-screen pt-16 pb-16 relative overflow-hidden"
		@mousemove="handleMove"
		style="
            background:
            radial-gradient(circle at var(--mx,50%) var(--my,40%), rgba(38,198,218,0.08), transparent 40%),
            linear-gradient(135deg, #f8fbfc 0%, #eef5f7 50%, #e8f5e9 100%);
        "
	>
		<div class="max-w-7xl mx-auto px-5 md:px-8 pt-12">
			<!-- Header -->
			<div class="text-center mb-10">
				<span
					class="inline-flex px-4 py-1.5 rounded-full bg-[#263238] text-white text-xs font-bold uppercase mb-5"
				>
					Variant Upload
				</span>
				<h1 class="font-display font-black text-[#263238] mb-3 text-3xl">
					Upload your variant file
				</h1>
				<p class="text-[#607D8B] max-w-md mx-auto text-sm">
					Submit a VCF or TSV file. NC-SPARK annotates variants across 25+ scoring systems.
				</p>
			</div>

			<!-- Main Card -->
			<div class="bg-white/85 backdrop-blur-md rounded-3xl border border-[#E0E6E8] shadow-lg">
				<!-- FORM -->
				<template v-if="stage === 'idle' || stage === 'error'">
					<div class="p-7 md:p-10">
						<div class="mb-7">
							<label class="block text-sm font-semibold text-[#455A64] mb-2">
								Variant file <span class="text-red-500">*</span>
							</label>
							<div ref="pondEl" />
						</div>

						<div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
							<div>
								<label class="block text-sm font-semibold text-[#455A64] mb-2">
									Reference genome
								</label>
								<SelectButton
									v-model="genome"
									:options="genomeOptions"
									optionLabel="label"
									optionValue="value"
									class="w-full nc-select"
								/>
							</div>
							<div>
								<label class="block text-sm font-semibold text-[#455A64] mb-2">
									File format
								</label>
								<SelectButton
									v-model="fileFormat"
									:options="formatOptions"
									optionLabel="label"
									optionValue="value"
									class="w-full nc-select"
								/>
							</div>
						</div>

						<div
							v-if="stage === 'error'"
							class="mb-6 text-sm text-[#C62828] bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl px-4 py-3"
						>
							{{ errorMessage }}
						</div>

						<button
							@click="handleSubmit"
							:disabled="!selectedFile"
							class="w-full py-3.5 rounded-xl font-semibold transition-all"
							:class="
								selectedFile
									? 'bg-[#26C6DA] text-white hover:bg-[#1F6F78]'
									: 'bg-[#ECEFF1] text-[#90A4AE] cursor-not-allowed'
							"
						>
							Annotate variants
						</button>
					</div>
				</template>

				<!-- VALIDATING -->
				<template v-else-if="stage === 'validating'">
					<div class="p-10 text-center">
						<div class="text-[#26C6DA] text-4xl mb-4">⏳</div>
						<p class="text-[#607D8B]">Validating file…</p>
					</div>
				</template>

				<!-- UPLOADING -->
				<template v-else-if="stage === 'uploading'">
					<div class="p-10 text-center">
						<p class="mb-4 text-[#607D8B]">Uploading… {{ formatBytes(selectedFile?.size ?? 0) }}</p>
						<div class="h-2 bg-[#ECEFF1] rounded-full overflow-hidden">
							<div
								class="h-full bg-[#26C6DA] rounded-full transition-all duration-300"
								:style="{ width: uploadProgress + '%' }"
							/>
						</div>
						<p class="text-xs text-[#90A4AE] mt-2">{{ uploadProgress }}%</p>
					</div>
				</template>

				<!-- POLLING -->
				<template v-else-if="stage === 'polling'">
					<div class="p-10 text-center">
						<p class="text-[#607D8B] mb-4">Annotating variants…</p>
						<p class="text-[#1F6F78] font-bold text-xl">{{ annotatedCount }} / {{ variantCount }}</p>
					</div>
				</template>

				<!-- COMPLETE -->
				<template v-else-if="stage === 'complete'">
					<div class="p-10 text-center">
						<div class="text-4xl mb-4">✅</div>
						<p class="text-[#1F6F78] font-bold">Annotation complete — redirecting…</p>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import SelectButton from 'primevue/selectbutton'

useSeoMeta({
	title: 'Upload Variants — NC-SPARK',
	description: 'Upload a VCF or TSV file to annotate non-coding variants across 25+ integrated scoring tools.',
})

const { stage, errorMessage, sessionId, variantCount, annotatedCount, uploadProgress, submit, reset } = useUpload()

const genome = ref<'hg38' | 'hg19'>('hg38')
const fileFormat = ref<'vcf' | 'tsv'>('tsv')
const selectedFile = ref<File | null>(null)

const genomeOptions = [
	{ label: 'hg38', value: 'hg38' },
	{ label: 'hg19', value: 'hg19' },
]
const formatOptions = [
	{ label: 'VCF', value: 'vcf' },
	{ label: 'TSV', value: 'tsv' },
]

// ── FilePond ──────────────────────────────────────────────────────────────────
const pondEl = ref<HTMLDivElement | null>(null)
let pondInstance: any = null

onMounted(async () => {
	const { create, registerPlugin } = await import('filepond')
	const FilePondPluginType = await import('filepond-plugin-file-validate-type')
	registerPlugin(FilePondPluginType.default)

	if (!pondEl.value) return

	pondInstance = create(pondEl.value, {
		allowMultiple: false,
		acceptedFileTypes: ['text/plain', 'text/tab-separated-values', 'text/csv', 'application/octet-stream', ''],
		labelIdle:
			'<span class="font-semibold text-stone-700">Drop your file here</span> <span class="text-stone-400">or</span> <span class="text-[#1F6F78] font-semibold cursor-pointer">browse</span>',
		server: null,
		instantUpload: false,
		onaddfile: (_err: any, fileItem: any) => {
			if (!_err) selectedFile.value = fileItem.file as File
		},
		onremovefile: () => {
			selectedFile.value = null
			if (stage.value === 'error') reset()
		},
	})
})

onUnmounted(() => pondInstance?.destroy())

// ── Handlers ──────────────────────────────────────────────────────────────────
async function handleSubmit() {
	if (!selectedFile.value) return
	await submit(selectedFile.value, genome.value, fileFormat.value)
}

function handleMove(e: MouseEvent) {
	const el = e.currentTarget as HTMLElement
	const rect = el.getBoundingClientRect()
	el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
	el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
	if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
	return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}

// ── Redirect on complete ──────────────────────────────────────────────────────
const router = useRouter()
watch(stage, s => {
	if (s === 'complete' && sessionId.value) {
		setTimeout(() => router.push(`/analysis/${sessionId.value}`), 1200)
	}
})
</script>

<style>
@import 'filepond/dist/filepond.min.css';
</style>

<style scoped>
/* :deep(.filepond--panel-root) {
	background-color: #fafaf9;
	border: 2px dashed #e7e5e4;
	border-radius: 0.875rem;
	transition: border-color 0.2s;
}
:deep(.filepond--root:hover .filepond--panel-root) {
	border-color: #26c6da;
	background-color: #f0fbfc;
}
:deep(.filepond--item-panel) {
	background-color: #fff;
	border: 1px solid #e7e5e4;
	border-radius: 0.75rem;
}
:deep(.filepond--file-action-button) {
	background-color: #1f6f78;
}
:deep(.filepond--file-action-button:hover) {
	background-color: #164f54;
}
:deep(.filepond--progress-indicator) {
	color: #26c6da;
}

:deep(.nc-select .p-button) {
	background: #f4f8fa;
	border: 1px solid #dde6e9;
	color: #455a64;
	border-radius: 0.75rem;
}
:deep(.nc-select .p-button.p-highlight) {
	background: #1f6f78;
	color: white;
} */
</style>
