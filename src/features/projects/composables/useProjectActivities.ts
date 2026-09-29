import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProjectActivities } from '../api'

export function useProjectActivities(projectId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['activities', { projectId: toValue(projectId) }]),
    queryFn: () => getProjectActivities(toValue(projectId)),
  })
}
