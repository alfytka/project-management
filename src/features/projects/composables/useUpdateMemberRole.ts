import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { toast } from 'vue-sonner'
import { updateMemberRole } from '../api'
import type { MemberRole } from '../types'

export function useUpdateMemberRole(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: MemberRole }) =>
      updateMemberRole(toValue(projectId), userId, role),
    onSuccess: () => {
      toast.success('Role member diperbarui')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
