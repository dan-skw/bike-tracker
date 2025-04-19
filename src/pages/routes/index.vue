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
  <section class="p-6 space-y-5 w-full h-screen bg-white/80 overflow-hidden">
    <div class="flex flex-row justify-between items-center">
      <div class="">
        <h4 class="scroll-m-20 text-md font-semibold tracking-tight">Moja strasa</h4>
        <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {{ currentPosition.city }}
        </h2>
      </div>
      <iconify-icon icon="mdi:bike-fast" width="58"></iconify-icon>

    </div>


    <div class="h-full">
      <div id="map" ref="mapContainer" class="z-0 shadow-md p-4 rounded-lg h-3/5" />

      <div class="z-10 flex flex-col items-center justify-center pointer-events-none">
        <div class="space-y-4 text-left w-full pointer-events-auto ">
          <div class="p-4 rounded-lg shadow-md mt-5 flex justify-between items-center">
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
