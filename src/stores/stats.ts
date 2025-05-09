import { defineStore, acceptHMRUpdate } from 'pinia'
import { useRoutes } from '@/utils/routes/useRoutes'
import type { RouteEntry } from '@/types/RouteEntry'
import type { UserStats } from '@/types/UserStats'
import { ref } from 'vue'

export const useStatsStore = defineStore('user-stats', () => {
  const stats = ref<UserStats | null>()
  const lastRoute = ref<RouteEntry | null>()

  const { getLastSavedRoute } = useRoutes()

  const setStats = async (newStats: UserStats) => {
    stats.value = newStats
    lastRoute.value = await getLastSavedRoute()
    localStorage.setItem('user-stats', JSON.stringify(newStats))
    localStorage.setItem('last-route', JSON.stringify(lastRoute.value))
  }

  const clearStats = () => {
    stats.value = null
    lastRoute.value = null
    localStorage.removeItem('user-stats')
    localStorage.removeItem('last-route')
  }

  return {
    stats,
    lastRoute,
    setStats,
    clearStats,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatsStore, import.meta.hot))
}
