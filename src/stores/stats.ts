import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useRoutes } from '@/utils/routes/useRoutes'
import type { RouteEntry } from '@/types/RouteEntry'
import type { UserStats } from '@/types/UserStats'

export const useStatsStore = defineStore('user-stats', () => {
  const stats = useStorage<UserStats | null>('user-stats', null)
  const lastRoute = useStorage<RouteEntry | null>('last-route', null)

  const { getLastSavedRoute } = useRoutes()

  const setStats = async (newStats: UserStats) => {
    stats.value = newStats
    lastRoute.value = await getLastSavedRoute()
  }

  const clearStats = () => {
    stats.value = null
    lastRoute.value = null
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
