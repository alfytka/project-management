<script setup lang="ts">
import { computed } from 'vue'
import { getEpicStatus, summarizeEpics } from '../../lib/epic'
import type { Epic, ProjectTaskStats } from '../../types'

const props = defineProps<{
  epics: Epic[]
  taskStats: ProjectTaskStats
}>()

const overall = computed(() => summarizeEpics(props.epics))

const epicStatus = computed(() => {
  const statuses = props.epics.map((epic) => ({ epic, status: getEpicStatus(epic) }))
  return {
    running: statuses.filter((s) => s.status === 'in_progress').length,
    done: statuses.filter((s) => s.status === 'done').length,
    late: statuses.filter((s) => s.status === 'late').map((s) => s.epic.name),
  }
})
</script>

<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
    <div class="rounded-2xl border bg-card p-6 shadow-xs">
      <p class="text-sm text-muted-foreground">Progress keseluruhan</p>
      <p class="mt-1 text-3xl font-bold tracking-tight tabular-nums">{{ overall.progress }}%</p>
      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div class="h-full rounded-full bg-foreground" :style="{ width: `${overall.progress}%` }" />
      </div>
      <p class="mt-3 text-sm text-muted-foreground">{{ overall.done }} dari {{ overall.total }} task selesai</p>
    </div>

    <div class="rounded-2xl border bg-card p-6 shadow-xs">
      <p class="text-sm text-muted-foreground">Epic</p>
      <p class="mt-1 text-3xl font-bold tracking-tight tabular-nums">{{ epics.length }}</p>
      <p class="mt-3 text-sm text-muted-foreground">
        {{ epicStatus.running }} berjalan · {{ epicStatus.done }} selesai
      </p>
    </div>

    <div class="rounded-2xl border bg-card p-6 shadow-xs">
      <p class="text-sm text-muted-foreground">Task terbuka</p>
      <p class="mt-1 text-3xl font-bold tracking-tight tabular-nums">{{ taskStats.open }}</p>
      <p class="mt-3 text-sm text-muted-foreground">{{ taskStats.due_this_week }} jatuh tempo minggu ini</p>
    </div>

    <div class="rounded-2xl border bg-card p-6 shadow-xs">
      <p class="text-sm text-muted-foreground">Epic terlambat</p>
      <p :class="[epicStatus.late.length ? 'text-red-600' : '', 'mt-1 text-3xl font-bold tracking-tight tabular-nums']">
        {{ epicStatus.late.length }}
      </p>
      <p class="mt-3 truncate text-sm text-muted-foreground">
        {{ epicStatus.late.length ? epicStatus.late.join(', ') : 'Semua epic sesuai jadwal' }}
      </p>
    </div>
  </div>
</template>
