import type { QueryClient } from '@tanstack/vue-query'
import type { Task } from '../types'

type TaskCache = Task | Task[] | undefined

/**
 * Terapkan perubahan ke task `id` di semua cache task (list per epic, list per project
 * berbagai filter, dan detail). Mengembalikan snapshot untuk rollback.
 */
export async function patchTaskCaches(queryClient: QueryClient, id: string, patch: (task: Task) => Task) {
  await queryClient.cancelQueries({ queryKey: ['tasks'] })
  const snapshot = queryClient.getQueriesData<TaskCache>({ queryKey: ['tasks'] })

  queryClient.setQueriesData<TaskCache>({ queryKey: ['tasks'] }, (data) => {
    if (Array.isArray(data)) return data.map((task) => (task.id === id ? patch(task) : task))
    if (data?.id === id) return patch(data)
    return data
  })

  return snapshot
}

export function restoreTaskCaches(queryClient: QueryClient, snapshot: ReturnType<QueryClient['getQueriesData']>) {
  for (const [key, data] of snapshot) queryClient.setQueryData(key, data)
}

/** Task memengaruhi progress & jumlah task di epic dan project. */
export function invalidateTaskDependents(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    queryClient.invalidateQueries({ queryKey: ['epics'] }),
  ])
}
