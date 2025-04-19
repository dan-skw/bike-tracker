<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'

const props = defineProps<{
  path: [number, number][]
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let polyline: L.Polyline | null = null

function initMap() {
  if (!mapContainer.value || props.path.length === 0) return

  const start = props.path[0]

  map = L.map(mapContainer.value).setView(start, 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  polyline = L.polyline(props.path, { color: 'blue' }).addTo(map)
  map.fitBounds(polyline.getBounds())
}

onMounted(() => {
  initMap()
})

watch(
  () => props.path,
  () => {
    if (map && polyline) {
      polyline.setLatLngs(props.path)
      map.fitBounds(polyline.getBounds())
    } else {
      initMap()
    }
  },
)
</script>

<template>
  <div id="map" ref="mapContainer" class="z-0 shadow-md p-4 rounded-lg h-1/3" />
</template>
