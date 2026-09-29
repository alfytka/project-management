<script setup lang="ts">
import { Plus } from '@lucide/vue'

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    class="group/new flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors hover:border-foreground/20 hover:bg-muted/40 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    @click="emit('click')"
  >
    <span class="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover/new:text-foreground">
      <Plus class="size-5" />
    </span>
    <span class="space-y-1">
      <span class="block font-semibold">Buat project baru</span>
      <span class="block text-sm text-muted-foreground">Anda otomatis menjadi admin</span>
    </span>
  </button>
</template>
