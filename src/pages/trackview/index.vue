<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import L from 'leaflet'

import Button from '@/components/ui/button/Button.vue'

import { getLocationName } from '@/utils/geolocation/getLocationName'
import { calculateDistance } from '@/utils/geolocation/calculateDistance'

import { useRoutes } from '@/utils/routes/useRoutes'
import { useRouter } from 'vue-router'

import { useRouteStore } from '@/stores/route'
import { useUserStore } from '@/stores/user'

import { useUserStats } from '@/utils/routes/useUserStats'
const { updateStatsAfterRouteSave } = useUserStats()
const { saveRoute } = useRoutes()

const router = useRouter()

const tracking = ref(false)
const path = ref<[number, number][]>([])
const watchId = ref<number | null>(null)
const mapContainer = ref<HTMLElement | null>(null)
const startTime = ref<number | null>(null)
const toggle = ref(false)

const currentPosition = ref<{
  city: string
  state: string
  road: string
}>({
  city: '',
  state: '',
  road: '',
})
const elapsedSeconds = ref(0)
let interval: number | null = null



let map: L.Map | null = null
let polyline: L.Polyline | null = null
let marker: L.Marker | null = null

const distanceKm = computed(() => calculateDistance(path.value) / 1000)

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
      getLocationName(latitude, longitude).then((location) => {
        if (location) {
          currentPosition.value = {
            city: location.city || '',
            state: location.state || '',
            road: location.road || '',
          }
        } else {
          console.log('Nie można uzyskać nazwy lokalizacji.')
        }
      })
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

function toggleTracking() {
  toggle.value = !toggle.value

  if (!tracking.value) {
    tracking.value = true
    startTime.value = Date.now() - elapsedSeconds.value * 1000

    interval = window.setInterval(() => {
      elapsedSeconds.value = Math.floor((Date.now() - (startTime.value || 0)) / 1000)
    }, 1000)

    watchId.value = navigator.geolocation.watchPosition((position) => {
      const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
      path.value.push(coords)

      if (polyline) polyline.addLatLng(coords)
      if (marker) marker.setLatLng(coords)
      if (map) map.panTo(coords)
    },
      (error) => {
        console.error('Błąd geolokalizacji:', error)
        alert('Nie udało się uzyskać lokalizacji.')
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    )
  } else {
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
}

async function endTracking() {
  if (tracking.value) {
    tracking.value = false
    if (watchId.value !== null) {
      navigator.geolocation.clearWatch(watchId.value)
      watchId.value = null
    }

    if (interval !== null) {
      clearInterval(interval)
      interval = null
    }

    try {
      const routeId = await saveRoute(path.value, distanceKm.value, elapsedSeconds.value,
        {
          city: currentPosition.value.city,
          state: currentPosition.value.state,
          road: currentPosition.value.road,
        }
      )
      useRouteStore().setLatestRouteId(routeId)
      await updateStatsAfterRouteSave(useUserStore().user?.uid as string, distanceKm.value, elapsedSeconds.value)
      router.push(`/trackview/success/${routeId}`)
    }
    catch (error) {
      console.error('Błąd podczas zapisywania trasy:', error)
    }
    path.value = []
    elapsedSeconds.value = 0
    startTime.value = null

  }
}
</script>

<template>
  <section class="space-y-5 w-full h-full  bg-[#F2F0EF] overflow-hidden">
    <div class="flex flex-row justify-between items-center">
      <div class="">
        <h4 class="scroll-m-20 text-md font-semibold tracking-tight">Moja trasa</h4>
        <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {{ currentPosition.city }}
        </h2>
      </div>
      <iconify-icon icon="mdi:bike-fast" width="58"></iconify-icon>

    </div>


    <div class="h-full">
      <div id="map" ref="mapContainer" class="z-0 shadow-md p-4 rounded-lg h-2/5" />

      <div class="z-10 flex flex-col items-center justify-center pointer-events-none">
        <div class="space-y-4 text-left w-full pointer-events-auto ">
          <div class="p-4 rounded-lg shadow-md mt-5 flex bg-white justify-between items-center gap-4">
            <div>
              <p class="text-md text-muted-foreground flex">
                <iconify-icon icon="lucide:timer"></iconify-icon><span class="-translate-y-0.5">Czas</span>
              </p>
              <p class="text-3xl font-bold text-primary">
                {{ formattedTime }}
              </p>
              <p class="text-md text-muted-foreground">{{ distanceKm }} km</p>
            </div>
            <Button class="rounded-full  text-white w-14 h-14" @click="toggleTracking">
              <iconify-icon :icon="toggle ? 'lucide:pause' : 'lucide:play'" width="30"></iconify-icon>
            </Button>
          </div>
        </div>
      </div>
      <div v-if="tracking" class="flex flex-col items-center justify-center  mt-5">
        <Button class="p-8 w-full" @click="endTracking">Zakończ trasę</Button>
      </div>
    </div>
  </section>
</template>

<style scoped>
#map {
  width: 100%;
}
</style>
