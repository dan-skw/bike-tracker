<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoutes } from '@/utils/routes/useRoutes'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/formatDate'
import { groupRoutesByDay } from '@/utils/routes/groupRoutesByDay'
const userStore = useUserStore()

import type { RouteEntry } from '@/types/RouteEntry'

const { getUserRoutes } = useRoutes()

const routes = ref<RouteEntry[]>([])
const loading = ref(false)
const router = useRouter()

const groupedRoutes = computed(() => groupRoutesByDay(routes.value))

const goToDetails = (rideId: string) => {
  router.push(`/routes/${rideId}`)
}

onMounted(async () => {
  loading.value = true
  if (userStore.user) {
    routes.value = await getUserRoutes()
  } else {
    console.error('Nie znaleziono użytkownika.')
  }
  loading.value = false
})
</script>

<template>
  <section class="h-full">
    <div class="flex flex-row justify-between items-center">
      <div class="">
        <h4 class="scroll-m-20 text-md font-semibold tracking-tight">Historia</h4>
        <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Twoich tras
        </h2>
      </div>
      <iconify-icon icon="lucide:calendar-range" width="58"></iconify-icon>
    </div>

    <NoRoutesHistory v-if="routes.length === 0 && !loading" />

    <div v-else>

      <div v-if="loading">Ładowanie...</div>

      <div v-for="(dayRoutes, day) in groupedRoutes" :key="day" class="mt-4 ">
        <h3 class="text-lg font-semibold mb-2 ">{{ day }}</h3>

        <ul class="space-y-2">
          <li v-for="route in dayRoutes" :key="route.id"
            class="cursor-pointer rounded border p-4 bg-white hover:bg-gray-50" @click="goToDetails(route.id)">
            <div class="flex justify-between">
              <span class="font-semibold">{{ formatDate(route.createdAt) }}</span>
              <span>{{ route.distanceKm }} km</span>
            </div>
            <div class="text-sm text-gray-500">
              Czas trwania: {{ Math.floor(route.durationSeconds / 60) }} min
            </div>
          </li>
        </ul>
      </div>

    </div>
  </section>
</template>
