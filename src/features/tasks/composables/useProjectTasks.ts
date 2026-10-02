import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProjectTasks } from '../api'
import type { TaskFilters } from '../types'

export function useProjectTasks(projectId: MaybeRefOrGetter<string>, filters: MaybeRefOrGetter<TaskFilters> = {}) {
  // Buang filter kosong supaya query key & query param tetap bersih.
  const activeFilters = computed(() =>
    Object.fromEntries(Object.entries(toValue(filters)).filter(([, value]) => !!value)) as TaskFilters,
  )

  return useQuery({
    queryKey: computed(() => ['tasks', { projectId: toValue(projectId), ...activeFilters.value }]),
    queryFn: () => getProjectTasks(toValue(projectId), activeFilters.value),
    enabled: computed(() => !!toValue(projectId)),
    // Ganti filter tanpa board berkedip kosong.
    placeholderData: keepPreviousData,
  })
}
