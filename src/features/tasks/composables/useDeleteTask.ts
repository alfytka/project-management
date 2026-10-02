import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { deleteTask } from '../api'
import { invalidateTaskDependents } from '../lib/cache'

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_data, id) => {
      toast.success('Task berhasil dihapus')
      queryClient.removeQueries({ queryKey: ['tasks', 'detail', id] })
      return invalidateTaskDependents(queryClient)
    },
  })
}
