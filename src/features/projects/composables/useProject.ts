import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProject } from '../api'

export function useProject(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['projects', toValue(id)]),
    queryFn: () => getProject(toValue(id)),
  })
}
