import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { toast } from 'vue-sonner'
import { addMember } from '../api'
import type { MemberAdd } from '../types'

export function useAddMember(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MemberAdd) => addMember(toValue(projectId), payload),
    onSuccess: () => {
      toast.success('Member berhasil ditambahkan')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
