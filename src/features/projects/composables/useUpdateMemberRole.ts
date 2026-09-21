import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { updateMemberRole } from '../api'
import type { MemberRole } from '../types'

export function useUpdateMemberRole(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: MemberRole }) =>
      updateMemberRole(projectId, userId, role),
    onSuccess: () => {
      toast.success('Role member diperbarui')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
