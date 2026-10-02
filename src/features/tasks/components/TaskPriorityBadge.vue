<script setup lang="ts">
import { TASK_PRIORITY_META } from '../lib/priority'
import type { TaskPriority } from '../types'

defineProps<{ priority: TaskPriority }>()
</script>

<template>
  <span
    :class="[
      TASK_PRIORITY_META[priority]?.badge ?? 'bg-muted',
      'inline-flex h-6 shrink-0 items-center rounded-md px-2 text-xs font-medium',
    ]"
  >
    {{ priority }}
  </span>
</template>
