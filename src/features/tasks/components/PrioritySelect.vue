<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import AppSelectContent from '@/components/AppSelectContent.vue'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TASK_PRIORITIES, type TaskPriority } from '../types'
import TaskPriorityBadge from './TaskPriorityBadge.vue'

defineOptions({ inheritAttrs: false })

defineProps<{
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const model = defineModel<TaskPriority>()
</script>

<template>
  <Select v-model="model" :disabled="disabled">
    <SelectTrigger v-bind="$attrs" :class="['w-full', $props.class]">
      <SelectValue placeholder="Pilih prioritas" />
    </SelectTrigger>
    <AppSelectContent>
      <SelectItem v-for="priority in TASK_PRIORITIES" :key="priority" :value="priority">
        <TaskPriorityBadge :priority="priority" />
      </SelectItem>
    </AppSelectContent>
  </Select>
</template>
