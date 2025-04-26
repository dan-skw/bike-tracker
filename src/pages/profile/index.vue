<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleSignout = () => {
  userStore.endSession()
  router.push('/login')
}
</script>
<template>
  <div>
    <Button variant="primary" class="mb-4" @click="handleSignout">wyloguj</Button>
  </div>
</template>
