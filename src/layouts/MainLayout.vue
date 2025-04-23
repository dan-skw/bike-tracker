<template>
  <div class="flex h-screen flex-col overflow-hidden bg-[#F2F0EF] ">
    <div class="flex flex-1">
      <main class="flex-1 overflow-auto p-8 pb-20">
        <slot />
      </main>
    </div>
    <!-- <BottomNavbar v-if="userStore.isLoggedIn" /> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  userStore.trackAuthChanges()
  userStore.getSession()
})
</script>