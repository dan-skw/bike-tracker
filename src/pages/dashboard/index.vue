<script setup lang="ts">
import { computed } from 'vue'
import { useStatsStore } from '@/stores/stats'
import { useUserStore } from '@/stores/user'
import { formatDateToPl } from '@/utils/formatDateToPl'
import { formatTime } from '@/utils/formatTime'
import NoRoutesHistory from '@/components/NoRoutesHistory.vue'
import Loader from '@/components/Loader.vue'

const statsStore = useStatsStore()
const userStore = useUserStore()

const stats = computed(() => statsStore.stats)
const lastSavedRoute = computed(() => statsStore.lastRoute)
// pobieraj sie dane
const isLoading = computed(() => stats.value === null && lastSavedRoute.value === null)
// sprawdz czy sa dane
const isEmpty = computed(() =>
    stats.value !== null &&
    (stats.value.totalRoutes === 0 || lastSavedRoute.value === null)
)
</script>

<template>
    <section class="space-y-6 h-full">
        <div v-if="isLoading" class="h-full flex flex-col items-center justify-center bg-[#F2F0EF]">
            <Loader />
        </div>

        <NoRoutesHistory v-else-if="isEmpty" />

        <div v-else class="space-y-6">
            <div class="flex flex-row justify-between items-center">
                <div>
                    <h4 class="text-md font-semibold tracking-tight">Podsumowanie</h4>
                    <h2 class="text-3xl font-semibold tracking-tight">
                        Twoje statystyki, {{ userStore.profile?.displayName }}
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

            <div v-if="lastSavedRoute" class="bg-white rounded-lg shadow p-4">
                <h2 class="text-lg font-bold mb-2">Ostatnia aktywność</h2>
                <p class="text-gray-500 text-sm">
                    Trasa z {{ formatDateToPl(lastSavedRoute.createdAt) }}
                </p>
                <p class="text-md">
                    📍 {{ lastSavedRoute.location.city }} – {{ lastSavedRoute.distanceKm }} km – {{
                        formatTime(lastSavedRoute.durationSeconds)
                    }}
                </p>
            </div>
        </div>
    </section>
</template>
