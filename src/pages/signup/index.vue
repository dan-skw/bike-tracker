<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/auth/useAuth'

const router = useRouter()

const { register } = useAuth()

const email = ref('')
const password = ref('')
const username = ref('')

const signup = async () => {
  try {
    await register(email.value, password.value)

    router.push(`/signup/${username.value}`)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Hasło" />
    <input v-model="username" placeholder="Username" />
    <button @click="signup">Zarejestruj się</button>
  </div>
</template>
