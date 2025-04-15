// saveRoute.ts
import { db } from '@/firebase/initFirebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'

export const saveRoute = async (
  path: [number, number][],
  distanceKm: number,
  durationSeconds: number,
) => {
  const userStore = useUserStore()

  const user = userStore.user
  console.log('user', user)

  if (!user) throw new Error('Użytkownik nie jest zalogowany.')

  // Firebase nie pozwala na zagnieżdżone tablice, zamieniamy na obiekty
  const convertedPath = path.map(([lat, lng]) => ({ lat, lng }))

  const userRoutesRef = collection(db, 'routes', user.uid, 'entries')

  await addDoc(userRoutesRef, {
    path: convertedPath,
    distanceKm,
    durationSeconds,
    createdAt: Timestamp.now(),
  })

  console.log('Route: ' + JSON.stringify(convertedPath), ' was saved to: ' + userRoutesRef.path)
}
