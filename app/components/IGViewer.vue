<template>
	<div class="igv-wrapper">
		<div class="igv-toolbar">
			<input
				v-model="locusInput"
				placeholder="e.g. chr17:7,571,720-7,590,868"
				class="locus-input"
				@keyup.enter="navigateTo"
			/>
			<button @click="navigateTo">Go</button>
			<button @click="zoomIn">＋</button>
			<button @click="zoomOut">－</button>
		</div>
		<div ref="igvContainer" style="width: 100%; min-height: 600px" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const igvContainer = ref<HTMLElement | null>(null)
const locusInput = ref('chr17:7,571,720-7,590,868')
let igvInstance: any = null
let browser: any = null

const igvOptions = {
	genome: 'hg38',
	locus: 'chr17:7,571,720-7,590,868',
	showAllChromosomes: true,
	tracks: [
		// ── Gene Transcripts ── equivalent to HiGlass horizontal-transcripts
		{
			name: 'Gene Transcripts (hg38)',
			type: 'annotation',
			format: 'refgene',
			url: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/ncbiRefSeq.txt.gz',
			indexURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/ncbiRefSeq.txt.gz.tbi',
			displayMode: 'EXPANDED',
			height: 120,
			color: '#bdbfff',
			altColor: '#fabec2',
			visibilityWindow: 5000000,
			removable: false,
			order: 1,
		},

		// ── ClinVar Variants ── equivalent to HiGlass horizontal-clinvar
		{
			name: 'ClinVar Variants',
			type: 'variant',
			format: 'vcf',
			url: 'https://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh38/clinvar.vcf.gz',
			indexURL: 'https://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh38/clinvar.vcf.gz.tbi',
			displayMode: 'EXPANDED',
			height: 100,
			visibilityWindow: 300000,
			colorBy: 'CLNSIG',
			colorTable: {
				Pathogenic: '#D55E00',
				'Pathogenic/Likely_pathogenic': '#CC79A7',
				Likely_pathogenic: '#E69F00',
				Uncertain_significance: '#808080',
				Likely_benign: '#56B4E9',
				'Benign/Likely_benign': '#0072B2',
				Benign: '#009E73',
				risk_factor: '#999999',
				'*': '#DCDCDC',
			},
			order: 2,
		},

		// ── PhyloP Conservation ── BigWig signal equivalent
		{
			name: 'PhyloP 100-way Conservation',
			type: 'wig',
			format: 'bigwig',
			url: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/phyloP100way/hg38.phyloP100way.bw',
			height: 60,
			color: '#3182bd',
			autoscale: true,
			order: 3,
		},

		// ── gnomAD Variants ── population frequency track
		// {
		// 	name: 'gnomAD v3 Variants',
		// 	type: 'variant',
		// 	format: 'vcf',
		// 	url:
		// 		'https://storage.googleapis.com/gcp-public-data--gnomad/release/3.1.2/vcf/genomes/gnomad.genomes.v3.1.2.sites.chr17.vcf.bgz',
		// 	indexURL:
		// 		'https://storage.googleapis.com/gcp-public-data--gnomad/release/3.1.2/vcf/genomes/gnomad.genomes.v3.1.2.sites.chr17.vcf.bgz.tbi',
		// 	displayMode: 'EXPANDED',
		// 	height: 80,
		// 	visibilityWindow: 100000,
		// 	order: 4,
		// },

		// ── RepeatMasker ── equivalent to UCSC repeats / HiGlass annotation
		{
			name: 'RepeatMasker',
			type: 'annotation',
			format: 'bed',
			url: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/rmsk.txt.gz',
			indexURL: 'https://hgdownload.soe.ucsc.edu/goldenPath/hg38/database/rmsk.txt.gz.tbi',
			displayMode: 'SQUISHED',
			height: 40,
			color: '#a0a0a0',
			visibilityWindow: 2000000,
			order: 5,
		},

		// ── ENCODE cCREs ── regulatory elements, noncoding-relevant for your portal
		{
			name: 'ENCODE cCREs',
			type: 'annotation',
			format: 'bigbed',
			url: 'https://hgdownload.soe.ucsc.edu/gbdb/hg38/encode3/ccre/encodeCcreCombined.bb',
			displayMode: 'SQUISHED',
			height: 40,
			visibilityWindow: 5000000,
			order: 6,
		},
	],
}

onMounted(async () => {
	if (!igvContainer.value) return

	const igvModule = await import('igv')
	igvInstance =
		igvModule.default && typeof igvModule.default.createBrowser === 'function' ? igvModule.default : igvModule

	browser = await igvInstance.createBrowser(igvContainer.value, igvOptions)
	const shadowRoot = igvContainer.value?.shadowRoot
	console.log('🚀 ~ :136 ~ shadowRoot:', shadowRoot)

	if (shadowRoot) {
		// Hide logo element
		const logo = shadowRoot.querySelector('.igv-logo')
		if (logo) (logo as HTMLElement).style.display = 'none'

		// Inject custom CSS into the shadow root via adoptedStyleSheets
		const sheet = new CSSStyleSheet()
		sheet.replaceSync(`
    .igv-logo,
    .igv-logo-container,
    [class*="igv-logo"] {
      display: none !important;
    }
  `)
		shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet]
	}
})

async function navigateTo() {
	if (browser && locusInput.value) {
		await browser.search(locusInput.value)
	}
}

function zoomIn() {
	browser?.zoomIn()
}
function zoomOut() {
	browser?.zoomOut()
}

// Expose so parent pages can call navigateTo('chr1:1000-2000') on variant click
defineExpose({
	navigateTo,
	zoomIn,
	zoomOut,
	getBrowser: () => browser,
})

onBeforeUnmount(() => {
	if (browser && igvInstance) {
		igvInstance.removeBrowser(browser)
		browser = null
	}
})
</script>

<style scoped>
.igv-wrapper {
	width: 100%;
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	overflow: hidden;
	background: white;
}

.igv-toolbar {
	display: flex;
	gap: 8px;
	padding: 8px 12px;
	background: #f8fafc;
	border-bottom: 1px solid #e2e8f0;
	align-items: center;
}

.locus-input {
	flex: 1;
	padding: 4px 10px;
	border: 1px solid #cbd5e1;
	border-radius: 4px;
	font-size: 13px;
	font-family: monospace;
	outline: none;
	transition: border-color 0.2s;
}

.locus-input:focus {
	border-color: #0069b4;
}

.igv-toolbar button {
	padding: 4px 14px;
	background: #0069b4;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
	transition: background 0.2s;
}

.igv-toolbar button:hover {
	background: #004f8a;
}
</style>
