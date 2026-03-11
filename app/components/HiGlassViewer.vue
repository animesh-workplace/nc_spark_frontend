<!-- <template>
	<div ref="hgContainer" style="width: 100%; height: 600px" />
</template>

<script setup lang="ts">
const hgContainer = ref<HTMLElement | null>(null)
let hgApi: any = null

// Public hg19 demo viewconfig from higlass.io
const PUBLIC_SERVER = 'https://higlass.io/api/v1'

const viewConfig = {
	editable: true,
	trackSourceServers: [PUBLIC_SERVER],
	exportViewUrl: `${PUBLIC_SERVER}/viewconfs`,
	views: [
		{
			uid: 'view1',
			initialXDomain: [0, 3095677412],
			initialYDomain: [0, 3095677412],
			genomePositionSearchBox: {
				autocompleteServer: PUBLIC_SERVER,
				autocompleteId: 'OHJakQICQD6gTD7skx4EWA',
				chromInfoServer: PUBLIC_SERVER,
				chromInfoId: 'hg19',
				visible: true,
			},
			tracks: {
				top: [
					{
						// hg19 chromosome labels (public tileset)
						uid: 'chrom-labels',
						type: 'horizontal-chromosome-labels',
						server: PUBLIC_SERVER,
						tilesetUid: 'Ajn_ttUUQbqgtOD4nOt-IA',
						height: 30,
					},
					{
						// hg19 gene annotations (public tileset)
						uid: 'gene-annotations',
						type: 'horizontal-gene-annotations',
						server: PUBLIC_SERVER,
						tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
						height: 80,
						options: {
							label: 'hg19 Gene Annotations',
							plusStrandColor: '#0069B4',
							minusStrandColor: '#CC0000',
							fontSize: 11,
						},
					},
				],
				left: [],
				center: [],
				right: [],
				bottom: [],
			},
			layout: { x: 0, y: 0, w: 12, h: 6 },
		},
	],
}

onMounted(async () => {
	if (!hgContainer.value) return
	const hglib = await import('higlass')
	hgApi = hglib.viewer(hgContainer.value, viewConfig, { bounded: true })
})

onBeforeUnmount(() => {
	hgApi = null
})
</script> -->

<template>
	<div ref="hgContainer" style="width: 100%; height: 800px" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const hgContainer = ref<HTMLElement | null>(null)
let hgApi: any = null

