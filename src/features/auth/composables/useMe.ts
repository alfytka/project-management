import { useQuery } from '@tanstack/vue-query'
import { computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getMe } from '../api'

/**
 * Sinkronkan data user di store dengan `/me`. User sudah didapat dari response login,
 * jadi ini hanya menyegarkan (mis. nama berubah) dan mengisi sesi lama yang belum
 * menyimpan data user.
 */
export function useMe() {
  const authStore = useAuthStore()

  const query = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 5 * 60 * 1000,
  })

  watch(query.data, (user) => {
    if (user) authStore.setUser(user)
  })

  return query
}
