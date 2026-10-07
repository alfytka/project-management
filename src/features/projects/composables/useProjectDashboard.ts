import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProjectDashboard } from '../api'

/** Ringkasan agregat project (satu request); `dueWithin` = rentang hari untuk hitungan due soon. */
export function useProjectDashboard(projectId: MaybeRefOrGetter<string>, dueWithin: MaybeRefOrGetter<number>) {
  return useQuery({
    queryKey: computed(() => ['dashboard', { projectId: toValue(projectId), dueWithin: toValue(dueWithin) }]),
    queryFn: () => getProjectDashboard(toValue(projectId), toValue(dueWithin)),
    enabled: computed(() => !!toValue(projectId)),
    // Ganti rentang hari: tampilkan angka lama sampai response baru tiba. Hanya untuk project yang sama.
    placeholderData: (previous, previousQuery) => {
      const key = previousQuery?.queryKey[1] as { projectId: string } | undefined
      return key?.projectId === toValue(projectId) ? previous : undefined
    },
  })
}
