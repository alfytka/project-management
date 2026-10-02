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
          component: () => import('@/features/projects/pages/ProjectDetailPage.vue'),
          children: [
            { path: '', name: 'project-detail', redirect: { name: 'project-overview' } },
            {
              path: 'overview',
              name: 'project-overview',
              component: () => import('@/features/projects/pages/tabs/ProjectOverviewTab.vue'),
              meta: { title: 'Overview' },
            },
            {
              // UI menyebut "Module"; resource backend tetap bernama epic.
              path: 'modules',
              name: 'project-epics',
              component: () => import('@/features/projects/pages/tabs/ProjectEpicsTab.vue'),
              meta: { title: 'Modules' },
            },
            // URL lama sebelum rename — tetap berfungsi untuk link yang sudah tersimpan.
            { path: 'epics', redirect: { name: 'project-epics' } },
            {
              path: 'tasks',
              name: 'project-tasks',
              component: () => import('@/features/projects/pages/tabs/ProjectTasksTab.vue'),
              meta: { title: 'Tasks' },
            },
            {
              path: 'members',
              name: 'project-members',
              component: () => import('@/features/projects/pages/tabs/ProjectMembersTab.vue'),
              meta: { title: 'Members' },
            },
            {
              path: 'settings',
              name: 'project-settings',
              component: () => import('@/features/projects/pages/tabs/ProjectSettingsTab.vue'),
              meta: { title: 'Pengaturan' },
            },
          ],
        },
        {
          // Sibling (bukan child) route project: halaman detail module tidak memakai header & tab project.
          path: 'projects/:id/modules/:epicId',
          name: 'epic-detail',
          component: () => import('@/features/epics/pages/EpicDetailPage.vue'),
          meta: { title: 'Module' },
        },
        { path: 'projects/:id/epics/:epicId', redirect: { name: 'epic-detail' } },
        {
          path: 'tasks',
          name: 'tasks',
          component: () => import('@/pages/ComingSoonPage.vue'),
          props: { title: 'Tugas Saya' },
          meta: { title: 'Tugas Saya' },
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('@/pages/ComingSoonPage.vue'),
          props: { title: 'Notifikasi' },
          meta: { title: 'Notifikasi' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/ComingSoonPage.vue'),
          props: { title: 'Pengaturan' },
          meta: { title: 'Pengaturan' },
        },
      ],
    },
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
