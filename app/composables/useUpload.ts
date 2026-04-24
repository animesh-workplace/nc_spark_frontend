// composables/useUpload.ts
// ──────────────────────────────────────────────────────────────────────────────
// Encapsulates:
//   1. Client-side file validation (required columns, row-count guard)
//   2. FormData upload to POST /api/v1/upload
//   3. Status polling via GET /status/{session_id}
//   4. Reactive state surface consumed by pages/upload.vue
// ──────────────────────────────────────────────────────────────────────────────

const BASE_URL = 'http://10.10.6.80/nvpp/api/v1'

const REQUIRED_COLUMNS = ['chr', 'pos', 'ref', 'alt'] as const
const MAX_ROWS = 6_000_000
const POLL_INTERVAL_MS = 3_000

// ── Types ────────────────────────────────────────────────────────────────────

export type UploadStage =
	| 'idle' // waiting for user action
	| 'validating' // parsing file client-side
	| 'uploading' // POST in flight
	| 'polling' // GET /status loop
	| 'complete' // done — session_id ready for redirect
	| 'error' // terminal error

export interface StatusResponse {
	session_id: string
	status: 'pending' | 'processing' | 'complete' | 'error'
	genome: string
	variant_count: number
	annotated_count: number
	error_message: string | null
}

// ── Composable ───────────────────────────────────────────────────────────────

