<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/auth/useAuth'

const router = useRouter()

const { register } = useAuth()

const email = ref('')
const password = ref('')

const signup = async () => {
  try {
    await register(email.value, password.value)
    router.push(`/signup/${email.value}`)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-6 bg-gray-50 p-4">
    <h1 class="text-center text-2xl font-semibold">Rejestracja</h1>
    <p class="text-center text-sm text-gray-500">Utwórz nowe konto</p>
    <Input v-model="email" placeholder="Email" />
    <Input v-model="password" type="password" placeholder="Hasło" />
    <Button @click="signup">Zarejestruj się</Button>
  </div>
</template>
