<script setup lang="ts">
import { computed } from 'vue'
import type { Epic, EpicStatus } from '../types'
import EpicActionsMenu from './EpicActionsMenu.vue'

const props = defineProps<{
  epic: Epic
}>()

const emit = defineEmits<{
  (e: 'open', epic: Epic): void
  (e: 'edit', epic: Epic): void
  (e: 'delete', epic: Epic): void
}>()

const STATUS_CONFIG: Record<EpicStatus, { label: string; class: string }> = {
  IN_PROGRESS: { label: 'Berjalan', class: 'bg-sky-100 text-sky-700 border-sky-200' },
  DELAYED: { label: 'Terlambat', class: 'bg-rose-100 text-rose-700 border-rose-200' },
  COMPLETED: { label: 'Selesai', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  PLANNED: { label: 'Belum mulai', class: 'bg-slate-100 text-slate-600 border-slate-200' },
}

const status_meta = computed(() => STATUS_CONFIG[props.epic.status] || STATUS_CONFIG.PLANNED)

function formatDateRange(start_str?: string, end_str?: string) {
  if (!start_str || !end_str) return '-'
  const start = new Date(start_str)
  const end = new Date(end_str)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-'

  const start_day = start.getDate()
  const start_month = start.toLocaleDateString('id-ID', { month: 'short' })
  const end_day = end.getDate()
  const end_month = end.toLocaleDateString('id-ID', { month: 'short' })
  const end_year = end.getFullYear()

  if (start.getFullYear() === end_year) {
    return `${start_day} ${start_month} - ${end_day} ${end_month} ${end_year}`
  }

  return `${start_day} ${start_month} ${start.getFullYear()} - ${end_day} ${end_month} ${end_year}`
}

const todo_count = computed(() => props.epic.task_count?.todo ?? props.epic.task_todo ?? 0)
const in_progress_count = computed(() => props.epic.task_count?.in_progress ?? props.epic.task_in_progress ?? 0)
const done_count = computed(() => props.epic.task_count?.done ?? props.epic.task_done ?? 0)
</script>

<template>
  <div
    class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between"
    @click="emit('open', epic)"
  >
    <!-- Header: Status Badge & Dropdown Menu -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span :class="['text-xs px-3 py-1 rounded-full font-medium border', status_meta.class]">
          {{ status_meta.label }}
        </span>

        <EpicActionsMenu
          :epic="epic"
          @open="emit('open', epic)"
          @edit="emit('edit', epic)"
          @delete="emit('delete', epic)"
        />
      </div>

      <!-- Title & Description -->
      <div>
        <h3 class="font-bold text-slate-800 text-base line-clamp-1">
          {{ epic.title }}
        </h3>
        <p class="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[2rem]">
          {{ epic.description || 'Tidak ada deskripsi.' }}
        </p>
      </div>
    </div>

    <!-- Date Range & Progress Bar -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{{ formatDateRange(epic.start_date, epic.end_date) }}</span>
        <span>{{ epic.progress ?? 0 }}%</span>
      </div>

      <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          class="bg-blue-500 h-full rounded-full transition-all duration-300"
          :style="{ width: `${epic.progress ?? 0}%` }"
        ></div>
      </div>
    </div>

    <!-- Task Breakdown Footer -->
    <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
        <span>To Do: {{ todo_count }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-amber-400"></span>
        <span>In Progress: {{ in_progress_count }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Done: {{ done_count }}</span>
      </div>
    </div>
  </div>
</template>
