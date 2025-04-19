import { storage } from '@/firebase/initFirebase'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useUserStore } from '@/stores/user'
import { format } from 'date-fns'

export function useCamera() {
  const userStore = useUserStore()
  if (!userStore.user) return
  const userId = userStore.user.uid

  const uploadPhoto = async (file: File, routeId: string): Promise<string> => {
    const now = new Date()
    const formattedDate = format(now, 'yyyy-MM-dd-HH-mm-ss')
    const fileName = `${routeId}-${formattedDate}.jpg`

    const routesRef = storageRef(storage, `routes-photos/${userId}/${fileName}`)
    const metadata = {
      contentType: file.type || 'image/jpeg',
    }
    const uploadTask = uploadBytesResumable(routesRef, file, metadata)

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadUrl)
        },
      )
    })
  }

  return {
    uploadPhoto,
  }
}
