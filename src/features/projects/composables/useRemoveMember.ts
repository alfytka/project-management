import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { toast } from 'vue-sonner'
import { removeMember } from '../api'

export function useRemoveMember(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => removeMember(toValue(projectId), userId),
    onSuccess: () => {
      toast.success('Member dihapus dari project')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
