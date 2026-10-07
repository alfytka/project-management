<script setup lang="ts">
import { FolderKanban } from '@lucide/vue'
import { computed } from 'vue'
import AvatarStack from '@/components/AvatarStack.vue'
import { formatDate } from '@/lib/date'
import { useProject } from '../composables/useProject'
import { useProjectSummary } from '../composables/useProjectSummary'
import { getProjectAccent } from '../lib/accent'
import type { ProjectListItem } from '../types'
import ProjectActionsMenu from './ProjectActionsMenu.vue'
import RoleBadge from './RoleBadge.vue'

const props = defineProps<{
  project: ProjectListItem
}>()

const emit = defineEmits<{
  edit: [project: ProjectListItem]
  delete: [project: ProjectListItem]
}>()

const accent = computed(() => getProjectAccent(props.project.id))
const { summary } = useProjectSummary(() => props.project.id)
const { data: detail } = useProject(() => props.project.id)
const members = computed(() => detail.value?.members.map((m) => ({ id: m.user_id, name: m.name })) ?? [])
</script>

<template>
  <!--
    Kolom mengikuti lebar daftar (container query di ProjectsPage), bukan viewport: dengan sidebar
    terbuka, lebar konten di laptop kecil jauh lebih sempit dari breakpoint viewport-nya.
  -->
  <div
    class="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50 @2xl:grid-cols-[auto_minmax(0,1fr)_9rem_auto] @4xl:grid-cols-[auto_minmax(10rem,1fr)_9rem_7rem_6rem_7rem_auto]"
  >
    <span :class="[accent.soft, 'flex size-9 items-center justify-center rounded-lg']">
      <FolderKanban class="size-4.5" />
    </span>

    <div class="min-w-0">
      <RouterLink
        :to="{ name: 'project-dashboard', params: { id: project.id } }"
        class="block truncate font-semibold outline-none after:absolute after:inset-0 focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
      >
        {{ project.name }}
      </RouterLink>
      <p class="truncate text-sm text-muted-foreground">
        {{ project.description || 'Tidak ada deskripsi.' }}
      </p>
    </div>

    <div class="hidden items-center gap-2 @2xl:flex">
      <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div :class="[accent.bar, 'h-full rounded-full']" :style="{ width: `${summary.progress}%` }" />
      </div>
      <span class="w-9 text-right text-sm font-medium tabular-nums">{{ summary.progress }}%</span>
    </div>

    <span class="hidden text-sm text-muted-foreground @4xl:block">
      {{ summary.epicCount }} module · {{ summary.taskCount }} task
    </span>

    <div class="hidden @4xl:block">
      <AvatarStack :users="members" :total="project.member_count" />
    </div>

    <span class="hidden text-sm text-muted-foreground @4xl:block">{{ formatDate(project.created_at) }}</span>

    <div class="flex items-center gap-1.5">
      <RoleBadge :role="project.my_role" />
      <ProjectActionsMenu :project="project" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
    </div>
  </div>
</template>
