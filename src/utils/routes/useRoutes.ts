// src/composables/useRides.ts
import { db } from '@/firebase/initFirebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { RouteEntry } from '@/types/RouteEntry'

export const useRoutes = () => {
  const userStore = useUserStore()

  const getUserRoutes = async () => {
    if (!userStore.user) return []
    const userEntriesRef = collection(db, 'routes', userStore.user.uid, 'entries')
    const snapshot = await getDocs(userEntriesRef)
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as RouteEntry,
    )
  }

  const getRouteById = async (routeId: string) => {
    if (!userStore.user) return null
    const routeRef = doc(db, 'routes', userStore.user.uid, 'entries', routeId)
    const routeSnap = await getDoc(routeRef)
    if (!routeSnap.exists()) return null
    return { id: routeRef.id, ...routeSnap.data() }
  }

  return {
    getUserRoutes,
    getRouteById,
  }
}
