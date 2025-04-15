// src/composables/useRides.ts
import { db } from '@/firebase/initFirebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'

export const useRoutes = () => {
  const userStore = useUserStore()

  const getUserRoutes = async () => {
    if (!userStore.user) return []
    const userEntriesRef = collection(db, 'routes', userStore.user.uid, 'entries')
    const snapshot = await getDocs(userEntriesRef)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }

  const getRouteById = async (rideId: string) => {
    const rideRef = doc(db, 'rides', rideId)
    const rideSnap = await getDoc(rideRef)
    if (!rideSnap.exists()) return null
    return { id: rideSnap.id, ...rideSnap.data() }
  }

  return {
    getUserRoutes,
    getRouteById,
  }
}
