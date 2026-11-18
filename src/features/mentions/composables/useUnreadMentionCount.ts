import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getUnreadMentionCount } from '../api'

/**
 * Jumlah mention belum dibaca: polling tiap 60 detik + refetch saat tab kembali difokuskan.
 * Tanpa `projectId` = semua project (badge lonceng & sidebar).
 */
export function useUnreadMentionCount(projectId?: MaybeRefOrGetter<string | undefined>) {
  const authStore = useAuthStore()

  return useQuery({
    queryKey: computed(() => ['mentions', 'unread-count', { projectId: toValue(projectId) }] as const),
    // Parameter diambil dari queryKey, bukan dari ref: beberapa komponen bisa berbagi Query yang sama
    // (badge global & halaman Mentions saat filter "Semua project"), dan TanStack memakai queryFn
    // observer terakhir. Kalau membaca ref live, refetch query global bisa ikut terkirim dengan
    // project_id filter halaman dan menimpa badge.
    queryFn: ({ queryKey: [, , { projectId: id }] }) => getUnreadMentionCount(id),
    enabled: computed(() => authStore.isAuthenticated),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  })
}
