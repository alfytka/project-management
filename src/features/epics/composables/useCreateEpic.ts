import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { toast } from 'vue-sonner'
import { createEpic } from '../api'
import type { EpicCreate } from '../types'

export function useCreateEpic(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: EpicCreate) => createEpic(toValue(projectId), payload),
    onSuccess: () => {
      toast.success('Module berhasil dibuat')
      return queryClient.invalidateQueries({ queryKey: ['epics'] })
    },
  })
}
