import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { UserResponse } from '@/features/auth/types'
import { queryClient } from '@/lib/query-client'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useStorage<string | null>('pm_access_token', null)
  const user = useStorage<UserResponse | null>('pm_user', null, undefined, {
    serializer: {
      read: (raw) => {
        try {
          return raw ? (JSON.parse(raw) as UserResponse) : null
        } catch {
          return null
        }
      },
      write: (value) => JSON.stringify(value),
    },
  })

  const isAuthenticated = computed(() => !!accessToken.value)

  function setSession(token: string, sessionUser: UserResponse) {
    accessToken.value = token
    user.value = sessionUser
  }

  function setUser(sessionUser: UserResponse) {
    user.value = sessionUser
  }

  function logout() {
    accessToken.value = null
    user.value = null
    // Buang cache server state supaya data user sebelumnya tidak terlihat oleh sesi berikutnya.
    queryClient.clear()
  }

  return { accessToken, user, isAuthenticated, setSession, setUser, logout }
})
