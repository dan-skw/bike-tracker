// src/auth/useAuth.ts
import { ref } from 'vue'
import { auth } from '@/firebase/initFirebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { useUserStore } from '@/stores/user'

const error = ref<string | null>(null)

const register = async (email: string, password: string) => {
  error.value = null
  const userStore = useUserStore()
  try {
    const credentials = await createUserWithEmailAndPassword(auth, email, password)
    userStore.setUser(credentials.user)
    userStore.saveSession(credentials.user) // lokalne przechowanie sesji
  } catch (err: any) {
    error.value = err.message
  }
}

const login = async (email: string, password: string) => {
  error.value = null
  const userStore = useUserStore()
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password)
    userStore.setUser(credentials.user)
    userStore.saveSession(credentials.user)
  } catch (err: any) {
    error.value = err.message
  }
}

const loginWithGoogle = async () => {
  error.value = null
  const userStore = useUserStore()
  const provider = new GoogleAuthProvider()
  try {
    const credentials = await signInWithPopup(auth, provider)
    userStore.setUser(credentials.user)
    userStore.saveSession(credentials.user)
  } catch (err: any) {
    error.value = err.message
  }
}

export function useAuth() {
  return {
    register,
    login,
    loginWithGoogle,
    error,
  }
}
