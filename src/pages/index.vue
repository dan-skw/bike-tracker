<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useStatsStore } from '@/stores/stats'
import { computed } from 'vue'

const userStore = useUserStore()
const statsStore = useStatsStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const ctaLink = computed(() => isLoggedIn.value ? '/dashboard' : '/login')
const ctaLabel = computed(() => isLoggedIn.value ? 'Przejdź do panelu' : 'Rozpocznij przygodę')

const welcomeMessage = computed(() => {
  if (!isLoggedIn.value) return 'Twój niezawodny kompan rowerowych wojaży — śledź trasy, bij rekordy i odkrywaj nowe miejsca.'
  const name = userStore.profile?.displayName ?? 'Rowerzysto'
  const distance = statsStore.stats?.totalDistanceKm ?? 0
  const rides = statsStore.stats?.totalRoutes ?? 0
  return `Cześć ${name}, przejechałeś już z nami ${distance} km w ${rides} tras${rides === 1 ? 'ie' : 'ach'}!`
})
</script>

<template>
  <section class="min-h-screen bg-[#F2F0EF] flex flex-col items-center justify-center text-center p-6">
    <div class="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full space-y-6 animate-fade-in">
      <div class="text-5xl">🚴‍♂️</div>
      <h1 class="text-3xl font-bold text-gray-800">
        Witaj w <span class="text-gray-600">Rowerniku</span>
      </h1>
      <p class="text-gray-600">{{ welcomeMessage }}</p>

      <RouterLink :to="ctaLink"
        class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition">
        {{ ctaLabel }}
      </RouterLink>
    </div>

    <p class="mt-8 text-sm text-gray-400">© {{ new Date().getFullYear() }} Daniel Skwarczek</p>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out both;
}
</style>
