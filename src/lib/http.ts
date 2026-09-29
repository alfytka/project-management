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

      const router = await import('@/router')
      router.default.push({ name: 'login' })
    }
    return Promise.reject(error)
  },
)
