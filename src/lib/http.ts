import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

http.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore()
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`)
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 dari /auth/* berarti kredensial salah, bukan sesi kedaluwarsa — biarkan form yang menangani.
    const isAuthRequest = String(error.config?.url ?? '').startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthRequest) {
      const authStore = useAuthStore()
      authStore.logout()

      // Simpan halaman yang sedang dibuka supaya setelah login ulang user kembali ke sana.
      // Beberapa request bisa 401 bersamaan; hanya redirect sekali (saat belum di halaman login).
      const { default: router } = await import('@/router')
      const current = router.currentRoute.value
      if (current.name !== 'login') {
        router.push({ name: 'login', query: current.meta.requiresAuth ? { redirect: current.fullPath } : {} })
      }
    }
    return Promise.reject(error)
  },
)
