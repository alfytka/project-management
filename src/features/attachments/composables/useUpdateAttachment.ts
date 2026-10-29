import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { updateAttachment } from '../api'
import type { AttachmentUpdate } from '../types'

export function useUpdateAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AttachmentUpdate }) => updateAttachment(id, payload),
    onSuccess: () => {
      toast.success('Lampiran berhasil diperbarui')
      return queryClient.invalidateQueries({ queryKey: ['attachments'] })
    },
  })
}
