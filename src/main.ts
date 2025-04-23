import './assets/index.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/images/marker-icon.png'
import 'iconify-icon'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { DataLoaderPlugin } from 'unplugin-vue-router/data-loaders'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(DataLoaderPlugin, { router })
app.use(router)

const userStore = useUserStore()
await userStore.trackAuthChanges()

app.mount('#app')
