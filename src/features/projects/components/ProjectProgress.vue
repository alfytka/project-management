<script setup lang="ts">
defineProps<{
  progress: number
  epicCount: number
  barClass: string
}>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="text-muted-foreground">{{ epicCount ? 'Progress' : 'Belum ada module' }}</span>
      <span v-if="epicCount" class="font-semibold tabular-nums">{{ progress }}%</span>
    </div>
    <div
      class="h-1.5 overflow-hidden rounded-full bg-muted"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div :class="[barClass, 'h-full rounded-full transition-[width] duration-500']" :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>
