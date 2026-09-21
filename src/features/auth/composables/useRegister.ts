import { useMutation } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { register } from '../api'

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Registrasi berhasil, silakan masuk')
      router.push({ name: 'login' })
    },
  })
}
