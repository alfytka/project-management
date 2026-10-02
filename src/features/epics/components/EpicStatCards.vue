<script setup lang="ts">
import { CalendarDays } from '@lucide/vue'
import { computed } from 'vue'
import { formatDateRange } from '@/lib/date'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'
import type { Task } from '@/features/tasks/types'
import { EPIC_STATUS_META, getEpicStatus, getEpicTimeline } from '../lib/status'
import type { EpicDetail } from '../types'
import EpicProgressBar from './EpicProgressBar.vue'

const props = defineProps<{
  epic: EpicDetail
  tasks: Task[]
  statuses: Status[]
  colorOf: (statusId: string) => StatusColor
}>()

const status = computed(() => getEpicStatus(props.epic))
const timeline = computed(() => getEpicTimeline(props.epic))

const timelineLabel = computed(() => {
  const { elapsed, totalDays, remaining } = timeline.value
  if (status.value === 'not_started') return `${totalDays} hari · belum dimulai`
  if (elapsed >= totalDays && remaining === 0) return `${totalDays} hari · periode berakhir`
  return `Hari ke-${elapsed} dari ${totalDays} · ${remaining} hari tersisa`
})

/** Jumlah task per status, urut sesuai `order` status project. */
const statusBreakdown = computed(() =>
  props.statuses.map((status) => ({
    id: status.id,
    name: status.name,
    count: props.tasks.filter((task) => task.status_id === status.id).length,
    color: props.colorOf(status.id).dot,
  })),
)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <div class="rounded-2xl border bg-card p-6 shadow-xs">
      <p class="text-sm text-muted-foreground">Progress</p>
      <p class="mt-1 flex items-baseline gap-2">
        <span class="text-3xl font-bold tracking-tight tabular-nums">{{ epic.progress }}%</span>
        <span class="text-sm text-muted-foreground">{{ epic.task_done }} dari {{ epic.task_total }} task selesai</span>
      </p>
      <EpicProgressBar class="mt-4" :progress="epic.progress" :bar-class="EPIC_STATUS_META[status].bar" />
    </div>

    <div class="rounded-2xl border bg-card p-6 shadow-xs">
      <p class="text-sm text-muted-foreground">Timeline</p>
      <p class="mt-1 flex items-center gap-2 text-lg font-semibold">
        <CalendarDays class="size-5 text-muted-foreground" />
        {{ formatDateRange(epic.start_date, epic.end_date) }}
      </p>
      <EpicProgressBar class="mt-3" :progress="timeline.percent" bar-class="bg-muted-foreground/50" />
      <p class="mt-3 text-sm text-muted-foreground">{{ timelineLabel }}</p>
    </div>

    <div class="rounded-2xl border bg-card p-6 shadow-xs sm:col-span-2 xl:col-span-1">
      <p class="text-sm text-muted-foreground">Status task</p>
      <template v-if="tasks.length">
        <div class="mt-3 flex h-2 gap-0.5 overflow-hidden rounded-full">
          <span
            v-for="group in statusBreakdown.filter((item) => item.count)"
            :key="group.id"
            :class="group.color"
            :style="{ flexGrow: group.count }"
            :title="`${group.name}: ${group.count}`"
          />
        </div>
        <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <li v-for="group in statusBreakdown" :key="group.id" class="inline-flex items-center gap-1.5">
            <span :class="[group.color, 'size-2 rounded-full']" />
            {{ group.name }} <span class="tabular-nums text-muted-foreground">{{ group.count }}</span>
          </li>
        </ul>
      </template>
      <p v-else class="mt-3 text-sm text-muted-foreground">Belum ada task.</p>
    </div>
  </div>
</template>
