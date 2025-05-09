// src/auth/useAuth.ts
import { ref } from 'vue'
import { auth, db } from '@/firebase/initFirebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { useUserStore } from '@/stores/user'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useStatsStore } from '@/stores/stats'
import type { UserStats } from '@/types/UserStats'

const error = ref<string | null>(null)

const register = async (email: string, password: string) => {
  error.value = null
  const userStore = useUserStore()
  try {
    const credentials = await createUserWithEmailAndPassword(auth, email, password)
    userStore.setUser(credentials.user)
    userStore.saveSession(credentials.user)
  } catch (err) {
    error.value = (err as Error).message
  }
}

const login = async (email: string, password: string) => {
  error.value = null
  const userStore = useUserStore()
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password)
    userStore.setUser(credentials.user)
    userStore.saveSession(credentials.user)
    userStore.setProfile(
      credentials.user.displayName || 'Rowerzysta',
      credentials.user.photoURL || null,
      credentials.user.email || null,
      credentials.user.uid,
      credentials.user.metadata.creationTime
        ? new Date(credentials.user.metadata.creationTime)
        : new Date(),
    )
    const statsStore = useStatsStore()
    const statsRef = doc(db, 'users-misc', credentials.user.uid, 'stats', 'stats')
    const statsSnap = await getDoc(statsRef)
    if (!statsSnap.exists()) {
      const defaultStats: UserStats = {
        totalDistanceKm: 0,
        totalDistanceMeters: 0,
        totalDurationSeconds: 0,
        totalRoutes: 0,
        lastUpdated: new Date(),
      }
      await setDoc(statsRef, defaultStats)
      statsStore.setStats(defaultStats)
    } else {
      statsStore.setStats(statsSnap.data() as UserStats)
    }
  } catch (err) {
    error.value = (err as Error).message
  }
}

const loginWithGoogle = async () => {
  error.value = null
  const userStore = useUserStore()
  const provider = new GoogleAuthProvider()
  try {
    const credentials = await signInWithPopup(auth, provider)

    const statsRef = doc(db, 'users-misc', credentials.user.uid, 'stats', 'stats')
    const statsSnap = await getDoc(statsRef)
    if (!statsSnap.exists()) {
      await setDoc(statsRef, {
        totalDistanceKm: 0,
        totalDistanceMeters: 0,
        totalDurationSeconds: 0,
        totalRoutes: 0,
        lastUpdated: new Date(),
      })
    }

    userStore.setUser(credentials.user)
    userStore.saveSession(credentials.user)
    userStore.setProfile(
      credentials.user.displayName || 'Rowerzysta',
      credentials.user.photoURL || null,
      credentials.user.email || null,
      credentials.user.uid,
      credentials.user.metadata.creationTime
        ? new Date(credentials.user.metadata.creationTime)
        : new Date(),
    )
  } catch (err) {
    error.value = (err as Error).message
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
