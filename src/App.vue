<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'

const userStore = useUserStore()

onMounted(async () => {
  console.log('mounting...')
  await userStore.trackAuthChanges()

  if (userStore.user) {
    console.log('User is logged in:', userStore.user)
  } else {
    console.log('User is not logged in')
  }
})
</script>

<template>
  <MainLayout>
    <RouterView v-slot="{ Component, route }">
      <Suspense>
        <Component :is="Component" :key="route.name" />
        <template #fallback>
          <div class="flex h-screen items-center justify-center">
            <p class="text-gray-500">Loading...</p>
          </div>
        </template>
      </Suspense>
    </RouterView>
  </MainLayout>
</template>
