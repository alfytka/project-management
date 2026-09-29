<script setup lang="ts">
defineProps<{ role: string }>()
</script>

<template>
  <span
    :class="[
      role === 'admin'
        ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
        : 'bg-muted text-muted-foreground',
      'inline-flex h-5 items-center rounded-full px-2 text-xs font-medium capitalize',
    ]"
  >
    {{ role }}
  </span>
</template>
