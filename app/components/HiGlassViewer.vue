<template>
	<div ref="hgContainer" style="width: 100%; height: 600px" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

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
</script>
