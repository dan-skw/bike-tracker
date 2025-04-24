<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { formatDateToPl } from '@/utils/formatDateToPl'
import { formatTime } from '@/utils/formatTime'
import { useUserStats } from '@/utils/routes/useUserStats'
import { useRoutes } from '@/utils/routes/useRoutes'
import { useUserStore } from '@/stores/user'
import type { UserStats } from '@/types/UserStats'
import type { RouteEntry } from '@/types/RouteEntry'

const userStore = useUserStore().user

const { getUserStats } = useUserStats()
const { getLastSavedRoute } = useRoutes()

const stats = ref<UserStats>({
    totalDistanceKm: 0,
    totalDurationSeconds: 0,
    totalRoutes: 0,
    lastUpdated: new Date(),
})

const lastSavedRoute = ref<RouteEntry | null>(null)

onMounted(async () => {
    const userId = userStore?.uid
    if (!userId) return

    const userStatsSnap = await getUserStats(userId)

    if (userStatsSnap) {
        const data = userStatsSnap

        const statsData: UserStats = {
            totalDistanceKm: data.totalDistanceKm,
            totalDurationSeconds: data.totalDurationSeconds,
            totalRoutes: data.totalRoutes,
            lastUpdated: data.lastUpdated.toDate?.() ?? new Date(data.lastUpdated),
        }

        stats.value = statsData
        lastSavedRoute.value = await getLastSavedRoute()
        console.log('Ostatnia trasa:', lastSavedRoute.value)
    } else {
        console.log('Nie znaleziono statystyk użytkownika')
    }
})

</script>

<template>
    <section class="space-y-6">
        <div v-if="stats" class="flex flex-row justify-between items-center">
            <div class="">
                <h4 class="scroll-m-20 text-md font-semibold tracking-tight">Podsumowanie</h4>
                <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    Twoje statystyki
                </h2>
            </div>
            <iconify-icon icon="lucide:gauge" width="58" />
        </div>

        <div v-if="stats" class="grid grid-cols-2 gap-4">
            <div class="bg-white rounded-lg shadow p-4">
                <p class="text-gray-500 text-sm">Łączny dystans</p>
                <p class="text-xl font-semibold">{{ stats.totalDistanceKm }} km</p>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <p class="text-gray-500 text-sm">Łączny czas</p>
                <p class="text-xl font-semibold">{{ formatTime(stats.totalDurationSeconds) }}</p>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <p class="text-gray-500 text-sm">Liczba tras</p>
                <p class="text-xl font-semibold">{{ stats.totalRoutes }}</p>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <p class="text-gray-500 text-sm">Ulubione miasto</p>
                <p class="text-xl font-semibold">krak</p>
            </div>
        </div>

        <div v-if="lastSavedRoute" class="bg-white rounded-lg shadow p-4">
            <h2 class="text-lg font-bold mb-2">Ostatnia aktywność</h2>
            <p class="text-gray-500 text-sm">Trasa z {{ formatDateToPl(lastSavedRoute.createdAt) }}</p>
            <p class="text-md">📍 {{ lastSavedRoute.location.city }} – {{ lastSavedRoute.distanceKm }} km– {{
                formatTime(lastSavedRoute.durationSeconds) }}</p>
        </div>
    </section>
</template>
