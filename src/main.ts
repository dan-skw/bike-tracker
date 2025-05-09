import './assets/index.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/images/marker-icon.png'
import 'iconify-icon'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'

import App from './App.vue'
import router from './router'

import { useUserStore } from '@/stores/user'
import { useStatsStore } from '@/stores/stats'
import { useUserStats } from '@/utils/routes/useUserStats'
import type { UserStats } from '@/types/UserStats'

const app = createApp(App)

app.use(createPinia())

const userStore = useUserStore()
const statsStore = useStatsStore()

await userStore.trackAuthChanges()
await userStore.loadProfile?.()

const { getUserStats } = useUserStats()
if (userStore.user?.uid) {
  const statsSnap = await getUserStats(userStore.user.uid)
  if (statsSnap) {
    const parsedStats: UserStats = {
      totalDistanceKm: statsSnap.totalDistanceKm ?? 0,
      totalDistanceMeters: statsSnap.totalDistanceMeters ?? 0,
      totalDurationSeconds: statsSnap.totalDurationSeconds ?? 0,
      totalRoutes: statsSnap.totalRoutes ?? 0,
      lastUpdated: statsSnap.lastUpdated?.toDate?.() ?? new Date(),
    }
    await statsStore.setStats(parsedStats)
  }
}

app.use(DataLoaderPlugin, { router })
app.use(router)

app.mount('#app')
