<script setup lang="ts">
import { Construction } from '@lucide/vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-16 text-center">
    <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <Construction class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">{{ title }}</p>
      <p class="max-w-md text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <slot />
  </div>
</template>
