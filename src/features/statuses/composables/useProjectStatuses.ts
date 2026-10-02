import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProjectStatuses } from '../api'
import { buildStatusColors, FALLBACK_STATUS_COLOR } from '../lib/color'

/** Status project terurut `order` (sudah diurutkan backend) beserta warna dan helper lookup. */
export function useProjectStatuses(projectId: MaybeRefOrGetter<string>) {
  const query = useQuery({
    queryKey: computed(() => ['statuses', { projectId: toValue(projectId) }]),
    queryFn: () => getProjectStatuses(toValue(projectId)),
    enabled: computed(() => !!toValue(projectId)),
  })

  const statuses = computed(() => query.data.value ?? [])
  const byId = computed(() => new Map(statuses.value.map((status) => [status.id, status])))
  const colors = computed(() => buildStatusColors(statuses.value))

  const colorOf = (statusId: string) => colors.value.get(statusId) ?? FALLBACK_STATUS_COLOR
  const isDone = (statusId: string) => byId.value.get(statusId)?.is_done ?? false

  return { ...query, statuses, byId, colorOf, isDone }
}
