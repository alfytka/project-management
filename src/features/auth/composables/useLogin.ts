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
      authStore.setSession(data.access_token, data.user)
      toast.success('Berhasil masuk')

      // Hanya terima path internal ("/projects/..."), bukan URL lain ("//evil.com").
      const redirect = route.query.redirect
      const isInternal = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
      router.push(isInternal ? redirect : '/')
    },
  })
}
