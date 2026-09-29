import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProjectEpics } from '../api'

export function useProjectEpics(projectId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['epics', { projectId: toValue(projectId) }]),
    queryFn: () => getProjectEpics(toValue(projectId)),
  })
}
