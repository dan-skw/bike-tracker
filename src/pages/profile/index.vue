<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

const handleSignout = () => {
  userStore.endSession()
  userStore.clearUser()
  userStore.clearProfile()

  router.push('/')
}

const profile = computed(() => userStore.profile)
const creationDate = computed(() => {
  const createdAt = userStore.user?.metadata?.creationTime
  return createdAt ? new Date(createdAt).toLocaleDateString('pl-PL') : 'brak danych'
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
