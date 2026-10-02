<script setup lang="ts">
import { computed } from 'vue'
import { getEpicStatus, summarizeEpics } from '@/features/epics/lib/status'
import type { EpicListItem } from '@/features/epics/types'

const props = defineProps<{ epics: EpicListItem[] }>()

const overall = computed(() => summarizeEpics(props.epics))

const epicStatus = computed(() => {
  const statuses = props.epics.map((epic) => ({ epic, status: getEpicStatus(epic) }))
  return {
    running: statuses.filter((s) => s.status === 'in_progress').length,
    done: statuses.filter((s) => s.status === 'done').length,
    late: statuses.filter((s) => s.status === 'late').map((s) => s.epic.title),
  }
})
</script>

<template>
  <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
    <div class="rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
      <p class="text-sm text-muted-foreground">Progress keseluruhan</p>
      <p class="mt-1 text-2xl font-bold sm:text-3xl tracking-tight tabular-nums">{{ overall.progress }}%</p>
      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div class="h-full rounded-full bg-foreground" :style="{ width: `${overall.progress}%` }" />
      </div>
      <p class="mt-3 text-sm text-muted-foreground">{{ overall.done }} dari {{ overall.total }} task selesai</p>
    </div>

    <div class="rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
      <p class="text-sm text-muted-foreground">Module</p>
      <p class="mt-1 text-2xl font-bold sm:text-3xl tracking-tight tabular-nums">{{ epics.length }}</p>
      <p class="mt-3 text-sm text-muted-foreground">
        {{ epicStatus.running }} berjalan · {{ epicStatus.done }} selesai
      </p>
    </div>

    <div class="rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
      <p class="text-sm text-muted-foreground">Task terbuka</p>
      <p class="mt-1 text-2xl font-bold sm:text-3xl tracking-tight tabular-nums">{{ overall.open }}</p>
      <p class="mt-3 text-sm text-muted-foreground">dari {{ overall.total }} task di seluruh module</p>
    </div>

    <div class="rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
      <p class="text-sm text-muted-foreground">Module terlambat</p>
      <p :class="[epicStatus.late.length ? 'text-red-600' : '', 'mt-1 text-2xl font-bold sm:text-3xl tracking-tight tabular-nums']">
        {{ epicStatus.late.length }}
      </p>
      <p class="mt-3 truncate text-sm text-muted-foreground">
        {{ epicStatus.late.length ? epicStatus.late.join(', ') : 'Semua module sesuai jadwal' }}
      </p>
    </div>
  </div>
</template>
