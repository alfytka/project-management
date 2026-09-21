import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { addMember } from '../api'
import type { MemberAdd } from '../types'

export function useAddMember(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: MemberAdd) => addMember(projectId, payload),
    onSuccess: () => {
      toast.success('Member berhasil ditambahkan')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
