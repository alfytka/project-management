import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getEpicTasks } from '../api'

export function useEpicTasks(epicId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['tasks', { epicId: toValue(epicId) }]),
    queryFn: () => getEpicTasks(toValue(epicId)),
    enabled: computed(() => !!toValue(epicId)),
  })
}
