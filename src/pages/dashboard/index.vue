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
    totalDistanceMeters: 0,
    totalDurationSeconds: 0,
    totalRoutes: 0,
    lastUpdated: new Date(),
})

const lastSavedRoute = ref<RouteEntry | null>(null)

const loading = ref(false)

onMounted(async () => {
    loading.value = true
    const userId = userStore?.uid
    if (!userId) return
    console.log(useUserStore().profile)

    const userStatsSnap = await getUserStats(userId)
    if (!userStatsSnap) {
        console.log('Nie znaleziono statystyk użytkownika')
        loading.value = false
        return
    }
    if (userStatsSnap) {
        const data = userStatsSnap
        console.log(userStore?.providerData)
        const statsData: UserStats = {
            totalDistanceKm: data.totalDistanceKm,
            totalDistanceMeters: data.totalDistanceMeters,
            totalDurationSeconds: data.totalDurationSeconds,
            totalRoutes: data.totalRoutes,
            lastUpdated: data.lastUpdated.toDate?.() ?? new Date(data.lastUpdated),
        }

        stats.value = statsData
        lastSavedRoute.value = await getLastSavedRoute()
        loading.value = false
    } else {
        console.log('Nie znaleziono statystyk użytkownika')
    }
})

</script>

<template>
    <section class="space-y-6 h-full">
        <div v-if="loading" class="h-full flex flex-col items-center justify-center bg-[#F2F0EF]">
            <Loader />
        </div>
        <NoRoutesHistory v-if="!loading && !lastSavedRoute"></NoRoutesHistory>
        <div v-else class="space-y-6 ">
            <div v-if="stats" class="flex flex-row justify-between items-center">
                <div class="">
                    <h4 class="scroll-m-20 text-md font-semibold tracking-tight">Podsumowanie</h4>
                    <h2 class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                        Twoje statystyki, {{ useUserStore().profile?.displayName }}
                    </h2>
                </div>
                <iconify-icon icon="lucide:gauge" width="58" />
            </div>

            <div v-if="stats" class="grid grid-cols-2 gap-4">
                <StatCard label="Łączny dystans" :value="`${stats.totalDistanceKm} km ${stats.totalDistanceMeters} m`"
                    icon="lucide:map" iconBg="bg-blue-100" iconColor="text-blue-600" />
                <StatCard label="Łączny czas" :value="formatTime(stats.totalDurationSeconds)" icon="lucide:timer"
                    iconBg="bg-green-100" iconColor="text-green-600" />
                <StatCard label="Liczba tras" :value="stats.totalRoutes" icon="lucide:bike" iconBg="bg-yellow-100"
                    iconColor="text-yellow-600" />
                <StatCard label="Ulubione miasto" value="Kraków" icon="lucide:map-pin" iconBg="bg-purple-100"
                    iconColor="text-purple-600" />
            </div>
        </div>

        <div v-if="lastSavedRoute" class="bg-white rounded-lg shadow p-4">
            <h2 class="text-lg font-bold mb-2">Ostatnia aktywność</h2>
            <p class="text-gray-500 text-sm">Trasa z {{ formatDateToPl(lastSavedRoute.createdAt) }}</p>
            <p class="text-md">📍 {{ lastSavedRoute.location.city }} – {{ lastSavedRoute.distanceKm }} km – {{
                formatTime(lastSavedRoute.durationSeconds) }}</p>
        </div>
    </section>
</template>
