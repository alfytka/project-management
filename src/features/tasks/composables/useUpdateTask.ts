import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { toErrorToast } from '@/lib/api-errors'
import type { Status } from '@/features/statuses/types'
import { updateTask } from '../api'
import { invalidateTaskDependents, patchTaskCaches, restoreTaskCaches } from '../lib/cache'
import type { TaskUpdate } from '../types'

/** Update task dengan optimistic update di semua cache (board, list, detail); rollback + toast bila gagal. */
export function useUpdateTask() {
  const queryClient = useQueryClient()

  function findStatus(id: string) {
    for (const [, statuses] of queryClient.getQueriesData<Status[]>({ queryKey: ['statuses'] })) {
      const status = statuses?.find((item) => item.id === id)
      if (status) return status
    }
  }

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TaskUpdate }) => updateTask(id, payload),
    onMutate: ({ id, payload }) =>
      patchTaskCaches(queryClient, id, (task) => {
        const status = payload.status_id ? findStatus(payload.status_id) : undefined
        return {
          ...task,
          ...payload,
          description: payload.description ?? task.description,
          due_date: payload.due_date === undefined ? task.due_date : payload.due_date,
          ...(status && { status: { id: status.id, name: status.name, is_default: status.is_default } }),
        }
      }),
    onError: (error, _variables, snapshot) => {
      if (snapshot) restoreTaskCaches(queryClient, snapshot)
      toast.error(toErrorToast(error, 'Gagal memperbarui task, perubahan dibatalkan'))
    },
    onSettled: () => invalidateTaskDependents(queryClient),
  })
}
