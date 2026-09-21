import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { decodeJwt } from '@/lib/jwt'

interface SessionUser {
  email?: string
  name?: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useStorage<string | null>('pm_access_token', null)
  const user = ref<SessionUser | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  function setSession(token: string) {
    accessToken.value = token

    const claims = decodeJwt(token)
    const email = typeof claims?.sub === 'string' ? claims.sub : undefined
    user.value = email ? { email } : null
  }

  function logout() {
    accessToken.value = null
    user.value = null
  }

  return { accessToken, user, isAuthenticated, setSession, logout }
})
