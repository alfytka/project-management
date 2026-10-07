import type { QueryClient } from '@tanstack/vue-query'

/** Status memengaruhi kolom board, badge task, progress epic (`is_done`), dan dashboard. */
export function invalidateStatusDependents(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['statuses'] }),
    queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    queryClient.invalidateQueries({ queryKey: ['epics'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
  ])
}
