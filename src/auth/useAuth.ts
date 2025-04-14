// src/auth/useAuth.ts

import { ref } from 'vue'
import { auth } from '@/firebase/initFirebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'

const error = ref<string | null>(null)

const register = async (email: string, password: string) => {
  error.value = null
  try {
    await createUserWithEmailAndPassword(auth, email, password)
  } catch (err: any) {
    error.value = err.message
  }
}

const login = async (email: string, password: string) => {
  error.value = null
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (err: any) {
    error.value = err.message
  }
}

const loginWithGoogle = async () => {
  error.value = null
  const provider = new GoogleAuthProvider()
  try {
    await signInWithPopup(auth, provider)
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
