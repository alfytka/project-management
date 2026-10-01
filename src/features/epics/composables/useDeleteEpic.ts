import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { deleteEpic } from '../api'

export function useDeleteEpic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteEpic,
    onSuccess: (_data, id) => {
      toast.success('Epic berhasil dihapus')
      queryClient.removeQueries({ queryKey: ['epics', id] })
      return queryClient.invalidateQueries({ queryKey: ['epics'] })
    },
  })
}