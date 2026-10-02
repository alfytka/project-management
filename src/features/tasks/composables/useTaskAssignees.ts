import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { toErrorToast } from '@/lib/api-errors'
import { assignTask, unassignTask } from '../api'
import { invalidateTaskDependents, patchTaskCaches, restoreTaskCaches } from '../lib/cache'
import type { TaskAssignee } from '../types'

interface ToggleVariables {
  taskId: string
  member: TaskAssignee
  assigned: boolean
}

/** Assign / unassign satu member, optimistic di semua cache task. */
export function useToggleTaskAssignee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, member, assigned }: ToggleVariables) =>
      assigned ? assignTask(taskId, member.user_id) : unassignTask(taskId, member.user_id),
    onMutate: ({ taskId, member, assigned }) =>
      patchTaskCaches(queryClient, taskId, (task) => ({
        ...task,
        assignees: assigned
          ? [...task.assignees, member]
          : task.assignees.filter((assignee) => assignee.user_id !== member.user_id),
      })),
    onError: (error, _variables, snapshot) => {
      if (snapshot) restoreTaskCaches(queryClient, snapshot)
      toast.error(toErrorToast(error, 'Gagal mengubah assignee'))
    },
    onSettled: () => invalidateTaskDependents(queryClient),
  })
}
