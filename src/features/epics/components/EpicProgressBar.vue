<script setup lang="ts">
defineProps<{
  progress: number
  barClass: string
}>()
</script>

<template>
  <div
    class="h-1.5 overflow-hidden rounded-full bg-muted"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div :class="[barClass, 'h-full rounded-full transition-[width] duration-500']" :style="{ width: `${progress}%` }" />
  </div>
</template>
