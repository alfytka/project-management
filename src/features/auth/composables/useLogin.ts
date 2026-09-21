import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { login } from '../api'

export function useLogin() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      authStore.setSession(data.access_token)
      toast.success('Berhasil masuk')

      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.push(redirect)
    },
  })
}
