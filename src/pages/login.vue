<script setup>
import { ref } from 'vue'
import { useAuth } from '@/auth/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const { login, loginWithGoogle, error } = useAuth()

const handleLogin = async () => {
  await login(email.value, password.value)
  if (!error.value) {
    router.push('/dashboard')
  } else {
    console.error('Login failed:', error.value)
  }
}

const handleGoogleLogin = async () => {
  await loginWithGoogle()
  if (!error.value) {
    router.push('/dashboard')
  } else {
    console.error('Google login failed:', error.value)
  }
}
</script>

<template>
  <section class="h-full flex flex-col items-center justify-center px-6 py-12 bg-[#F2F0EF] space-y-6">
    <div class="text-center space-y-1 animate-fade-in">
      <div class="text-4xl">🔐</div>
      <h1 class="text-3xl font-bold">Zaloguj się</h1>
      <p class="text-sm text-gray-500">Dokończ trasę albo rozpocznij nową</p>
    </div>

    <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4 animate-fade-in">
      <Input v-model="email" type="email" placeholder="Twój email" />
      <Input v-model="password" type="password" placeholder="Hasło" />

      <Button class="w-full" @click="handleLogin">🚴 Zaloguj się</Button>

      <Separator />
      <Button variant="outline" class="w-full" @click="handleGoogleLogin">
        🔑 Zaloguj przez Google
      </Button>

      <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
    </div>

    <RouterLink to="/signup" class="text-sm text-muted-foreground hover:underline">
      Nie masz konta? Zarejestruj się
    </RouterLink>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
