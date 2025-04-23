<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase/initFirebase'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/formatDate'
import { getPhotoByRouteId } from '@/utils/camera/getPhotoByRouteId'

import type { DocumentData } from 'firebase/firestore'
import RouteMap from '@/components/RouteMap.vue'

const userStore = useUserStore()
const routeId = useRoute('/routes/[id]').params
console.log(routeId)

const path = ref<[number, number][]>([])
const data = ref<DocumentData>()
const photoUrl = ref<string | null>(null)
const activeSlide = ref<'photo' | 'map'>('map')


onMounted(async () => {
  if (!userStore.user?.uid) {
    throw new Error('User not logged in')
  }
  photoUrl.value = await getPhotoByRouteId(userStore.user.uid, routeId.id as string)
  const docRef = doc(db, 'routes', userStore.user.uid, 'entries', routeId.id as string)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    data.value = docSnap.data()
    path.value = data.value.path || []
    console.log('Dane trasy:', data.value)
  } else {
    console.error('Nie znaleziono trasy.')
  }
})
</script>

<template>
  <section v-if="data" class="space-y-5 w-full h-screen overflow-hidden">
    <div class="flex flex-row justify-between items-center">
      <div class="">
        <h4 class="scroll-m-20 text-md font-semibold tracking-tight">Podsumowanie twojej trasy</h4>
        <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {{ data.location.city }}
        </h2>
        <p>{{ data.location.state }} {{ formatDate(data.createdAt) }}</p>
      </div>
      <iconify-icon icon="lucide:route" width="58"></iconify-icon>

    </div>


    <div class="h-full">

      <div v-if="activeSlide === 'map'" class="h-2/5">
        <RouteMap :path="path" />
      </div>
      <div v-if="activeSlide === 'photo'" class="h-2/5">
        <img v-if="photoUrl" :src="photoUrl" alt="Zdjęcie trasy"
          class="w-full h-full object-cover rounded-lg shadow-md" />
        <div v-else class="flex items-center justify-center h-full">
          <iconify-icon icon="lucide:camera-off" width="50" class="text-muted
            "></iconify-icon>
          <p class="text-lg text-muted-foreground">Nie znaleziono zdjęcia trasy.</p>
        </div>
      </div>

      <div v-if="photoUrl" class="flex flex-row justify-between items-center mt-4">
        <Button variant="outline" class="text-2xl p-6" @click="activeSlide = 'map'">Mapa</Button>
        <Button variant="outline" class="text-2xl p-6" @click="activeSlide = 'photo'">Zdjęcie</Button>
      </div>

      <div class="z-10 flex flex-col items-center justify-center pointer-events-none">
        <div class="space-y-4 text-left w-full pointer-events-auto ">
          <div class="mt-5 flex flex-col gap-4 justify-between items-center">
            <div class="grid grid-cols-2 gap-4 w-full h-1/2 ">
              <div class="bg-white shadow-md rounded-lg w-full h-full flex flex-col items-center p-2">
                <iconify-icon icon="lucide:timer" width="50"></iconify-icon>
                <h2>Czas</h2>
                <p class="text-xl font-bold">
                  {{ Math.floor(data.durationSeconds / 3600) }} h
                  {{ Math.floor((data.durationSeconds % 3600) / 60) }} min
                </p>
              </div>
              <div class="bg-white shadow-md rounded-lg w-full h-full flex flex-col items-center p-2">
                <iconify-icon icon="lucide:map-pin" width="50"></iconify-icon>
                <h2>Dystans</h2>
                <p class="text-xl font-bold">
                  {{ data.distanceKm }} km
                </p>
              </div>
            </div>
            <!-- <div class="bg-white rounded-lg shadow-md w-full h-1/2 ">
              <div class="flex flex-col items-center justify-center h-full p-4">
                <iconify-icon icon="lucide:map" width="50"></iconify-icon>
                <h2>Mapa</h2>
                <p class="text-xl font-bold">
                  {{ data.location.city }}
                </p>
              </div>
              <div class="flex flex-col items-center justify-center h-full p-4">
                <p class="text-md text-muted-foreground flex">
                  <iconify-icon icon="lucide:map-pin"></iconify-icon>
                  <span class="-translatey-0.5">Punkty startowe</span>
                </p>

              </div>
              <div class="flex flex-col items-center justify-center h-full p-4">
                <p class="text-md text-muted-foreground flex">
                  <iconify-icon icon="lucide:map-pin"></iconify-icon>
                  <span class="-translatey-0.5">Punkty końcowe</span>
                </p>
                <p class="text-xl font-bold">
                  {{ data.location.city }}
                </p>
              </div>
            </div> -->
          </div>
        </div>
      </div>

    </div>
  </section>
</template>