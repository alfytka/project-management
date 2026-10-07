<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  projectId: string
  counts: { epics?: number; tasks?: number; members?: number }
}>()

const tabs = computed(() => [
  { name: 'project-dashboard', label: 'Dashboard' },
  { name: 'project-epics', label: 'Modules', count: props.counts.epics },
  { name: 'project-tasks', label: 'Tasks', count: props.counts.tasks },
  { name: 'project-members', label: 'Members', count: props.counts.members },
  { name: 'project-settings', label: 'Pengaturan' },
])
</script>

<template>
  <nav class="-mb-px flex gap-6 overflow-x-auto border-b" aria-label="Tab project">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      v-slot="{ href, navigate, isActive }"
      :to="{ name: tab.name, params: { id: projectId } }"
      custom
    >
      <a
        :href="href"
        :aria-current="isActive ? 'page' : undefined"
        :class="[
          isActive
            ? 'border-foreground font-semibold text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground',
          'inline-flex shrink-0 items-center gap-2 border-b-2 pb-3 text-[0.9375rem] transition-colors',
        ]"
        @click="navigate"
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined"
          class="rounded-md bg-muted px-1.5 text-xs font-medium tabular-nums text-muted-foreground"
        >
          {{ tab.count }}
        </span>
      </a>
    </RouterLink>
  </nav>
</template>
