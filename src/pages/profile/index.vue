<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useStatsStore } from '@/stores/stats'
import { useRouteStore } from '@/stores/route'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { formatDate } from '@/utils/formatDate'
import type { Timestamp } from 'firebase/firestore'

const userStore = useUserStore()
const statsStore = useStatsStore()
const routeStore = useRouteStore()
const router = useRouter()

const profile = userStore.profile
const creationDate = formatDate(profile?.createdAt as Timestamp)

const handleSignout = () => {
  userStore.endSession()
  userStore.clearUser()
  userStore.clearProfile()
  statsStore.clearStats()
  routeStore.clearLatestRoute()
  router.push('/')
}

onMounted(async () => {
  await userStore.loadProfile()

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
