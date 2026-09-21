import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { guestOnly: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/features/auth/pages/LoginPage.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/features/auth/pages/RegisterPage.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'projects',
          name: 'projects',
          component: () => import('@/features/projects/pages/ProjectsPage.vue'),
          meta: { title: 'Projects' },
        },
        {
          path: 'projects/:id',
          name: 'project-detail',
          component: () => import('@/features/projects/pages/ProjectDetailPage.vue'),
          meta: { title: 'Detail Project' },
        },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('@/pages/ComingSoonPage.vue'),
          props: { title: 'Tasks' },
          meta: { title: 'Tasks' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/ComingSoonPage.vue'),
          props: { title: 'Settings' },
          meta: { title: 'Settings' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
