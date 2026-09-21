import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { deleteProject } from '../api'

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_data, id) => {
      toast.success('Project berhasil dihapus')
      queryClient.removeQueries({ queryKey: ['projects', id] })
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
