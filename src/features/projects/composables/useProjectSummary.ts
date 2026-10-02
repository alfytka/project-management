import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useProjectEpics } from '@/features/epics/composables/useProjectEpics'
import { summarizeEpics } from '@/features/epics/lib/status'

/** Ringkasan progress untuk card/list project: jumlah epic, task, dan persentase selesai. */
export function useProjectSummary(projectId: MaybeRefOrGetter<string>) {
  const { data: epics, isPending } = useProjectEpics(() => toValue(projectId))

  const summary = computed(() => {
    const list = epics.value ?? []
    const { total, progress } = summarizeEpics(list)
    return { epicCount: list.length, taskCount: total, progress }
  })

  return { summary, isPending }
}
