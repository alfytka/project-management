<script setup lang="ts">
import AvatarStack from '@/components/AvatarStack.vue'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Task } from '../types'
import TaskDueDate from './TaskDueDate.vue'
import TaskPriorityBadge from './TaskPriorityBadge.vue'
import TaskStatusBadge from './TaskStatusBadge.vue'

defineProps<{
  task: Task
  done: boolean
  /** Tampilkan badge status (list mobile); di board status sudah terwakili kolom. */
  statusColor?: StatusColor
}>()

const emit = defineEmits<{ open: [task: Task] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-full flex-col gap-3 rounded-xl border bg-card p-3.5 text-left shadow-xs transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    @click="emit('open', task)"
  >
    <div class="space-y-1">
      <p :class="['line-clamp-2 font-medium', done && 'text-muted-foreground line-through']">{{ task.title }}</p>
      <p v-if="task.epic" class="truncate text-xs text-muted-foreground">{{ task.epic.title }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-2 text-sm">
      <TaskStatusBadge v-if="statusColor" :name="task.status.name" :color="statusColor" />
      <TaskPriorityBadge :priority="task.priority" />
      <TaskDueDate :due-date="task.due_date" :done="done" class="text-xs" />
      <AvatarStack
        v-if="task.assignees.length"
        class="ml-auto"
        :users="task.assignees.map((a) => ({ id: a.user_id, name: a.name }))"
      />
    </div>
  </button>
</template>
