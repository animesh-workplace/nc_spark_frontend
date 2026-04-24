<template>
	<!--
    pages/upload.vue — NC-SPARK variant upload portal
    ─────────────────────────────────────────────────
    Stages:
      idle       → FilePond dropzone + genome/format selectors + Submit
      validating → spinner (client-side parse)
      uploading  → XHR progress bar
      polling    → animated status with annotated / total counter
      complete   → redirect to /analysis/:session_id
      error      → inline error card + retry button
  -->
	<div class="min-h-screen bg-amber-50 pt-16 pb-16">
		<div class="max-w-7xl mx-auto px-5 md:px-8 pt-12">
			<!-- ── Page header ──────────────────────────────────────────────────── -->
			<div class="text-center mb-10">
				<span
					class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold tracking-widest uppercase mb-5"
				>
					Variant Upload
				</span>
				<h1
					class="font-display font-black text-stone-950 mb-3 leading-tight"
					style="font-size: clamp(1.75rem, 4vw, 2.5rem);"
				>
					Upload your variant file
				</h1>
				<p class="text-stone-500 max-w-md mx-auto text-sm leading-relaxed">
					Submit a <span class="font-mono text-stone-700">VCF</span> or
					<span class="font-mono text-stone-700">TSV</span> file containing
					<code class="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-xs text-stone-700"
						>chr · pos · ref · alt</code
					>
					columns. NC-SPARK will annotate each variant across 25+ integrated scoring tools.
				</p>
			</div>

			<!-- ── Main card ─────────────────────────────────────────────────────── -->
			<div class="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
				<!-- ── IDLE / FORM state ─────────────────────────────────────────── -->
				<template v-if="stage === 'idle' || stage === 'error'">
					<div class="p-7 md:p-10">
						<!-- FilePond dropzone -->
						<div class="mb-7">
							<label class="block text-sm font-semibold text-stone-700 mb-2.5">
								Variant file
								<span class="text-red-500 ml-0.5">*</span>
							</label>
							<!-- FilePond mount target -->
							<div ref="pondEl" class="filepond-wrap" />

							<p class="mt-2 text-xs text-stone-400">
								Accepts <code class="font-mono">.vcf</code>, <code class="font-mono">.tsv</code>,
								<code class="font-mono">.csv</code>, <code class="font-mono">.txt</code> · Max
								6,000,000 rows
							</p>
						</div>

						<!-- Options row: genome + format -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
							<!-- Genome selector -->
							<div>
								<label for="genome-select" class="block text-sm font-semibold text-stone-700 mb-2">
									Reference genome <span class="text-red-500">*</span>
								</label>
								<div class="relative">
									<select
										id="genome-select"
										v-model="genome"
										class="w-full appearance-none bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all pr-10"
									>
										<option value="hg38">hg38 / GRCh38</option>
										<option value="hg19">hg19 / GRCh37</option>
									</select>
									<!-- Caret -->
									<div
										class="pointer-events-none absolute inset-y-0 right-3 flex items-center"
										aria-hidden="true"
									>
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
											class="text-stone-400"
										>
											<path d="M6 9l6 6 6-6" />
										</svg>
									</div>
								</div>
							</div>

							<!-- File format selector -->
							<div>
								<label class="block text-sm font-semibold text-stone-700 mb-2">
									File format <span class="text-red-500">*</span>
								</label>
								<div class="flex gap-3 h-[46px]">
									<button
										v-for="fmt in (['vcf', 'tsv'] as const)"
										:key="fmt"
										type="button"
										@click="fileFormat = fmt"
										class="flex-1 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-pink-400"
										:class="
											fileFormat === fmt
												? 'bg-pink-600 text-white border-pink-600 shadow-sm'
												: 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-800'
										"
										:aria-pressed="fileFormat === fmt"
									>
										{{ fmt }}
									</button>
								</div>
							</div>
						</div>

						<!-- Error banner (shown when stage === 'error') -->
						<Transition
							enter-active-class="transition-all duration-200 ease-out"
							enter-from-class="opacity-0 -translate-y-1"
							enter-to-class="opacity-100 translate-y-0"
						>
							<div
								v-if="stage === 'error' && errorMessage"
								role="alert"
								class="mb-7 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3.5 text-sm"
							>
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									class="shrink-0 mt-0.5 text-red-500"
								>
									<circle cx="12" cy="12" r="10" />
									<path d="M12 8v4m0 4h.01" />
								</svg>
								<div>
									<p class="font-semibold mb-0.5">File rejected</p>
									<p class="text-red-700">{{ errorMessage }}</p>
								</div>
							</div>
						</Transition>

						<!-- Submit button -->
						<button
							type="button"
							:disabled="!selectedFile"
							@click="handleSubmit"
							class="w-full py-3.5 rounded-xl text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
							:class="
								selectedFile
									? 'bg-pink-600 text-white hover:bg-pink-700 shadow-md shadow-pink-100'
									: 'bg-stone-100 text-stone-400 cursor-not-allowed'
							"
						>
							Annotate variants
						</button>
					</div>

					<!-- Format guide footer -->
					<div class="border-t border-stone-100 px-7 md:px-10 py-5 bg-stone-50">
						<p class="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
							Expected column layout
						</p>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
							<div>
								<p class="text-stone-400 font-semibold mb-1.5">VCF (tab-delimited)</p>
								<pre
									class="bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-stone-700 overflow-x-auto leading-5"
								>
