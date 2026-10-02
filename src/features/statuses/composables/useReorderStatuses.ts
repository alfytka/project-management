import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { reorderStatuses } from '../api'
import type { Status } from '../types'

/** Kirim urutan baru (array id) — optimistic, rollback bila gagal. */
export function useReorderStatuses(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const queryKey = computed(() => ['statuses', { projectId: toValue(projectId) }])

  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      reorderStatuses(toValue(projectId), {
        statuses: orderedIds.map((id, index) => ({ id, order: index + 1 })),
      }),
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: queryKey.value })
      const previous = queryClient.getQueryData<Status[]>(queryKey.value)
      if (previous) {
        const byId = new Map(previous.map((status) => [status.id, status]))
        queryClient.setQueryData(
          queryKey.value,
          orderedIds.map((id, index) => ({ ...byId.get(id)!, order: index + 1 })),
        )
      }
      return { previous }
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey.value, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['statuses'] }),
  })
}
