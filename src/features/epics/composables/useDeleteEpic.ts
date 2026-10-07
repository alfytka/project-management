import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { deleteEpic } from '../api'

export function useDeleteEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEpic,
    onSuccess: (_data, id) => {
      toast.success('Module berhasil dihapus')
      queryClient.removeQueries({ queryKey: ['epics', 'detail', id] })
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['epics'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })
}
