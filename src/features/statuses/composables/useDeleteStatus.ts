import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { deleteStatus } from '../api'
import { invalidateStatusDependents } from './invalidate'

export function useDeleteStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStatus,
    onSuccess: () => {
      toast.success('Status berhasil dihapus')
      return invalidateStatusDependents(queryClient)
    },
  })
}
