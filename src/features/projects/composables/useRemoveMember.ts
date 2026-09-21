import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { removeMember } from '../api'

export function useRemoveMember(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => removeMember(projectId, userId),
    onSuccess: () => {
      toast.success('Member dihapus dari project')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
