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
    router.push('/trackview')
  } else {
    console.error('Login failed:', error.value)
  }
}
</script>

<template>
  <section class="h-full flex flex-col items-center justify-center px-6 py-12 bg-[#F2F0EF] space-y-6">
    <div class="text-center space-y-1">
      <h1 class="scroll-m-20 text-3xl font-semibold tracking-tight">Logowanie</h1>
      <p class="text-sm text-muted-foreground">Zaloguj się, aby kontynuować</p>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4">
      <Input v-model="email" type="email" placeholder="Email" />
      <Input v-model="password" type="password" placeholder="Hasło" />

      <Button class="w-full" @click="handleLogin">Zaloguj się</Button>
      <Separator />
      <Button variant="outline" class="w-full" @click="loginWithGoogle">
        Zaloguj się przez Google
      </Button>

      <p v-if="error" class="text-center text-sm text-red-500">{{ error }}</p>
    </div>

    <RouterLink to="/signup" class="text-sm text-muted-foreground hover:underline mt-2">
      Nie masz konta? Zarejestruj się
    </RouterLink>
  </section>
</template>
