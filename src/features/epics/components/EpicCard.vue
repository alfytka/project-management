<script setup lang="ts">
import { CalendarDays } from '@lucide/vue'
import { computed } from 'vue'
import { formatDateRange } from '@/lib/date'
import { EPIC_STATUS_META, getEpicSchedule, getEpicStatus } from '../lib/status'
import type { EpicListItem } from '../types'
import EpicActionsMenu from './EpicActionsMenu.vue'
import EpicProgressBar from './EpicProgressBar.vue'
import EpicStatusBadge from './EpicStatusBadge.vue'

const props = defineProps<{
  epic: EpicListItem
  projectId: string
  canManage: boolean
  /** Warna dot per id status project. */
  dotOf: (statusId: string) => string
}>()

const emit = defineEmits<{
  open: [epic: EpicListItem]
  edit: [epic: EpicListItem]
  delete: [epic: EpicListItem]
}>()

const status = computed(() => getEpicStatus(props.epic))
const schedule = computed(() => getEpicSchedule(props.epic))
</script>

<template>
  <div class="group/card relative flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-xs transition-shadow duration-200 hover:shadow-md">
    <div class="flex items-center justify-between gap-2">
      <EpicStatusBadge :status="status" />
      <EpicActionsMenu
        :epic="epic"
        :can-manage="canManage"
        @open="emit('open', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>

    <div class="space-y-1">
      <RouterLink
        :to="{ name: 'epic-detail', params: { id: projectId, epicId: epic.id } }"
        class="line-clamp-1 text-base font-semibold tracking-tight outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
      >
        {{ epic.title }}
      </RouterLink>
      <p v-if="epic.description" class="line-clamp-2 text-sm text-muted-foreground">{{ epic.description }}</p>
    </div>

    <p class="flex flex-wrap items-center gap-x-2 text-sm">
      <CalendarDays class="size-4 text-muted-foreground" />
      <span>{{ formatDateRange(epic.start_date, epic.end_date) }}</span>
      <span class="text-muted-foreground" aria-hidden="true">·</span>
      <span :class="schedule.late ? 'text-red-600' : 'text-muted-foreground'">{{ schedule.label }}</span>
    </p>

    <div class="mt-auto space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">Progress</span>
        <span class="tabular-nums">
          <span class="text-muted-foreground">{{ epic.task_done }}/{{ epic.task_total }} task</span>
          <span class="ml-2 font-semibold">{{ epic.progress }}%</span>
        </span>
      </div>
      <EpicProgressBar :progress="epic.progress" :bar-class="EPIC_STATUS_META[status].bar" />
    </div>

    <ul v-if="epic.statuses.length" class="flex flex-wrap gap-x-4 gap-y-1 border-t pt-4 text-sm">
      <li v-for="item in epic.statuses" :key="item.id" class="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span :class="[dotOf(item.id), 'size-2 rounded-full']" />
        {{ item.name }} <span class="tabular-nums text-muted-foreground">{{ item.total }}</span>
      </li>
    </ul>
  </div>
</template>
