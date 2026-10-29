import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProjectAttachments } from '../api'

export function useProjectAttachments(projectId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['attachments', { projectId: toValue(projectId) }]),
    queryFn: () => getProjectAttachments(toValue(projectId)),
    enabled: computed(() => !!toValue(projectId)),
  })
}
