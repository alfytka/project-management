<script setup lang="ts">
import { computed } from 'vue'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'
import type { Task } from '../types'
import TaskBoardColumn from './TaskBoardColumn.vue'

const props = defineProps<{
  tasks: Task[]
  statuses: Status[]
  colorOf: (statusId: string) => StatusColor
}>()

const emit = defineEmits<{
  move: [taskId: string, statusId: string]
  open: [task: Task]
}>()

/** Grouping di client (sesuai catatan FE di Notion): satu response dipakai board & list. */
const columns = computed(() =>
  props.statuses.map((status) => ({
    status,
    tasks: props.tasks.filter((task) => task.status_id === status.id),
  })),
)
</script>

<template>
  <div class="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
    <TaskBoardColumn
      v-for="column in columns"
      :key="column.status.id"
      :status="column.status"
      :color="colorOf(column.status.id)"
      :tasks="column.tasks"
      @move="(taskId, statusId) => emit('move', taskId, statusId)"
      @open="emit('open', $event)"
    />
  </div>
</template>
