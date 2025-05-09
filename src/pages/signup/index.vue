<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../auth/useAuth'
import { createUserProfile } from '@/utils/auth/createUserProfile'
import { auth } from '@/firebase/initFirebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router'

const router = useRouter()
const { register, error: authError } = useAuth()

const email = ref('')
const password = ref('')
const displayName = ref('')
const avatarFile = ref<File | null>(null)
const isLoading = ref(false)
const formError = ref<string | null>(null)

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    avatarFile.value = target.files[0]
  } else {
    avatarFile.value = null
  }
}

const signup = async () => {
  isLoading.value = true
  formError.value = null
  authError.value = null

  if (!email.value || !password.value || !displayName.value) {
    formError.value = 'Wszystkie pola (oprócz awatara) są wymagane.'
    isLoading.value = false
    return
  }

  try {
    await register(email.value, password.value)

    if (authError.value) {
      throw new Error(authError.value)
    }

    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Nie udało się pobrać danych użytkownika po rejestracji.')
    }

    await createUserProfile(currentUser, displayName.value, avatarFile.value ?? undefined).then(() => {
      router.push('/dashboard')
    }).catch((error) => {
      throw new Error(error.message)
    })


  } catch (err) {
    console.error('Błąd rejestracji:', err)
    formError.value = (err as Error).message || 'Wystąpił nieoczekiwany błąd podczas rejestracji.'
  } finally {
    isLoading.value = false
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
      <!-- Display Form Error -->
      <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

      <div class="space-y-1">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" placeholder="twoj@email.com" type="email" required />
      </div>
      <div class="space-y-1">
        <Label for="displayName">Nazwa wyświetlana</Label>
        <Input id="displayName" v-model="displayName" placeholder="Rowerzysta XYZ" required />
      </div>
      <div class="space-y-1">
        <Label for="password">Hasło</Label>
        <Input id="password" v-model="password" type="password" placeholder="••••••••" required />
      </div>
      <div class="space-y-1">
        <Label for="avatar">Awatar (opcjonalnie)</Label>
        <Input id="avatar" type="file" accept="image/*" @change="handleFileChange" />
        <p v-if="avatarFile" class="text-xs text-muted-foreground mt-1">Wybrano: {{ avatarFile.name }}</p>
      </div>

      <Button class="w-full" @click="signup" :disabled="isLoading">
        {{ isLoading ? 'Rejestrowanie...' : 'Zarejestruj się' }}
      </Button>
    </div>

    <RouterLink to="/login" class="text-sm text-muted-foreground hover:underline mt-2">
      Masz już konto? Zaloguj się
    </RouterLink>
  </section>
</template>