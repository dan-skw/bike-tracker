import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { onAuthStateChanged, getAuth, type User, signOut } from 'firebase/auth'
import { auth } from '@/firebase/initFirebase'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase/initFirebase'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const profile = ref<{
    displayName: string
    photoURL: string | null
    email: string | null
    uid: string
    createdAt: Date | Timestamp
  } | null>()
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
    signOut(auth)
    localStorage.removeItem('user')
    isTrackingAuthChanges.value = false
    clearUser()
  }

  const setProfile = (
    displayName: string,
    photoURL: string | null,
    email: string | null,
    uid: string,
    createdAt: Date | Timestamp,
  ) => {
    profile.value = {
      displayName,
      photoURL,
      email,
      uid,
      createdAt: createdAt || new Date(),
    }
  }

  const loadProfile = async () => {
    const currentUser = getAuth().currentUser
    if (!currentUser) return

    const docRef = doc(db, 'users-profiles', currentUser.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const profileData = docSnap.data()
      setProfile(
        profileData.displayName || 'Użytkownik',
        profileData.photoUrl || null,
        profileData.email || null,
        profileData.uid || currentUser.uid,
        profileData.createdAt || new Date(),
      )
    } else {
      console.warn('Profil użytkownika nie istnieje w Firestore.')
    }
  }

  const clearProfile = () => {
    profile.value = null
  }

  const isLoggedIn = computed(() => !!user.value)

  return {
    user,
    profile,
    setUser,
    setProfile,
    loadProfile,
    clearProfile,
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
