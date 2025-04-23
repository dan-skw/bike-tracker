import { getDownloadURL, listAll, ref as storageRef } from 'firebase/storage'
import { storage } from '@/firebase/initFirebase'

export const getPhotoByRouteId = async (
  userId: string,
  routeId: string,
): Promise<string | null> => {
  try {
    const dirRef = storageRef(storage, `routes-photos/${userId}/${routeId}`)
    const result = await listAll(dirRef)

    if (result.items.length === 0) return null
    const photo = result.items[0]
    const url = await getDownloadURL(photo)

    return url
  } catch (error) {
    console.error('Nie udało się pobrać zdjęcia: ', error)
    return null
  }
}
