import { useMutation, useQueryClient, type InfiniteData, type QueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { toErrorToast } from '@/lib/api-errors'
import { markAllMentionsRead, markMentionRead } from '../api'
import type { MentionInboxItem, MentionInboxPage } from '../types'

type InboxCache = InfiniteData<MentionInboxPage> | undefined

/** Set `read_at` di semua cache inbox untuk item yang lolos `match`; kembalikan snapshot untuk rollback. */
async function patchInbox(queryClient: QueryClient, match: (item: MentionInboxItem) => boolean) {
  await queryClient.cancelQueries({ queryKey: ['mentions'] })
  const snapshot = queryClient.getQueriesData<InboxCache>({ queryKey: ['mentions', 'inbox'] })
  const now = new Date().toISOString()

  queryClient.setQueriesData<InboxCache>({ queryKey: ['mentions', 'inbox'] }, (data) =>
    data && {
      ...data,
      pages: data.pages.map((page) => ({
        ...page,
        items: page.items.map((item) => (!item.read_at && match(item) ? { ...item, read_at: now } : item)),
      })),
    },
  )

  return snapshot
}

function restore(queryClient: QueryClient, snapshot: Awaited<ReturnType<typeof patchInbox>> | undefined) {
  for (const [key, data] of snapshot ?? []) queryClient.setQueryData(key, data)
}

// Tab "Belum dibaca" & badge dihitung ulang dari server setelah perubahan.
const settle = (queryClient: QueryClient) => queryClient.invalidateQueries({ queryKey: ['mentions'] })

export function useMarkMentionRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markMentionRead(id),
    onMutate: (id) => patchInbox(queryClient, (item) => item.id === id),
    // Gagal menandai dibaca tidak perlu mengganggu navigasi; cukup kembalikan state.
    onError: (_error, _id, snapshot) => restore(queryClient, snapshot),
    onSettled: () => settle(queryClient),
  })
}

export function useMarkAllMentionsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId?: string) => markAllMentionsRead(projectId),
    onMutate: (projectId) => patchInbox(queryClient, (item) => !projectId || item.project.id === projectId),
    onError: (error, _projectId, snapshot) => {
      restore(queryClient, snapshot)
      toast.error(toErrorToast(error, 'Gagal menandai mention, coba lagi'))
    },
    onSettled: () => settle(queryClient),
  })
}
