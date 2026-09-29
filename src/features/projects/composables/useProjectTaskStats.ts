import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProjectTaskStats } from '../api'

export function useProjectTaskStats(projectId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['task-stats', { projectId: toValue(projectId) }]),
    queryFn: () => getProjectTaskStats(toValue(projectId)),
  })
}
