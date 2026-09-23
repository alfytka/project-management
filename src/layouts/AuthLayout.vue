<script setup lang="ts">
import { CheckCircle2, LayoutDashboard } from '@lucide/vue'

const highlights = [
  'Kelola project dan task dalam satu tempat',
  'Kolaborasi tim yang lebih rapi dan terukur',
  'Pantau progres secara real-time',
]
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="relative hidden flex-col justify-between overflow-hidden bg-neutral-950 p-10 text-neutral-50 lg:flex">
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_theme(colors.neutral.800),_transparent_55%)]"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,_theme(colors.white/0.04)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.white/0.04)_1px,_transparent_1px)] bg-[size:32px_32px]"
      />

      <div class="relative flex items-center gap-2">
        <div class="flex size-8 items-center justify-center rounded-lg bg-white/10">
          <LayoutDashboard class="size-4.5" />
        </div>
        <span class="text-lg font-semibold">Project Management</span>
      </div>

      <div class="relative space-y-6">
        <p class="text-2xl leading-snug font-medium text-balance">
          Satu ruang kerja untuk semua project dan task tim Anda.
        </p>
        <ul class="space-y-3">
          <li v-for="item in highlights" :key="item" class="flex items-start gap-2.5 text-sm text-neutral-300">
            <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-neutral-400" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <p class="relative text-xs text-neutral-500">© {{ new Date().getFullYear() }} Project Management</p>
    </div>

    <div class="flex flex-col items-center justify-center gap-8 p-6 sm:p-10">
      <div class="flex items-center gap-2 lg:hidden">
        <LayoutDashboard class="size-6" />
        <span class="text-lg font-semibold">Project Management</span>
      </div>

      <div class="w-full max-w-sm">
        <RouterView />
      </div>
    </div>
  </div>
</template>
