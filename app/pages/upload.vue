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
			<div
				class="bg-white/85 backdrop-blur-md rounded-3xl border border-[#E0E6E8] shadow-lg max-w-2xl mx-auto"
			>
				<!-- FORM (idle / error) -->
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
								<label class="block text-sm font-semibold text-[#455A64] mb-2"
									>Reference genome</label
								>
								<SelectButton
									:allow-empty="false"
									v-model="genome"
									:options="genomeOptions"
									optionLabel="label"
									optionValue="value"
									class="w-full nc-select"
								/>
							</div>
							<div>
								<label class="block text-sm font-semibold text-[#455A64] mb-2">File format</label>
								<SelectButton
									:allow-empty="false"
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
					<div class="p-8 md:p-10">
						<!-- Progress header -->
						<div class="text-center mb-6">
							<div
								class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#E0F7FA] mb-4"
							>
								<svg class="animate-spin w-7 h-7 text-[#26C6DA]" fill="none" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="3"
									/>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
								</svg>
							</div>
							<p class="text-[#607D8B] text-sm font-medium mb-3">Annotating variants…</p>

							<!-- Count -->
							<p class="text-[#1F6F78] font-bold text-3xl tabular-nums">
								{{ annotatedCount.toLocaleString() }}
								<span class="text-[#90A4AE] font-normal text-lg"
									>/ {{ variantCount.toLocaleString() }}</span
								>
							</p>

							<!-- Elapsed time -->
							<p class="text-xs text-[#90A4AE] mt-1 tabular-nums">Elapsed: {{ elapsedDisplay }}</p>

							<!-- Progress bar -->
							<div class="mt-4 h-1.5 bg-[#ECEFF1] rounded-full overflow-hidden max-w-xs mx-auto">
								<div
									class="h-full bg-[#26C6DA] rounded-full transition-all duration-500"
									:style="{
										width:
											variantCount > 0 ? (annotatedCount / variantCount) * 100 + '%' : '0%',
									}"
								/>
							</div>
						</div>

						<!-- Divider -->
						<div class="border-t border-[#E0E6E8] my-6" />

						<!-- Large file email prompt -->
						<div v-if="isLargeFile">
							<div
								class="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4"
							>
								<svg
									class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p class="text-xs text-amber-800 leading-relaxed">
									This job contains
									<strong>{{ variantCount.toLocaleString() }} variants</strong> and may take a
									while. Leave your email and we'll notify you when it's done — you can close
									this tab.
								</p>
							</div>

							<label class="block text-sm font-semibold text-[#455A64] mb-2">
								Notify me when complete
							</label>
							<div class="flex gap-2">
								<input
									v-model="userEmail"
									type="email"
									placeholder="you@example.com"
									:disabled="emailSubmitted"
									class="flex-1 px-4 py-2.5 rounded-xl border text-sm text-[#263238]
                                           focus:outline-none focus:ring-2 focus:ring-[#26C6DA] focus:border-transparent
                                           placeholder:text-[#B0BEC5] disabled:bg-[#F4F8FA] disabled:text-[#90A4AE]
                                           transition-all"
									:class="
										emailSubmitted
											? 'border-emerald-300 bg-emerald-50'
											: 'border-[#CFD8DC] bg-white'
									"
								/>
								<button
									v-if="!emailSubmitted"
									@click="submitEmail"
									:disabled="!userEmail.includes('@')"
									class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0"
									:class="
										userEmail.includes('@')
											? 'bg-[#26C6DA] text-white hover:bg-[#1F6F78]'
											: 'bg-[#ECEFF1] text-[#90A4AE] cursor-not-allowed'
									"
								>
									Notify me
								</button>
								<div
									v-else
									class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-600
                                           border border-emerald-200 flex items-center gap-1.5 flex-shrink-0"
								>
									<svg
										class="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2.5"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									Saved
								</div>
							</div>
						</div>

						<!-- Small file — simple reassurance -->
						<div v-else class="text-center text-xs text-[#90A4AE]">
							You can leave this page — your session will be preserved.
						</div>
					</div>
				</template>

				<!-- COMPLETE -->
				<template v-else-if="stage === 'complete'">
					<div class="p-8 md:p-10">
						<!-- Success header -->
						<div class="text-center mb-8">
							<div
								class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 mb-4"
							>
								<svg
									class="w-7 h-7 text-emerald-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h2 class="text-xl font-bold text-[#263238] mb-1">Analysis complete</h2>

							<!-- Variants + time stats -->
							<div
								class="inline-flex items-center gap-4 mt-3 px-5 py-2.5 rounded-2xl bg-[#F4F8FA] border border-[#E0E6E8]"
							>
								<div class="text-center">
									<p
										class="text-[10px] font-semibold uppercase tracking-wider text-[#90A4AE] mb-0.5"
									>
										Variants
									</p>
									<p class="text-base font-bold text-[#1F6F78] tabular-nums">
										{{ variantCount.toLocaleString() }}
									</p>
								</div>
								<div class="w-px h-8 bg-[#E0E6E8]" />
								<div class="text-center">
									<p
										class="text-[10px] font-semibold uppercase tracking-wider text-[#90A4AE] mb-0.5"
									>
										Time taken
									</p>
									<p class="text-base font-bold text-[#1F6F78] tabular-nums">
										{{ finalDuration }}
									</p>
								</div>
							</div>
						</div>

						<!-- Session ID -->
						<div class="rounded-2xl border border-[#E0E6E8] overflow-hidden mb-4">
							<div
								class="bg-[#F4F8FA] px-4 py-2.5 border-b border-[#E0E6E8] flex items-center gap-2"
							>
								<svg
									class="w-3.5 h-3.5 text-[#607D8B]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
									/>
								</svg>
								<span class="text-xs font-semibold text-[#607D8B] uppercase tracking-wider"
									>Session ID</span
								>
							</div>
							<div class="px-4 py-3 flex items-center justify-between gap-3 bg-white">
								<code class="text-sm font-mono text-[#1F6F78] break-all select-all">{{
									sessionId
								}}</code>
								<button
									@click="copySessionId"
									class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                           bg-[#E0F7FA] text-[#1F6F78] hover:bg-[#26C6DA] hover:text-white transition-all"
								>
									<svg
										v-if="!copied"
										class="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
									<svg
										v-else
										class="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									{{ copied ? 'Copied!' : 'Copy' }}
								</button>
							</div>
						</div>

						<!-- Analysis URL -->
						<div class="rounded-2xl border border-[#E0E6E8] overflow-hidden mb-4">
							<div
								class="bg-[#F4F8FA] px-4 py-2.5 border-b border-[#E0E6E8] flex items-center gap-2"
							>
								<svg
									class="w-3.5 h-3.5 text-[#607D8B]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
									/>
								</svg>
								<span class="text-xs font-semibold text-[#607D8B] uppercase tracking-wider"
									>Analysis URL</span
								>
							</div>
							<div class="px-4 py-3 flex items-center justify-between gap-3 bg-white">
								<code class="text-xs font-mono text-[#455A64] break-all select-all">{{
									analysisUrl
								}}</code>
								<button
									@click="copyUrl"
									class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                                           bg-[#E0F7FA] text-[#1F6F78] hover:bg-[#26C6DA] hover:text-white transition-all"
								>
									<svg
										v-if="!copiedUrl"
										class="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
									<svg
										v-else
										class="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									{{ copiedUrl ? 'Copied!' : 'Copy' }}
								</button>
							</div>
						</div>

						<!-- 7-day expiry warning -->
						<div
							class="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6"
						>
							<svg
								class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p class="text-xs text-amber-800 leading-relaxed">
								<strong>Save this URL.</strong> Your session and all associated data will be
								permanently removed after <strong>7 days</strong> (expires
								<strong>{{ expiryDate }}</strong
								>).
							</p>
						</div>

						<!-- Email confirmation (large file only) -->
						<div
							v-if="isLargeFile && emailSubmitted"
							class="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 mb-6"
						>
							<svg
								class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<p class="text-xs text-blue-800">
								A confirmation has been sent to <strong>{{ userEmail }}</strong
								>.
							</p>
						</div>

						<button
							@click="goToAnalysis"
							class="w-full py-3.5 rounded-xl font-semibold bg-[#26C6DA] text-white hover:bg-[#1F6F78] transition-all"
						>
							Go to Analysis →
						</button>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import SelectButton from 'primevue/selectbutton'

useSeoMeta({
	title: 'Upload Variants — NC-SPARK',
	description: 'Upload a VCF or TSV file to annotate non-coding variants across 25+ integrated scoring tools.',
})

const { stage, errorMessage, sessionId, variantCount, annotatedCount, uploadProgress, submit, reset } = useUpload()

const genome = ref<'hg38' | 'hg19'>('hg38')
const fileFormat = ref<'vcf' | 'tsv'>('tsv')
const selectedFile = ref<File | null>(null)
const userEmail = ref('')
const emailSubmitted = ref(false)
const copied = ref(false)
const copiedUrl = ref(false)

const genomeOptions = [
	{ label: 'hg38', value: 'hg38' },
	{ label: 'hg19', value: 'hg19' },
]
const formatOptions = [
	{ label: 'VCF', value: 'vcf' },
	{ label: 'TSV', value: 'tsv' },
]

// ── Large file: based purely on variant count ─────────────────────────────────
const isLargeFile = computed(() => variantCount.value > 50_000)

// ── Timer ─────────────────────────────────────────────────────────────────────
const pollingStartTime = ref<number | null>(null)
const elapsedSeconds = ref(0)
const finalDuration = ref('')
let timerInterval: ReturnType<typeof setInterval> | null = null

function startTimer() {
	pollingStartTime.value = Date.now()
	elapsedSeconds.value = 0
	timerInterval = setInterval(() => {
		if (pollingStartTime.value) {
			elapsedSeconds.value = Math.floor((Date.now() - pollingStartTime.value) / 1000)
		}
	}, 1000)
}

function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval)
		timerInterval = null
	}
	finalDuration.value = formatDuration(elapsedSeconds.value)
}

function formatDuration(seconds: number): string {
	if (seconds < 60) return `${seconds}s`
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return s > 0 ? `${m}m ${s}s` : `${m}m`
}

const elapsedDisplay = computed(() => formatDuration(elapsedSeconds.value))

// ── Watch stage transitions ───────────────────────────────────────────────────
watch(stage, (s, prev) => {
	if (s === 'polling' && prev !== 'polling') {
		startTimer()
	}
	if (s === 'complete') {
		stopTimer()
		// Demo: snap annotatedCount to variantCount
		annotatedCount.value = variantCount.value
		// setTimeout(() => router.push(`/analysis/${sessionId.value}`), 2000)
	}
})

onUnmounted(() => {
	if (timerInterval) clearInterval(timerInterval)
})

// ── Derived ───────────────────────────────────────────────────────────────────
const analysisUrl = computed(() =>
	sessionId.value ? `${window.location.origin}/analysis/${sessionId.value}` : '',
)

const expiryDate = computed(() => {
	const d = new Date()
	d.setDate(d.getDate() + 7)
	return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
})

// ── Handlers ──────────────────────────────────────────────────────────────────
function submitEmail() {
	if (!userEmail.value.includes('@')) return
	emailSubmitted.value = true
	// TODO: pass userEmail to backend via API call here
}

async function copySessionId() {
	if (!sessionId.value) return
	await navigator.clipboard.writeText(sessionId.value)
	copied.value = true
	setTimeout(() => (copied.value = false), 2000)
}

async function copyUrl() {
	if (!analysisUrl.value) return
	await navigator.clipboard.writeText(analysisUrl.value)
	copiedUrl.value = true
	setTimeout(() => (copiedUrl.value = false), 2000)
}

function goToAnalysis() {
	if (sessionId.value) router.push(`/analysis/${sessionId.value}`)
}

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
		credits: false,
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

const router = useRouter()
</script>

<style>
@import 'filepond/dist/filepond.min.css';
</style>

<style scoped>
:deep(.filepond--panel-root) {
	background-color: #fafaf9;
	border: 2px dashed #e7e5e4;
	border-radius: 0.875rem;
	transition: border-color 0.2s;
}
:deep(.filepond--root:hover .filepond--panel-root) {
	border-color: #26c6da;
	background-color: #f0fbfc;
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
}
</style>
