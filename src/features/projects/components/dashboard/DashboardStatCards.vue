<script setup lang="ts">
import { CalendarClock, CircleCheck, Clock, ListChecks } from '@lucide/vue'
import { computed } from 'vue'
import type { ProjectDashboard } from '../../types'

const props = defineProps<{
  dashboard: ProjectDashboard
  dueWithin: number
  updating?: boolean
}>()

const done = computed(() => props.dashboard.epics.reduce((sum, epic) => sum + epic.task_done, 0))
const donePercent = computed(() =>
  props.dashboard.total_tasks ? Math.round((done.value / props.dashboard.total_tasks) * 100) : 0,
)
const formatCount = (count: number) => new Intl.NumberFormat('id-ID').format(count)

const cards = computed(() => {
  const { total_tasks, overdue_count, due_soon_count, epics } = props.dashboard
  return [
    {
      label: 'Total task',
      value: total_tasks,
      hint: `Tersebar di ${formatCount(epics.length)} module`,
      icon: ListChecks,
      tint: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
      alert: false,
    },
    {
      label: 'Selesai',
      value: done.value,
      hint: `${donePercent.value}% dari total task`,
      icon: CircleCheck,
      tint: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300',
      alert: false,
    },
    {
      label: 'Terlambat',
      value: overdue_count,
      hint: overdue_count ? 'Lewat jatuh tempo, belum selesai' : 'Tidak ada task terlambat',
      icon: Clock,
      tint: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
      alert: overdue_count > 0,
    },
    {
      label: 'Segera jatuh tempo',
      value: due_soon_count,
      hint: props.updating
        ? 'Memperbarui rentang jatuh tempo…'
        : `Dalam ${props.dueWithin} hari ke depan`,
      icon: CalendarClock,
      tint: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
      alert: false,
    },
  ]
})
</script>

<template>
  <div class="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
    <section
      v-for="card in cards"
      :key="card.label"
      :aria-label="card.label"
      class="min-w-0 rounded-xl border bg-card p-4 sm:p-5"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <h3 class="text-sm font-medium text-muted-foreground">{{ card.label }}</h3>
          <p
            :class="[
              card.alert ? 'text-red-600 dark:text-red-400' : 'text-foreground',
              'mt-1 text-3xl font-semibold tracking-tight break-all tabular-nums sm:text-4xl',
            ]"
          >
            {{ formatCount(card.value) }}
          </p>
        </div>
        <span :class="[card.tint, 'flex size-9 shrink-0 items-center justify-center rounded-lg']">
          <component :is="card.icon" class="size-4.5" aria-hidden="true" />
        </span>
      </div>
      <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ card.hint }}</p>
    </section>
  </div>
</template>
