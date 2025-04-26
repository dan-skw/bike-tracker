<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
import { Toaster } from '@/components/ui/sonner'

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
