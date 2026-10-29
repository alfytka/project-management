import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { toast } from 'vue-sonner'
import { createAttachment } from '../api'
import type { AttachmentCreate } from '../types'

export function useCreateAttachment(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AttachmentCreate) => createAttachment(toValue(projectId), payload),
    onSuccess: () => {
      toast.success('Lampiran berhasil ditambahkan')
      return queryClient.invalidateQueries({ queryKey: ['attachments'] })
    },
  })
}
