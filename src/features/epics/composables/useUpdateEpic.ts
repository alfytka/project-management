import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { updateEpic } from '../api'
import type { EpicUpdate } from '../types'

export function useUpdateEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: EpicUpdate }) => updateEpic(id, payload),
    onSuccess: () => {
      toast.success('Module berhasil diperbarui')
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['epics'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })
}
