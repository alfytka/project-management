import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { createProject } from '../api'

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success('Project berhasil dibuat')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