export function useUpload() {
	const stage = ref<UploadStage>('idle')
	const errorMessage = ref<string | null>(null)
	const sessionId = ref<string | null>(null)
	const variantCount = ref<number>(0)
	const annotatedCount = ref<number>(0)
	const pollStatus = ref<string>('') // human-readable status label
	const uploadProgress = ref<number>(0) // 0–100

	let pollTimer: ReturnType<typeof setTimeout> | null = null

	// ── Helpers ─────────────────────────────────────────────────────────────────

	function setError(msg: string) {
		stage.value = 'error'
		errorMessage.value = msg
		stopPolling()
	}

	function stopPolling() {
		if (pollTimer !== null) {
			clearTimeout(pollTimer)
			pollTimer = null
		}
	}

	function reset() {
		stopPolling()
		stage.value = 'idle'
		errorMessage.value = null
		sessionId.value = null
		variantCount.value = 0
		annotatedCount.value = 0
		pollStatus.value = ''
		uploadProgress.value = 0
	}

	// ── Step 1: Client-side validation ──────────────────────────────────────────
	// Reads the raw text of the file, detects delimiter, checks headers and row count.
	// Returns { valid: true } or { valid: false, message: string }.

	async function validateFile(
		file: File,
		fileFormat: 'vcf' | 'tsv',
	): Promise<{ valid: true } | { valid: false; message: string }> {
		const MAX_PREVIEW_BYTES = 10 * 1024 * 1024 // read up to 10 MB for header check
		const blob = file.slice(0, MAX_PREVIEW_BYTES)
		const text = await blob.text()
		const lines = text.split('\n')

		// ── Determine header line ──────────────────────────────────────────────────
		// For VCF: skip comment lines starting with #
		// For TSV/CSV: first non-empty line is the header
		let headerLine = ''
		let dataLineCount = 0

		if (fileFormat === 'vcf') {
			// VCF: look for #CHROM header line — but we also accept plain headers
			for (const line of lines) {
				const trimmed = line.trim()
				if (!trimmed) continue
				if (trimmed.startsWith('#CHROM')) {
					// Standard VCF columns: #CHROM POS ID REF ALT ...
					headerLine = trimmed.replace(/^#/, '').toLowerCase()
					continue
				}
				if (trimmed.startsWith('#')) continue // skip meta lines
				dataLineCount++
			}
			// If we didn't find a #CHROM line, treat first non-comment line as header
			if (!headerLine) {
				for (const line of lines) {
					const trimmed = line.trim()
					if (!trimmed || trimmed.startsWith('#')) continue
					headerLine = trimmed.toLowerCase()
					break
				}
				// recount data lines after header
				dataLineCount = 0
				let seenHeader = false
				for (const line of lines) {
					const trimmed = line.trim()
					if (!trimmed || trimmed.startsWith('#')) continue
					if (!seenHeader) {
						seenHeader = true
						continue
					}
					dataLineCount++
				}
			}
		} else {
			// TSV: first non-empty line is header
			let seenHeader = false
			for (const line of lines) {
				const trimmed = line.trim()
				if (!trimmed) continue
				if (!seenHeader) {
					headerLine = trimmed.toLowerCase()
					seenHeader = true
					continue
				}
				dataLineCount++
			}
		}

		// ── Detect delimiter and split columns ────────────────────────────────────
		const delimiter = headerLine.includes('\t') ? '\t' : ','
		const columns = headerLine.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''))

		// ── Normalise VCF standard column names ───────────────────────────────────
		// #CHROM → chr, POS → pos, REF → ref, ALT → alt
		const normalised = columns.map(c => {
			if (c === 'chrom') return 'chr'
			return c
		})

		// ── Check required columns ────────────────────────────────────────────────
		const missing = REQUIRED_COLUMNS.filter(req => !normalised.includes(req))
		if (missing.length > 0) {
			return {
				valid: false,
				message:
					`Required column${missing.length > 1 ? 's' : ''} missing: ${missing.join(', ')}. ` +
					`File must contain: ${REQUIRED_COLUMNS.join(', ')}.`,
			}
		}

		// ── Row count guard (use byte-size estimate if file is > 10 MB) ───────────
		// For large files we only read 10 MB — estimate total rows by extrapolation
		let estimatedRows = dataLineCount
		if (file.size > MAX_PREVIEW_BYTES) {
			const avgBytesPerLine = MAX_PREVIEW_BYTES / Math.max(dataLineCount, 1)
			estimatedRows = Math.ceil(file.size / avgBytesPerLine)
		}

		if (estimatedRows > MAX_ROWS) {
			return {
				valid: false,
				message: `File too large: estimated ${estimatedRows.toLocaleString()} rows exceeds the 6,000,000 row limit.`,
			}
		}

		return { valid: true }
	}

	// ── Step 2: Upload ───────────────────────────────────────────────────────────

	async function uploadFile(file: File, genome: string, fileFormat: 'vcf' | 'tsv') {
		const form = new FormData()
		form.append('file', file)
		form.append('genome', genome)
		form.append('file_format', fileFormat)

		const xhr = new XMLHttpRequest()
		xhr.open('POST', `${BASE_URL}/upload`)

		// Track upload progress
		xhr.upload.addEventListener('progress', e => {
			if (e.lengthComputable) {
				uploadProgress.value = Math.round((e.loaded / e.total) * 100)
			}
		})

		return new Promise<{ session_id: string; variant_count: number }>((resolve, reject) => {
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						resolve(JSON.parse(xhr.responseText))
					} catch {
						reject(new Error('Invalid response from server'))
					}
				} else {
					let msg = `Upload failed (HTTP ${xhr.status})`
					try {
						const body = JSON.parse(xhr.responseText)
						if (body.detail || body.message) msg = body.detail ?? body.message
					} catch {
						/* ignore */
					}
					reject(new Error(msg))
				}
			}
			xhr.onerror = () => reject(new Error('Network error — check your connection'))
			xhr.ontimeout = () => reject(new Error('Upload timed out'))
			xhr.send(form)
		})
	}

	// ── Step 3: Poll status ──────────────────────────────────────────────────────

	async function pollOnce(sid: string) {
		const res = await fetch(`${BASE_URL}/status/${sid}`)
		if (!res.ok) throw new Error(`Status check failed (HTTP ${res.status})`)
		return res.json() as Promise<StatusResponse>
	}

	function schedulePoll(sid: string) {
		pollTimer = setTimeout(async () => {
			try {
				const data = await pollOnce(sid)
				variantCount.value = data.variant_count ?? variantCount.value
				annotatedCount.value = data.annotated_count ?? annotatedCount.value

				if (data.status === 'complete') {
					stage.value = 'complete'
					pollStatus.value = 'Analysis complete'
					stopPolling()
					// Redirect handled by the page watcher
				} else if (data.status === 'error') {
					setError(data.error_message ?? 'Analysis failed with an unknown error')
				} else {
					// Still running — update label and reschedule
					pollStatus.value =
						data.status === 'processing'
							? `Processing… ${annotatedCount.value} / ${variantCount.value} variants annotated`
							: 'Queued — waiting for worker…'
					schedulePoll(sid)
				}
			} catch (err) {
				const msg = err instanceof Error ? err.message : 'Polling error'
				setError(msg)
			}
		}, POLL_INTERVAL_MS)
	}

	// ── Main entry point ─────────────────────────────────────────────────────────
	// Called by the page after FilePond provides a File object.

	async function submit(file: File, genome: string, fileFormat: 'vcf' | 'tsv') {
		reset()

		// 1. Validate
		stage.value = 'validating'
		const validation = await validateFile(file, fileFormat)
		if (!validation.valid) {
			setError(validation.message)
			return
		}

		// 2. Upload
		stage.value = 'uploading'
		try {
			const result = await uploadFile(file, genome, fileFormat)
			sessionId.value = result.session_id
			variantCount.value = result.variant_count
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed')
			return
		}

		// 3. Poll
		stage.value = 'polling'
		pollStatus.value = 'Analysis queued…'
		schedulePoll(sessionId.value!)
	}

	// Cleanup on unmount
	onUnmounted(() => stopPolling())

	return {
		// State
		stage,
		errorMessage,
		sessionId,
		variantCount,
		annotatedCount,
		pollStatus,
		uploadProgress,
		// Actions
		submit,
		reset,
	}
}
