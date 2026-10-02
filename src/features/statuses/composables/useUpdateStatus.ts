import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateStatus } from '../api'
import type { StatusUpdate } from '../types'
import { invalidateStatusDependents } from './invalidate'

export function useUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: StatusUpdate }) => updateStatus(id, payload),
    onSuccess: () => invalidateStatusDependents(queryClient),
  })
}
