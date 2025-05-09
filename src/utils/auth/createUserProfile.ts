import { db } from '@/firebase/initFirebase'
import { doc, setDoc } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import { useCamera } from '@/utils/camera/useCamera'
import type { User } from 'firebase/auth'
const { uploadPhoto } = useCamera()

export const createUserProfile = async (user: User, displayName: string, avatarFile?: File) => {
  const userStore = useUserStore()
  if (!user || !user.uid) {
    console.error('createUserProfile: Invalid user object provided.')
    throw new Error('Cannot create profile for invalid user.')
  }
  if (!userStore.user) {
    console.error('createUserProfile: User store is not available.')
    throw new Error('User store is not available.')
  }
  const userProfilesRef = doc(db, 'users-profiles', userStore.user.uid)

  let photoUrl: string | null = user.photoURL || null

  if (avatarFile) {
    try {
      const downloadUrl = await uploadPhoto(avatarFile, 'user-avatars', user.uid)
      photoUrl = downloadUrl
    } catch (err) {
      console.error('Nie udało się zapisać zdjęcia profilowego: ', err)
      throw new Error('Error uploading avatar')
    }
  }

  const userProfile = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Rowerzysta',
    photoUrl: photoUrl,
    createdAt: new Date(),
    lastLogin: new Date(),
  }

  try {
    await setDoc(userProfilesRef, userProfile)
    userStore.setUser(user)
    userStore.saveSession(user)
    userStore.setProfile(user.displayName || 'Rowerzysta', photoUrl, user.email, user.uid)
  } catch (err) {
    console.error('Error creating user profile:', err)
    throw new Error('Error creating user profile')
  }
}
