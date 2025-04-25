import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { onAuthStateChanged, getAuth, type User } from 'firebase/auth'
import { auth } from '@/firebase/initFirebase'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isTrackingAuthChanges = ref(false)


  const setUser = (firebaseUser: User | null) => {
    user.value = firebaseUser
  }

  const clearUser = () => {
    user.value = null
  }

  const trackAuthChanges = () => {
    return new Promise<void>((resolve) => {
      if (isTrackingAuthChanges.value) return resolve()

      isTrackingAuthChanges.value = true

      onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser)
        resolve()
      })
    })
  }

  const getSession = () => {
    const currentUser = getAuth().currentUser
    setUser(currentUser)
  }
  const saveSession = (user: User) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }

  const endSession = () => {
    localStorage.removeItem('user')
    clearUser()
  }

  const isLoggedIn = computed(() => !!user.value)

  return {
    user,
    setUser,
    clearUser,
    isLoggedIn,
    trackAuthChanges,
    getSession,
    saveSession,
    endSession,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
