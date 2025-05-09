import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isLoggedIn
  console.log('isAuthenticated', isAuthenticated)
  const isPublicRoute = ['/login', '/signup'].includes(to.path)

  if (!isAuthenticated && !isPublicRoute) {
    return {
      path: '/login',
    }
  }
})
export default router
