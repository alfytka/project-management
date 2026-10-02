<script setup lang="ts">
import { CalendarDays } from '@lucide/vue'
import { computed } from 'vue'
import { formatDateOnly, parseDateOnly, startOfToday } from '@/lib/date'

const props = defineProps<{
  dueDate: string | null
  done?: boolean
}>()

const overdue = computed(() => !props.done && !!props.dueDate && parseDateOnly(props.dueDate) < startOfToday())
</script>

<template>
  <span v-if="dueDate" :class="['inline-flex items-center gap-1.5 whitespace-nowrap', overdue ? 'text-red-600' : '']">
    <CalendarDays class="size-4 shrink-0" :class="overdue ? '' : 'text-muted-foreground'" />
    {{ formatDateOnly(dueDate) }}
  </span>
  <span v-else class="text-muted-foreground">—</span>
</template>
