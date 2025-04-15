<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { storage, db } from '@/firebase/initFirebase'
import { ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

const userStore = useUserStore()

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const photoTaken = ref(false)
const imageUrl = ref('')
const loading = ref(false)

onMounted(async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  if (video.value) video.value.srcObject = stream
})

const takePhoto = () => {
  if (video.value && canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height)
    photoTaken.value = true
  }
}

const uploadPhoto = async () => {
  if (!canvas.value) return
  loading.value = true

  try {
    const dataUrl = canvas.value.toDataURL('image/jpeg')
    if (userStore.user === null) {
      throw new Error('Nie znaleziono użytkownika.')
    }
    const uid = userStore.user.uid
    const avatarRef = storageRef(storage, `avatars/${uid}.jpg`)

    await uploadString(avatarRef, dataUrl, 'data_url')
    const url = await getDownloadURL(avatarRef)

    imageUrl.value = url

    const userDoc = doc(db, 'users', uid)
    await setDoc(userDoc, {
      id: uid,
      email: userStore.user.email,
      avatarUrl: url,
    })

    alert('Zapisano użytkownika i zdjęcie!')
  } catch (err) {
    console.error('Błąd przy uploadzie:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <video ref="video" autoplay class="h-48 w-64 rounded-md bg-black" />
    <canvas ref="canvas" width="256" height="192" class="hidden" />

    <button class="rounded bg-blue-500 px-4 py-2 text-white" @click="takePhoto">
      Zrób zdjęcie
    </button>

    <button
      v-if="photoTaken && !loading"
      class="rounded bg-green-500 px-4 py-2 text-white"
      @click="uploadPhoto"
    >
      Zapisz zdjęcie
    </button>

    <div v-if="loading">⏳ Przesyłanie zdjęcia...</div>

    <img v-if="imageUrl" :src="imageUrl" alt="Avatar" class="mt-4 h-32 w-32 rounded-full" />
  </div>
</template>
