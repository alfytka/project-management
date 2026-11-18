import { keepPreviousData, useInfiniteQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getMentions } from '../api'

export interface MentionInboxFilters {
  unread: boolean
  projectId?: string
}

const PAGE_SIZE = 20

export function useMentionInbox(filters: MaybeRefOrGetter<MentionInboxFilters>) {
  const query = useInfiniteQuery({
    queryKey: computed(() => {
      const { unread, projectId } = toValue(filters)
      return ['mentions', 'inbox', { unread, projectId }] as const
    }),
    // Filter dibaca dari queryKey (bukan ref live) supaya refetch sebuah Query selalu memakai
    // filternya sendiri — lihat catatan di useUnreadMentionCount.
    queryFn: ({ pageParam, queryKey: [, , { unread, projectId }] }) => {
      return getMentions({
        unread: unread || undefined,
        project_id: projectId,
        limit: PAGE_SIZE,
        cursor: pageParam,
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (page) => page.next_cursor ?? undefined,
    // Ganti tab/filter tanpa list berkedip kosong.
    placeholderData: keepPreviousData,
  })

  const items = computed(() => query.data.value?.pages.flatMap((page) => page.items) ?? [])

  return { ...query, items }
}
