<template>
  <div class="flex h-screen flex-col">
    <!-- Navbar -->
    <header class="flex items-center justify-between bg-blue-600 px-4 py-2 text-white">
      <div class="flex items-center gap-4">
        <button class="lg:hidden" @click="toggleSidebar">
          <MenuIcon class="h-6 w-6" />
        </button>
        <iconify-icon icon="mdi:bike" class="h-8 w-8" />
        <span class="text-lg font-bold">Bike Tracker</span>
      </div>
    </header>

    <!-- Main content -->
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside
        :class="[
          'z-10 bg-gray-100 p-4 shadow-md transition-transform duration-300 lg:w-64 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
        class="fixed inset-y-0 z-40 w-64 lg:static"
      >
        <nav class="flex flex-col gap-2">
          <RouterLink
            v-if="userStore.isLoggedIn"
            to="/trackview"
            class="rounded px-3 py-2 hover:bg-blue-100"
          >
            Track View
          </RouterLink>

          <button
            v-if="userStore.isLoggedIn"
            class="rounded px-3 py-2 text-left text-red-600 hover:bg-red-100"
            @click="signOut"
          >
            Sign Out
          </button>

          <RouterLink v-else to="/login" class="rounded px-3 py-2 hover:bg-blue-100">
            Zaloguj się
          </RouterLink>

          <RouterLink to="/signup" class="rounded px-3 py-2 hover:bg-blue-100">
            Zarejestruj się
          </RouterLink>
        </nav>
      </aside>

      <!-- Router View -->
      <main class="flex-1 overflow-auto p-4 lg:ml-64" @click="sidebarOpen = false">
        <RouterView />
      </main>
    </div>

    <!-- Footer -->
    <footer v-if="userStore.isLoggedIn" class="bg-gray-200 p-4 text-center text-sm text-gray-700">
      id: {{ userStore.user?.uid }}
    </footer>

    <footer v-else class="bg-gray-200 p-4 text-center text-sm text-gray-700">Polo Rider</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/initFirebase'
import { MenuIcon } from 'lucide-vue-next'

const sidebarOpen = ref(false)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const userStore = useUserStore()
const router = useRouter()

onMounted(() => {
  userStore.trackAuthChanges()
  userStore.getSession()
})

const signOut = async () => {
  await auth.signOut()
  userStore.endSession()
  router.push('/login')
}
</script>

<style scoped>
@media (min-width: 1024px) {
  aside {
    transform: none !important;
  }
}
</style>
