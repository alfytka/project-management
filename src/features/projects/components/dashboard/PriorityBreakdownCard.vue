<script setup lang="ts">
import { computed } from 'vue'
import { TASK_PRIORITY_META } from '@/features/tasks/lib/priority'
import { TASK_PRIORITIES } from '@/features/tasks/types'
import type { ProjectDashboard } from '../../types'

const props = defineProps<{
  items: ProjectDashboard['by_priority']
  total: number
}>()

// Backend bisa tidak mengirim priority yang jumlahnya 0; urutan tetap dari paling mendesak.
const rows = computed(() =>
  [...TASK_PRIORITIES].reverse().map((priority) => {
    const count = props.items.find((item) => item.priority === priority)?.count ?? 0
    return { priority, meta: TASK_PRIORITY_META[priority], count, percent: props.total ? Math.round((count / props.total) * 100) : 0 }
  }),
)
</script>

<template>
  <section class="rounded-2xl border bg-card p-6 shadow-xs">
    <h2 class="text-lg font-semibold">Task per prioritas</h2>
    <p class="text-sm text-muted-foreground">Dari yang paling mendesak</p>

    <ul class="mt-4 space-y-3.5">
      <li v-for="row in rows" :key="row.priority">
        <div class="flex items-baseline justify-between gap-3 text-sm">
          <span>{{ row.meta.label }}</span>
          <span class="tabular-nums">
            <span class="font-medium">{{ row.count }}</span>
            <span class="ml-2 text-muted-foreground">{{ row.percent }}%</span>
          </span>
        </div>
        <div
          class="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          :aria-label="`${row.meta.label}: ${row.count} task`"
          :aria-valuenow="row.percent"
          aria-valuemin="0"
          aria-valuemax="100"
          :title="`${row.meta.label}: ${row.count} task (${row.percent}%)`"
        >
          <div :class="[row.meta.bar, 'h-full rounded-full transition-[width] duration-500']" :style="{ width: `${row.percent}%` }" />
        </div>
      </li>
    </ul>
  </section>
</template>
