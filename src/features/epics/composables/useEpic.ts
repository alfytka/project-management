import { useQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getEpic } from '../api'

export function useEpic(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['epics', 'detail', toValue(id)]),
    queryFn: () => getEpic(toValue(id)),
    enabled: computed(() => !!toValue(id)),
    // 403/404 tidak akan berubah dengan mencoba ulang.
    retry: (count, error) => !(isAxiosError(error) && [403, 404].includes(error.response?.status ?? 0)) && count < 1,
  })
}
