<script setup lang="ts">
import type { StatusColor } from '@/features/statuses/lib/color'

defineProps<{
  name: string
  color: StatusColor
}>()
</script>

<template>
  <span :class="[color.badge, 'inline-flex h-6 shrink-0 items-center rounded-md px-2 text-xs font-medium whitespace-nowrap']">
    {{ name }}
  </span>
</template>
