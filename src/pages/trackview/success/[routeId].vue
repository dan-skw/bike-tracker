<script setup lang="ts">
import { ref } from 'vue'
import { useRouteStore } from '@/stores/route'
import { useCamera } from '@/utils/useCamera'
import { toast } from 'vue-sonner'

const routeStore = useRouteStore()
const routeId = routeStore.latestRouteId ? routeStore.getLatestRouteId() : window.location.pathname
    .split('/').pop()

const { uploadPhoto } = useCamera() ?? {}

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const imgUploading = ref(false)
const imgLoaded = ref(false)

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        file.value = target.files[0]
        previewUrl.value = URL.createObjectURL(file.value)
        imgLoaded.value = true
    }
}


const handleUpload = async () => {
    imgUploading.value = true
    if (file.value) {
        try {
            await uploadPhoto(file.value, routeId as string)
            toast('Zdjęcie zostało zapisane pomyślnie!', {
                description: 'Zobaczysz je w podsumowaniu trasy.'
            })
            imgUploading.value = false
        } catch (err) {
            toast('Wystąpił błąd podczas przesyłania zdjęcia.', {
                description: 'Spróbuj ponownie później.'
            })
            console.error('Error uploading photo:', err)
        }
    }
}

const triggerFile = () => {
    fileInput.value?.click()
}
</script>

<template>
    <div class="flex flex-col items-end h-screen">
        <RouterLink to="/" class="font-semibold text-lg">Pomiń</RouterLink>
        <div class="flex flex-col items-center justify-center h-full w-full">
            <div class="text-8xl p-2">🥳</div>
            <h1 class="text-2xl font-bold">Sukces!</h1>
            <p class="text-sm">Twoja trasa została pomyślnie zapisana.</p>
            <p class="text-lg mt-2 text-center">Dodaj zdjęcie, aby uwiecznić swoją podróż.</p>

            <div class="mt-4 text-center w-full">
                <div v-if="!imgLoaded"
                    class="border-2 p-4 rounded-lg border-dashed border-muted-foreground/20 bg-white">
                    <Button class="rounded-full h-15 w-15" variant="secondary" @click="triggerFile">
                        <iconify-icon icon="lucide:camera" width="20" class=""></iconify-icon>
                    </Button>
                    <h4>Naciśnij aby dodać zdjęcie</h4>
                    <p class="text-xs text-muted-foreground mt-2">Wybierz zdjęcie z aparatu lub galerii.</p>
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                </div>


                <div v-else class="relative rounded-lg">
                    <div class="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div v-if="imgUploading" class="bg-white p-4 rounded shadow text-center">
                            <iconify-icon icon="lucide:loader-2" class="animate-spin mb-2" width="50"></iconify-icon>
                            <p class="text-lg text-gray-700">Przesyłanie zdjęcia...</p>
                            <p class="text-sm text-muted-foreground mt-1">Proszę czekać...</p>
                        </div>
                    </div>

                    <div v-if="previewUrl" class="mt-4">
                        <img :src="previewUrl" alt="Podgląd zdjęcia" class="max-w-full rounded"
                            :class="imgUploading ? 'animate-pulse' : ''" />
                        <p class="text-center text-sm mt-2">{{ file?.name }}</p>
                    </div>
                </div>



                <div v-if="file" class="mt-4">
                    <p class="text-sm text-muted mt-2">{{ file.name }}</p>
                    <Button class="mt-4" @click="handleUpload">
                        Zapisz zdjęcie
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
