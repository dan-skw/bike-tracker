import { db } from '@/firebase/initFirebase'
import { doc, getDoc, increment, runTransaction } from 'firebase/firestore'

export const useUserStats = () => {
  const updateStatsAfterRouteSave = async (
    userId: string,
    distanceKm: number,
    durationSeconds: number,
  ) => {
    const statsRef = doc(db, 'users-misc', userId, 'stats', 'stats')

    await runTransaction(db, async (transaction) => {
      const statsDoc = await transaction.get(statsRef)

      if (!statsDoc.exists()) {
        transaction.set(statsRef, {
          totalDistanceKm: distanceKm / 1000,
          totalDurationSeconds: durationSeconds,
          totalRoutes: 1,
          lastUpdated: new Date(),
        })
      } else {
        transaction.update(statsRef, {
          totalDistanceKm: increment(distanceKm / 1000),
          totalDurationSeconds: increment(durationSeconds),
          totalRoutes: increment(1),
          lastUpdated: new Date(),
        })
      }
    })
  }

  const getUserStats = async (userId: string) => {
    const statsRef = doc(db, 'users-misc', userId, 'stats', 'stats')
    const statsSnap = await getDoc(statsRef)
    if (!statsSnap.exists()) return null
    console.log('getUserStats', statsSnap.data())
    return statsSnap.data()
  }

  return {
    updateStatsAfterRouteSave,
    getUserStats,
  }
}
