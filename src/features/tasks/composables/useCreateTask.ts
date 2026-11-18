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

/**
 * Buat task lalu assign member satu per satu (backend memisahkan endpoint assignee).
 *
 * Begitu task terbuat, mutasi dianggap berhasil walau sebagian assign gagal: kalau dilaporkan
 * sebagai gagal, form tetap terbuka dan user yang mengirim ulang akan membuat task ganda.
 * Assign yang gagal cukup diberitahukan supaya bisa diulang dari detail task.
 */
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ epicId, payload, assigneeIds }: CreateTaskVariables) => {
      const task = await createTask(epicId, payload)
      let failedAssignees = 0
      for (const userId of assigneeIds) {
        try {
          await assignTask(task.id, userId)
        } catch {
          failedAssignees++
        }
      }
      return { task, failedAssignees }
    },
    onSuccess: ({ failedAssignees }) => {
      if (failedAssignees) {
        toast.warning(`Task berhasil dibuat, tapi ${failedAssignees} assignee gagal ditambahkan`, {
          description: 'Tambahkan lagi lewat detail task.',
        })
      } else {
        toast.success('Task berhasil dibuat')
      }
    },
    onSettled: () => invalidateTaskDependents(queryClient),
  })
}
