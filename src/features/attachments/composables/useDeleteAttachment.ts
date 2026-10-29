import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { deleteAttachment } from '../api'

export function useDeleteAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      toast.success('Lampiran berhasil dihapus')
      return queryClient.invalidateQueries({ queryKey: ['attachments'] })
    },
  })
}
