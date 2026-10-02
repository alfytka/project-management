import type { QueryClient } from '@tanstack/vue-query'

/** Status memengaruhi kolom board, badge task, dan progress epic (`is_done`). */
export function invalidateStatusDependents(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['statuses'] }),
    queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    queryClient.invalidateQueries({ queryKey: ['epics'] }),
  ])
}
