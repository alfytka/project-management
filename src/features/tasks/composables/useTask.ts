import { useQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getTask } from '../api'

export function useTask(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['tasks', 'detail', toValue(id)]),
    queryFn: () => getTask(toValue(id)),
    enabled: computed(() => !!toValue(id)),
    retry: (count, error) => !(isAxiosError(error) && [403, 404].includes(error.response?.status ?? 0)) && count < 1,
  })
}
