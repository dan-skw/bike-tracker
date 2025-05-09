<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useStatsStore } from '@/stores/stats'
import { useRouteStore } from '@/stores/route'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const statsStore = useStatsStore()
const routeStore = useRouteStore()
const router = useRouter()

let profile = computed(() => userStore.profile)
let creationDate = computed(() => {
  const createdAt = userStore.user?.metadata?.creationTime
  return createdAt ? new Date(createdAt).toLocaleDateString('pl-PL') : 'brak danych'
})
const handleSignout = () => {
  userStore.endSession()
  userStore.clearUser()
  userStore.clearProfile()
  statsStore.clearStats()
  routeStore.clearLatestRoute()
  router.push('/')
}

onMounted(() => {
  profile = computed(() => userStore.profile)
  creationDate = computed(() => {
    const createdAt = userStore.user?.metadata?.creationTime
    return createdAt ? new Date(createdAt).toLocaleDateString('pl-PL') : 'brak danych'
  })
})
</script>

<template>
  <section v-if="profile" class="flex flex-col h-full items-center justify-center gap-6 p-6">
    <img v-if="profile.photoURL" :src="profile.photoURL" alt="Avatar"
      class="w-24 h-24 rounded-full shadow-md object-cover" />
    <div class="text-center">
      <h2 class="text-2xl font-bold">{{ profile.displayName || 'Użytkownik' }}</h2>
      <p class="text-gray-500 text-sm">{{ profile.email }}</p>
      <p class="text-sm text-muted-foreground mt-1">Konto od: {{ creationDate }}</p>
    </div>
    <Button class="w-full max-w-xs" variant="destructive" @click="handleSignout">Wyloguj się</Button>
  </section>

</template>