#CHROM&nbsp;&nbsp;POS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID&nbsp;REF&nbsp;ALT
chr1&nbsp;&nbsp;&nbsp;&nbsp;925952&nbsp;&nbsp;.&nbsp;&nbsp;G&nbsp;&nbsp;&nbsp;A
chr1&nbsp;&nbsp;&nbsp;&nbsp;931279&nbsp;&nbsp;.&nbsp;&nbsp;C&nbsp;&nbsp;&nbsp;T</pre
								>
							</div>
							<div>
								<p class="text-stone-400 font-semibold mb-1.5">TSV (tab or comma)</p>
								<pre
									class="bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-stone-700 overflow-x-auto leading-5"
								>
chr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pos&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ref&nbsp;alt
chr1&nbsp;&nbsp;&nbsp;&nbsp;925952&nbsp;&nbsp;G&nbsp;&nbsp;&nbsp;A
chr1&nbsp;&nbsp;&nbsp;&nbsp;931279&nbsp;&nbsp;C&nbsp;&nbsp;&nbsp;T</pre
								>
							</div>
						</div>
					</div>
				</template>

				<!-- ── VALIDATING state ────────────────────────────────────────────── -->
				<template v-else-if="stage === 'validating'">
					<div class="p-10 text-center">
						<SpinnerRing class="mx-auto mb-5 text-pink-500" :size="48" />
						<h2 class="font-display font-bold text-stone-950 text-xl mb-2">Validating file…</h2>
						<p class="text-sm text-stone-500">
							Checking columns and row count. This only takes a moment.
						</p>
					</div>
				</template>

				<!-- ── UPLOADING state ─────────────────────────────────────────────── -->
				<template v-else-if="stage === 'uploading'">
					<div class="p-10 text-center">
						<SpinnerRing class="mx-auto mb-5 text-pink-500" :size="48" />
						<h2 class="font-display font-bold text-stone-950 text-xl mb-2">Uploading…</h2>
						<p class="text-sm text-stone-500 mb-6">
							{{ selectedFile?.name }} · {{ formatBytes(selectedFile?.size ?? 0) }}
						</p>
						<!-- Progress bar -->
						<div class="max-w-xs mx-auto">
							<div class="flex justify-between text-xs text-stone-400 mb-1.5">
								<span>Progress</span>
								<span>{{ uploadProgress }}%</span>
							</div>
							<div class="h-2 rounded-full bg-stone-100 overflow-hidden">
								<div
									class="h-full rounded-full bg-pink-500 transition-all duration-300"
									:style="{ width: `${uploadProgress}%` }"
									role="progressbar"
									:aria-valuenow="uploadProgress"
									aria-valuemin="0"
									aria-valuemax="100"
								/>
							</div>
						</div>
					</div>
				</template>

				<!-- ── POLLING state ───────────────────────────────────────────────── -->
				<template v-else-if="stage === 'polling'">
					<div class="p-10 text-center">
						<!-- Animated DNA helix spinner -->
						<div class="relative w-14 h-14 mx-auto mb-5">
							<svg
								width="56"
								height="56"
								viewBox="0 0 56 56"
								class="animate-spin"
								style="animation-duration:1.4s"
								aria-hidden="true"
							>
								<circle cx="28" cy="28" r="24" stroke="#f3e8ff" stroke-width="4" fill="none" />
								<path
									d="M28 4 A24 24 0 0 1 52 28"
									stroke="#db2777"
									stroke-width="4"
									stroke-linecap="round"
									fill="none"
								/>
							</svg>
						</div>
						<h2 class="font-display font-bold text-stone-950 text-xl mb-2">Annotating variants…</h2>
						<p class="text-sm text-stone-500 mb-6">{{ pollStatus }}</p>

						<!-- Annotated / total counter -->
						<div
							v-if="variantCount > 0"
							class="inline-flex items-center gap-4 bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 mb-6"
						>
							<div class="text-center">
								<p class="font-display font-black text-2xl text-pink-600">
									{{ annotatedCount.toLocaleString() }}
								</p>
								<p class="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
									Annotated
								</p>
							</div>
							<div class="h-8 w-px bg-stone-200" />
							<div class="text-center">
								<p class="font-display font-black text-2xl text-stone-700">
									{{ variantCount.toLocaleString() }}
								</p>
								<p class="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
									Total
								</p>
							</div>
						</div>

						<!-- Subtle progress bar based on annotated / total -->
						<div v-if="variantCount > 0" class="max-w-xs mx-auto">
							<div class="h-1.5 rounded-full bg-stone-100 overflow-hidden">
								<div
									class="h-full rounded-full bg-pink-500 transition-all duration-700"
									:style="{
										width: `${Math.min(
											100,
											Math.round((annotatedCount / variantCount) * 100),
										)}%`,
									}"
								/>
							</div>
						</div>

						<p class="mt-5 text-xs text-stone-400">
							Session ID:
							<code class="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">{{
								sessionId
							}}</code>
						</p>
					</div>
				</template>

				<!-- ── COMPLETE state (brief flash before redirect) ────────────────── -->
				<template v-else-if="stage === 'complete'">
					<div class="p-10 text-center">
						<div
							class="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"
						>
							<svg
								width="28"
								height="28"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#16a34a"
								stroke-width="2.5"
							>
								<path d="m5 12 5 5L20 7" />
							</svg>
						</div>
						<h2 class="font-display font-bold text-stone-950 text-xl mb-2">Analysis complete!</h2>
						<p class="text-sm text-stone-500 mb-1">
							{{ annotatedCount.toLocaleString() }} / {{ variantCount.toLocaleString() }} variants
							annotated.
						</p>
						<p class="text-sm text-stone-400">Redirecting to results…</p>
					</div>
				</template>
			</div>
			<!-- end main card -->
		</div>
	</div>
