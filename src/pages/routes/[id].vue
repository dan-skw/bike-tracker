<!-- views/RouteDetails.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/firebase/initFirebase'
import { doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/formatDate'
import type { DocumentData } from 'firebase/firestore'

import RouteMap from '@/components/RouteMap.vue'

const userStore = useUserStore()
const routeId = useRoute('/routes/[id]').params
console.log(routeId)

const path = ref<[number, number][]>([])
const data = ref<DocumentData>()

onMounted(async () => {
  if (!userStore.user?.uid) {
    throw new Error('User not logged in')
  }
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
  <div v-if="data" class="p-4">
    <h2 class="mb-4 text-xl font-bold">
      Szczegóły trasy odbytej dnia {{ formatDate(data.createdAt) }}
    </h2>
    <RouteMap :path="path" />
    <div class="mt-4 flex justify-between">
      <div class="text-sm text-gray-500">Dystans: {{ data.distanceKm }} km</div>
      <div class="text-sm text-gray-500">
        Czas trwania: {{ Math.floor(data.durationSeconds / 60) }} min
      </div>
    </div>
  </div>
</template>
