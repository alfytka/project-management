import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { toast } from 'vue-sonner'
import { createStatus } from '../api'
import { DEFAULT_STATUSES } from '../lib/color'
import { invalidateStatusDependents } from './invalidate'

/**
 * Backend belum men-seed status saat project dibuat, padahal task wajib punya status.
 * Buat To Do (default), In Progress, Done (selesai) secara berurutan supaya `order` benar.
 */
export function useSeedDefaultStatuses(projectId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      for (const status of DEFAULT_STATUSES) await createStatus(toValue(projectId), { ...status })
    },
    onSuccess: () => {
      toast.success('Status default berhasil dibuat')
    },
    // Bisa gagal di tengah jalan setelah sebagian status terbuat — tetap segarkan daftar.
    onSettled: () => invalidateStatusDependents(queryClient),
  })
}
