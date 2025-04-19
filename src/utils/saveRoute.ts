import { db } from '@/firebase/initFirebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'

export const saveRoute = async (
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
