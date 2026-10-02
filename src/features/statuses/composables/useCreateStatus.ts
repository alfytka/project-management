import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { toast } from 'vue-sonner'
import { createStatus } from '../api'
import type { StatusCreate } from '../types'
import { invalidateStatusDependents } from './invalidate'

export function useCreateStatus(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: StatusCreate) => createStatus(toValue(projectId), payload),
    onSuccess: () => {
      toast.success('Status berhasil ditambahkan')
      return invalidateStatusDependents(queryClient)
    },
  })
}
