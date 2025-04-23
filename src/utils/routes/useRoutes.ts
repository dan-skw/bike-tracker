// src/composables/useRides.ts
import { db } from '@/firebase/initFirebase'
import { collection, getDocs, doc, getDoc, Timestamp, addDoc } from 'firebase/firestore'
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

  const saveRoute = async (
    path: [number, number][],
    distanceKm: number,
    durationSeconds: number,
    location: {
      city: string
      state: string
      road?: string
    },
  ) => {
    const userStore = useUserStore()

    const user = userStore.user
    console.log('user', user)

    if (!user) throw new Error('Użytkownik nie jest zalogowany.')

    const convertedPath = path.map(([lat, lng]) => ({ lat, lng }))

    const userRoutesRef = collection(db, 'routes', user.uid, 'entries')

    const docRef = await addDoc(userRoutesRef, {
      path: convertedPath,
      distanceKm,
      durationSeconds,
      location: {
        city: location.city,
        state: location.state,
        road: location.road,
      },
      createdAt: Timestamp.now(),
    })

    return docRef.id
  }

  const getLastSavedRoute = async () => {
    if (!userStore.user) return null
    const routesRef = collection(db, 'routes', userStore.user.uid, 'entries')
    const snapshot = await getDocs(routesRef)
    if (!snapshot.empty) {
      const newestRoute = snapshot.docs.reduce((prev, current) => {
        return prev.data().createdAt > current.data().createdAt ? prev : current
      })

      return {
        id: newestRoute.id,
        ...newestRoute.data(),
      } as RouteEntry
    }

    return null
  }

  return {
    getUserRoutes,
    getRouteById,
    saveRoute,
    getLastSavedRoute,
  }
}
