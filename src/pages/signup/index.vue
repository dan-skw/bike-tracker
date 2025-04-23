<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../auth/useAuth'

const { register } = useAuth()

const email = ref('')
const password = ref('')

const signup = async () => {
  try {
    await register(email.value, password.value)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <section class="h-full flex flex-col items-center justify-center px-6 py-12 bg-[#F2F0EF] space-y-6">
    <div class="text-center space-y-1">
      <h1 class="scroll-m-20 text-3xl font-semibold tracking-tight">Rejestracja</h1>
      <p class="text-sm text-muted-foreground">Utwórz nowe konto, aby rozpocząć.</p>
    </div>

    <div class="bg-white rounded-xl shadow-md p-6 w-full max-w-sm space-y-4">
      <Input v-model="email" placeholder="Email" />
      <Input v-model="password" type="password" placeholder="Hasło" />
      <Button class="w-full" @click="signup">Zarejestruj się</Button>
    </div>

    <RouterLink to="/login" class="text-sm text-muted-foreground hover:underline mt-2">
      Masz już konto? Zaloguj się
    </RouterLink>
  </section>
</template>
