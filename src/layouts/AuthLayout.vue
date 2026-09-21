<script setup lang="ts">
import { LayoutDashboard } from '@lucide/vue'
</script>

<template>
  <div class="bg-muted/40 flex min-h-svh items-center justify-center p-6">
    <div class="w-full max-w-sm space-y-6">
      <div class="flex items-center justify-center gap-2">
        <LayoutDashboard class="size-6" />
        <span class="text-lg font-semibold">Project Management</span>
      </div>
      <RouterView />
    </div>
  </div>
</template>
