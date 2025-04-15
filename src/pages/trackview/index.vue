<template>
  <div class="space-y-4 p-4">
    <div id="map" ref="mapContainer" class="h-[250px] w-full"></div>

    <div v-if="!tracking">
      <button class="btn btn-primary" @click="startTracking">Rozpocznij trasę</button>
    </div>
    <div v-else>
      <p class="text-green-600">Zbieranie lokalizacji… (punktów: {{ path.length }})</p>
      <p>Czas: {{ formattedTime }}</p>
      <p>Dystans: {{ distanceKm.toFixed(2) }} km</p>
      <div class="flex gap-2">
        <button class="btn btn-secondary" @click="stopTracking">Koniec</button>
        <button v-if="path.length > 1" class="btn btn-success" @click="save">Zapisz trasę</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import L from 'leaflet'
import { getAuth } from 'firebase/auth'

import { saveRoute } from '../../utils/saveRoute'

const tracking = ref(false)
const path = ref<[number, number][]>([])
const watchId = ref<number | null>(null)
const mapContainer = ref<HTMLElement | null>(null)
const startTime = ref<number | null>(null)
const elapsedSeconds = ref(0)
let interval: number | null = null

let map: L.Map | null = null
let polyline: L.Polyline | null = null
let marker: L.Marker | null = null

const distanceKm = computed(() => calculateDistance(path.value))

const formattedTime = computed(() => {
  const sec = elapsedSeconds.value % 60
  const min = Math.floor(elapsedSeconds.value / 60) % 60
  const hr = Math.floor(elapsedSeconds.value / 3600)
  return `${hr.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec
    .toString()
    .padStart(2, '0')}`
})

onMounted(() => {
  if (!navigator.geolocation) {
    alert('Twoja przeglądarka nie obsługuje geolokalizacji.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      initMap(latitude, longitude)
    },
    (err) => {
      console.error(err)
      alert('Nie udało się uzyskać lokalizacji.')
    },
    { enableHighAccuracy: true },
  )
})

function initMap(lat: number, lng: number) {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView([lat, lng], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  polyline = L.polyline([], { color: 'blue' }).addTo(map)
  marker = L.marker([lat, lng]).addTo(map)
}

function startTracking() {
  const user = getAuth().currentUser
  if (!user) {
    alert('Musisz być zalogowany, aby rozpocząć trasę.')
    return
  }
  tracking.value = true
  path.value = []
  startTime.value = Date.now()
  elapsedSeconds.value = 0

  interval = window.setInterval(() => {
    elapsedSeconds.value++
  }, 1000)

  watchId.value = navigator.geolocation.watchPosition(
    (position) => {
      const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
      path.value.push(coords)

      if (polyline) polyline.addLatLng(coords)
      if (marker) marker.setLatLng(coords)
      if (map) map.panTo(coords)
    },
    (err) => {
      console.error(err)
      alert('Nie można pobrać lokalizacji.')
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000,
    },
  )
}

function stopTracking() {
  tracking.value = false
  if (watchId.value !== null) {
    navigator.geolocation.clearWatch(watchId.value)
    watchId.value = null
  }

  if (interval !== null) {
    clearInterval(interval)
    interval = null
  }
}

async function save() {
  try {
    await saveRoute(path.value, distanceKm.value, elapsedSeconds.value)
    alert(`Trasa została zapisana z ID:`)
  } catch (err) {
    alert('Nie udało się zapisać trasy.' + err)
  }
}

// Funkcja pomocnicza: oblicz dystans w kilometrach
function calculateDistance(coords: [number, number][]) {
  let distance = 0
  for (let i = 1; i < coords.length; i++) {
    distance += haversine(coords[i - 1], coords[i])
  }
  return distance
}

function haversine(coord1: [number, number], coord2: [number, number]) {
  const toRad = (x: number) => (x * Math.PI) / 180
  const [lat1, lon1] = coord1
  const [lat2, lon2] = coord2
  const R = 6371 // km

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
</script>

<style scoped>
#map {
  height: 400px;
  width: 100%;
}
</style>
