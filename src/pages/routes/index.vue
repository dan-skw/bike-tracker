<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoutes } from '@/utils/useRoutes'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { formatDate } from '@/utils/formatDate'

const userStore = useUserStore()

const { getUserRoutes } = useRoutes()

const routes = ref<any[]>([])
const loading = ref(true)
const router = useRouter()

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
  <div class="p-4">
    <h1 class="mb-4 text-2xl font-bold">Historia przejazdów</h1>

    <div v-if="loading">Ładowanie...</div>
    <div v-else-if="routes.length === 0">Brak przejazdów</div>

    <ul class="space-y-2">
      <li
        v-for="route in routes"
        :key="route.id"
        class="cursor-pointer rounded border p-4 hover:bg-gray-50"
        @click="goToDetails(route.id)"
      >
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
</template>
