<script setup lang="ts">
import { FolderKanban } from '@lucide/vue'
import { computed } from 'vue'
import AvatarStack from '@/components/AvatarStack.vue'
import { formatDate } from '@/lib/date'
import { getProjectAccent } from '../lib/accent'
import type { ProjectListItem } from '../types'
import ProjectActionsMenu from './ProjectActionsMenu.vue'
import ProjectProgress from './ProjectProgress.vue'
import RoleBadge from './RoleBadge.vue'

const props = defineProps<{
  project: ProjectListItem
}>()

const emit = defineEmits<{
  edit: [project: ProjectListItem]
  delete: [project: ProjectListItem]
}>()

const accent = computed(() => getProjectAccent(props.project.id))
const members = computed(() => props.project.members_preview.map((member) => ({ id: member.user_id, name: member.name })))
</script>

<template>
  <!--
    Kolom mengikuti lebar daftar (container query di ProjectsPage), bukan viewport: dengan sidebar
    terbuka, lebar konten di laptop kecil jauh lebih sempit dari breakpoint viewport-nya.
  -->
  <article
    :aria-label="project.name"
    class="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50"
  >
    <span :class="[accent.soft, 'flex size-9 items-center justify-center rounded-lg']">
      <FolderKanban class="size-4.5" />
    </span>

    <div class="grid min-w-0 items-center gap-x-6 gap-y-3 @2xl:grid-cols-[minmax(0,1fr)_12rem] @4xl:grid-cols-[minmax(0,1fr)_12rem_10rem]">
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
        <p class="mt-1 text-sm text-muted-foreground">
          {{ project.epic_count }} module · {{ project.task_total }} task
        </p>
      </div>

      <ProjectProgress
        :progress="project.progress"
        :task-total="project.task_total"
        :task-done="project.task_done"
        :bar-class="accent.bar"
      />

      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground @4xl:justify-end">
        <AvatarStack :users="members" :total="project.member_count" />
        <span>{{ formatDate(project.created_at) }}</span>
      </div>
    </div>

    <div class="flex items-center gap-1.5">
      <RoleBadge :role="project.my_role" />
      <ProjectActionsMenu :project="project" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
    </div>
  </article>
</template>