</template>

<script setup lang="ts">
// ─────────────────────────────────────────────────────────────────────────────
// FilePond is a browser-only library: we use ClientOnly + dynamic import pattern
// ─────────────────────────────────────────────────────────────────────────────
import { ref, watch, onMounted, onUnmounted } from 'vue'

useSeoMeta({
	title: 'Upload Variants — NC-SPARK',
	description: 'Upload a VCF or TSV file to annotate non-coding variants across 25+ integrated scoring tools.',
})

// ── Upload composable ────────────────────────────────────────────────────────
const {
	stage,
	errorMessage,
	sessionId,
	variantCount,
	annotatedCount,
	pollStatus,
	uploadProgress,
	submit,
	reset,
} = useUpload()

// ── Form state ───────────────────────────────────────────────────────────────
const genome = ref<'hg38' | 'hg19'>('hg38')
const fileFormat = ref<'vcf' | 'tsv'>('tsv')
const selectedFile = ref<File | null>(null)

// ── FilePond setup ───────────────────────────────────────────────────────────
const pondEl = ref<HTMLDivElement | null>(null)
let pondInstance: any = null

onMounted(async () => {
	// Dynamic import so FilePond only runs client-side
	const { create } = await import('filepond')
	const FilePondPluginType = await import('filepond-plugin-file-validate-type')
	const { registerPlugin } = await import('filepond')

	registerPlugin(FilePondPluginType.default)

	if (!pondEl.value) return

	pondInstance = create(pondEl.value, {
		allowMultiple: false,
		acceptedFileTypes: ['text/plain', 'text/tab-separated-values', 'text/csv', 'application/octet-stream', ''],
		labelIdle:
			'<span class="font-semibold text-stone-700">Drop your file here</span> <span class="text-stone-400">or</span> <span class="text-pink-600 font-semibold cursor-pointer">browse</span>',
		labelFileProcessing: 'Uploading…',
		labelFileProcessingComplete: 'Upload complete',
		labelTapToUndo: 'Tap to remove',
		// Disable FilePond's built-in upload — we handle it manually
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

onUnmounted(() => {
	pondInstance?.destroy()
})

// ── Submit handler ────────────────────────────────────────────────────────────
async function handleSubmit() {
	if (!selectedFile.value) return
	await submit(selectedFile.value, genome.value, fileFormat.value)
}

// ── Redirect on complete ──────────────────────────────────────────────────────
const router = useRouter()
watch(stage, newStage => {
	if (newStage === 'complete' && sessionId.value) {
		// Brief pause so the user sees the success state
		setTimeout(() => {
			router.push(`/analysis/${sessionId.value}`)
		}, 1200)
	}
})

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`
	if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
	return `${(bytes / 1024 ** 3).toFixed(1)} GB`
}
</script>

<!--
  FilePond styles — scoped :deep() so they don't leak globally,
  but still override FilePond's internal classes.
  We keep this minimal and re-skin to match the Outseta warm palette.
-->
<style>
/* ── FilePond CSS (loaded globally — required for SSR build) ── */
@import 'filepond/dist/filepond.min.css';
</style>

<style scoped>
/* Re-theme FilePond to match Outseta warm palette */
:deep(.filepond--root) {
	font-family: 'Inter', system-ui, sans-serif;
	font-size: 0.875rem;
}

:deep(.filepond--drop-area) {
	border-radius: 0.875rem;
}

:deep(.filepond--panel-root) {
	background-color: #fafaf9;
	border: 2px dashed #e7e5e4;
	border-radius: 0.875rem;
	transition: border-color 0.2s;
}

:deep(.filepond--root:hover .filepond--panel-root),
:deep(.filepond--root.filepond--draging .filepond--panel-root) {
	border-color: #db2777;
	background-color: #fff1f5;
}

:deep(.filepond--label-action) {
	text-decoration: none;
}

:deep(.filepond--item-panel) {
	background-color: #fff;
	border: 1px solid #e7e5e4;
	border-radius: 0.75rem;
}

:deep(.filepond--file-action-button) {
	background-color: #db2777;
}

:deep(.filepond--file-action-button:hover) {
	background-color: #be185d;
}

/* Progress track color */
:deep(.filepond--progress-indicator) {
	color: #db2777;
}
</style>
