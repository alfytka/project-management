import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { assignTask, createTask } from '../api'
import { invalidateTaskDependents } from '../lib/cache'
import type { TaskCreate } from '../types'

interface CreateTaskVariables {
  epicId: string
  payload: TaskCreate
  assigneeIds: string[]
}

/** Buat task lalu assign member satu per satu (backend memisahkan endpoint assignee). */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ epicId, payload, assigneeIds }: CreateTaskVariables) => {
      const task = await createTask(epicId, payload)
      for (const userId of assigneeIds) await assignTask(task.id, userId)
      return task
    },
    onSuccess: () => {
      toast.success('Task berhasil dibuat')
    },
    // Task bisa sudah terbuat walau assign gagal — tetap segarkan.
    onSettled: () => invalidateTaskDependents(queryClient),
  })
}
