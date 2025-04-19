import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useUserStore } from '@/stores/user'

export const useRouteStore = defineStore('route-store', () => {
  const latestRoute = ref(null)
  const latestRouteId = ref<string>('')

  const setLatestRoute = (route: any) => {
    latestRoute.value = route
  }

  const getLatestRoute = () => {
    return latestRoute.value
  }

  const setLatestRouteId = (routeId: string) => {
    latestRouteId.value = routeId
  }

  const getLatestRouteId = () => {
    return latestRouteId.value
  }

  const clearLatestRoute = () => {
    latestRoute.value = null
    latestRouteId.value = ''
  }

  return {
    latestRoute,
    latestRouteId,
    setLatestRoute,
    getLatestRoute,
    setLatestRouteId,
    getLatestRouteId,
    clearLatestRoute,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