const viewConfig = {
	editable: true,
	zoomFixed: false,
	trackSourceServers: ['https://cgap-higlass.com/api/v1'],
	exportViewUrl: '/api/v1/viewconfs',
	views: [
		{
			uid: 'aa',
			initialXDomain: [2498444175.999239, 2498472899.000761],
			initialYDomain: [3008579981.1202655, 3008597422.2531605],
			autocompleteSource: '/api/v1/suggest/?d=OHJakQICQD6gTD7skx4EWA&',
			genomePositionSearchBox: {
				autocompleteServer: '//higlass.io/api/v1',
				autocompleteId: 'P0PLbQMwTYGy-5uPIQid7A',
				chromInfoServer: 'https://cgap-higlass.com/api/v1',
				chromInfoId: 'hg38',
				visible: true,
				options: {
					placeholderText: 'Search genome position or gene...',
					fontFamily: 'Lexend Deca',
				},
			},
			chromInfoPath: '//s3.amazonaws.com/pkerp/data/hg38/chromSizes.tsv',
			tracks: {
				top: [
					{
						filetype: 'chromsizes-tsv',
						server: '//higlass.io/api/v1',
						tilesetUid: 'NyITQvZsS_mOFNlz5C2LJg',
						uid: 'AdlJsUYFRzuJRZyYeKDX2A',
						type: 'chromosome-labels',
						options: {
							color: '#808080',
							stroke: '#ffffff',
							fontFamily: 'Lexend Deca',
							fontSize: 12,
							fontIsLeftAligned: false,
							showMousePosition: false,
							mousePositionColor: '#000000',
							reverseOrientation: false,
						},
						width: 811,
						height: 30,
					},
					{
						uid: 'fastaex',
						type: 'horizontal-sequence',
						server: 'https://cgap-higlass.com/api/v1',
						data: {
							type: 'fasta',
							fastaUrl: 'https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa',
							faiUrl: 'https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa.fai',
							chromSizesUrl:
								'https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.mod.chrom.sizes',
						},
						options: {
							colorAggregationMode: 'none',
							labelPosition: 'topLeft',
							labelColor: 'black',
							labelTextOpacity: 0.4,
							valueScaling: 'linear',
							trackBorderWidth: 0,
							trackBorderColor: 'white',
							name: 'hg38',
							backgroundColor: 'white',
							barBorder: true,
							barBorderColor: 'white',
							sortLargestOnTop: true,
							extendedPreloading: false,
							colorScale: ['#08519c', '#6baed6', '#993404', '#fe9929', '#808080', '#DCDCDC'],
							notificationText: 'Zoom in to see nucleotides...',
							fontSize: 16,
							fontFamily: 'Lexend Deca',
							fontColor: 'white',
							textOption: {
								fontSize: '32px',
								fontFamily: 'Lexend Deca',
								fill: 16777215,
								fontWeight: 'bold',
							},
						},
						width: 768,
						height: 25,
					},
					{
						server: 'https://cgap-higlass.com/api/v1',
						uid: 'emptytrack_transcripts',
						type: 'empty',
						options: {
							color: '#808080',
							stroke: '#ffffff',
							fontSize: 14,
							fontIsLeftAligned: false,
							showMousePosition: false,
							mousePositionColor: '#000000',
						},
						width: 568,
						height: 10,
					},
					{
						uid: 'texttrack_transcripts',
						type: 'text',
						server: 'https://cgap-higlass.com/api/v1',
						options: {
							backgroundColor: '#ededed',
							textColor: '#333333',
							fontSize: 11,
							fontFamily: 'Lexend Deca',
							fontWeight: 'normal',
							offsetY: 4,
							align: 'left',
							text: 'Transcripts',
						},
						width: 568,
						height: 20,
					},
					{
						server: 'https://cgap-higlass.com/api/v1',
						tilesetUid: 'transcripts_hg38',
						uid: 'transcript_annotation',
						type: 'horizontal-transcripts',
						options: {
							fontSize: 9,
							labelFontColor: '#222222',
							labelBackgroundColor: '#e9e9e9',
							minHeight: 24,
							plusStrandColor: '#bdbfff',
							minusStrandColor: '#fabec2',
							utrColor: '#C0EAAF',
							mousePositionColor: '#000000',
							transcriptHeight: 12,
							transcriptSpacing: 2,
							name: 'Gene transcripts',
							fontFamily: 'Lexend Deca',
							maxTexts: 100,
							showToggleTranscriptsButton: true,
							trackHeightAdjustment: 'automatic',
							startCollapsed: false,
							sequenceData: {
								type: 'fasta',
								fastaUrl: 'https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa',
								faiUrl: 'https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.fa.fai',
								chromSizesUrl:
									'https://aveit.s3.amazonaws.com/higlass/data/sequence/hg38.mod.chrom.sizes',
							},
						},
						width: 1868,
						height: 260,
					},
					{
						server: 'https://cgap-higlass.com/api/v1',
						uid: 'emptytrack_clinvar',
						type: 'empty',
						options: {
							color: '#808080',
							stroke: '#ffffff',
							fontSize: 14,
							fontIsLeftAligned: false,
							showMousePosition: false,
							mousePositionColor: '#000000',
						},
						width: 568,
						height: 10,
					},
					{
						uid: 'texttrack_clinvar',
						type: 'text',
						server: 'https://cgap-higlass.com/api/v1',
						options: {
							backgroundColor: '#ededed',
							textColor: '#333333',
							fontSize: 11,
							fontFamily: 'Lexend Deca',
							fontWeight: 'normal',
							offsetY: 4,
							align: 'left',
							text: 'ClinVar variants',
						},
						width: 568,
						height: 20,
					},
					{
						height: 111,
						type: 'horizontal-clinvar',
						uid: 'clinvar_20200824_v5',
						tilesetUid: 'clinvar_20200824_hg38',
						server: 'https://cgap-higlass.com/api/v1',
						options: {
							fontSize: 10,
							name: 'Clinvar',
							levelDistance: 20,
							fontFamily: 'Lexend Deca',
							labelTextColor: '#888888',
							significanceColors: {
								benign: '#009E73',
								pathogenic: '#D55E00',
								risk_factor: '#999999',
								likely_benign: '#56B4E9',
								likely_pathogenic: '#E69F00',
								benign_likely_benign: '#0072B2',
								uncertain_significance: '#808080',
								pathogenic_likely_pathogenic: '#CC79A7',
							},
						},
						width: 894,
					},
					{
						server: 'https://cgap-higlass.com/api/v1',
						uid: 'emptytrack_orthologs',
						type: 'empty',
						options: {
							color: '#808080',
							stroke: '#ffffff',
							fontSize: 14,
							fontIsLeftAligned: false,
							showMousePosition: false,
							mousePositionColor: '#000000',
						},
						width: 568,
						height: 10,
					},
					{
						uid: 'texttrack_orthologs',
						type: 'text',
						server: 'https://cgap-higlass.com/api/v1',
						options: {
							backgroundColor: '#ededed',
							textColor: '#333333',
							fontSize: 11,
							fontFamily: 'Lexend Deca',
							fontWeight: 'normal',
							offsetY: 4,
							align: 'left',
							text: 'Orthologs',
						},
						width: 568,
						height: 20,
					},
					{
						server: 'https://cgap-higlass.com/api/v1',
						uid: 'emptytrack_orthologs2',
						type: 'empty',
						options: {
							color: '#808080',
							stroke: '#ffffff',
							fontSize: 14,
							fontIsLeftAligned: false,
							showMousePosition: false,
							mousePositionColor: '#000000',
						},
						width: 568,
						height: 7,
					},
					{
						type: 'horizontal-orthologs',
						height: 100,
						tilesetUid: 'canonical_transcripts_hg38',
						server: 'https://cgap-higlass.com/api/v1',
						uid: 'orthologs',
						options: {
							rowHeight: 11,
							name: 'Orthologs',
							aminoAcidColor: '#333333',
							aminoAcidColorNoMatch: '#b0b0b0',
							fontSize: 10,
							fontFamily: 'Lexend Deca',
							gapsColor: '#eb9c00',
							labelTextColor: '#888888',
							minusStrandColor1: '#ffe0e2',
							minusStrandColor2: '#fff0f1',
							minusStrandColorZoomedOut: '#fabec2',
							plusStrandColor1: '#ebebff',
							plusStrandColor2: '#dedeff',
							plusStrandColorZoomedOut: '#bdbfff',
							rowSpacing: 2,
							species: ['human', 'zebrafish'],
						},
					},
					{
						server: 'https://cgap-higlass.com/api/v1',
						uid: 'emptytrack',
						type: 'empty',
						options: {
							color: '#808080',
							stroke: '#ffffff',
							fontSize: 14,
							fontIsLeftAligned: false,
							showMousePosition: false,
							mousePositionColor: '#000000',
						},
						width: 568,
						height: 20,
					},
				],
				left: [],
				center: [],
				right: [],
				bottom: [],
				whole: [
					{
						type: 'vertical-rule',
						x: 1000,
						options: { color: 'lightgrey' },
						uid: 'vr1',
						width: 20,
						height: 20,
					},
					{
						type: 'vertical-rule',
						x: 1001,
						options: { color: 'lightgrey' },
						uid: 'vr2',
						width: 20,
						height: 20,
					},
				],
				gallery: [],
			},
			layout: { w: 12, h: 12, x: 0, y: 0, moved: false, static: false },
			genomePositionSearchBoxVisible: false,
		},
	],
	zoomLocks: { locksByViewUid: {}, locksDict: {} },
	locationLocks: { locksByViewUid: {}, locksDict: {} },
	valueScaleLocks: { locksByViewUid: {}, locksDict: {} },
}

onMounted(async () => {
	if (!hgContainer.value) return

	const [
		hglib,
		{ default: register },
		{ TranscriptsTrack },
		{ ClinvarTrack },
		{ SequenceTrack },
		{ OrthologsTrack },
		{ TextTrack },
	] = await Promise.all([
		import('higlass'),
		import('higlass-register'),
		import('higlass-transcripts'),
		import('higlass-clinvar'),
		import('higlass-sequence'),
		import('higlass-orthologs'),
		import('higlass-text'),
	])

	register({ track: TextTrack, config: TextTrack.config })
	register({ track: ClinvarTrack, config: ClinvarTrack.config })
	register({ track: SequenceTrack, config: SequenceTrack.config })
	register({ track: OrthologsTrack, config: OrthologsTrack.config })
	register({ track: TranscriptsTrack, config: TranscriptsTrack.config })

	hgApi = hglib.viewer(hgContainer.value, viewConfig, { bounded: true })
})

onBeforeUnmount(() => {
	hgApi = null
})
</script>
