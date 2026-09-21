import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { updateProject } from '../api'
import type { ProjectUpdate } from '../types'

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProjectUpdate }) =>
      updateProject(id, payload),
    onSuccess: () => {
      toast.success('Project berhasil diperbarui')
      return queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
