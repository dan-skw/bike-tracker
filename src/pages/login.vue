<script setup>
import { ref } from 'vue'
import { useAuth } from '@/auth/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const email = ref('')
const password = ref('')
const { login, loginWithGoogle, error } = useAuth()

const handleLogin = async () => {
  await login(email.value, password.value)
  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
      <h1 class="text-center text-2xl font-semibold">Logowanie</h1>

      <Input v-model="email" type="email" placeholder="Email" />
      <Input v-model="password" type="password" placeholder="Hasło" />

      <Button class="w-full" @click="handleLogin">Zaloguj się</Button>
      <Button variant="outline" class="w-full" @click="loginWithGoogle">
        Zaloguj się przez Google
      </Button>

      <p v-if="error" class="text-center text-sm text-red-500">{{ error }}</p>
    </div>
  </div>
</template>
