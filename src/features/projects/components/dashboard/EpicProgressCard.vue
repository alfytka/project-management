<script setup lang="ts">
import { ChevronRight } from '@lucide/vue'
import { computed } from 'vue'
import EpicProgressBar from '@/features/epics/components/EpicProgressBar.vue'
import type { ProjectDashboard } from '../../types'

const props = defineProps<{
  projectId: string
  epics: ProjectDashboard['epics']
}>()

// Module yang belum selesai di atas; urutan dari backend dipertahankan di tiap kelompok.
const sorted = computed(() => [...props.epics].sort((a, b) => Number(a.progress >= 100) - Number(b.progress >= 100)))
</script>

<template>
  <section class="rounded-2xl border bg-card p-6 shadow-xs">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-lg font-semibold">Progress module</h2>
      <RouterLink
        :to="{ name: 'project-epics', params: { id: projectId } }"
        class="text-sm text-muted-foreground hover:text-foreground"
      >
        Lihat semua
      </RouterLink>
    </div>

    <p v-if="!epics.length" class="py-10 text-center text-sm text-muted-foreground">
      Belum ada module. Buat module untuk mengelompokkan task.
    </p>

    <ul v-else class="-mx-3 mt-2">
      <li v-for="epic in sorted" :key="epic.id">
        <RouterLink
          :to="{ name: 'epic-detail', params: { id: projectId, epicId: epic.id } }"
          class="group block rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="min-w-0 truncate font-medium">{{ epic.title }}</span>
            <span class="flex shrink-0 items-center gap-1 text-sm">
              <span class="font-medium tabular-nums">{{ epic.progress }}%</span>
              <ChevronRight class="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
          <EpicProgressBar
            class="mt-2"
            :progress="epic.progress"
            :bar-class="epic.progress >= 100 ? 'bg-green-600' : 'bg-blue-700'"
          />
          <p class="mt-1.5 text-xs text-muted-foreground">
            {{ epic.task_done }} dari {{ epic.task_total }} task selesai
          </p>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
