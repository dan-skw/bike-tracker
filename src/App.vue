<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import { useRouter } from 'vue-router'
const router = useRouter()

const userStore = useUserStore()

onMounted(async () => {
  const isUser = await userStore.trackAuthChanges()

  if (!isUser) {
    router.push('/login')
  } else {
    userStore.getSession()
  }
})
</script>

<template>
  <Toaster class="pointer-events-auto" />
  <MainLayout>
    <Suspense>
      <RouterView v-slot="{ Component, route }">
        <Component :is="Component" :key="route.name" />
      </RouterView>
      <template #fallback>
        <div class="flex h-screen items-center justify-center">
          <p class="text-gray-500">Loading...</p>
        </div>
      </template>
    </Suspense>
  </MainLayout>
</template>
