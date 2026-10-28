<script setup lang="ts">
import { FolderKanban, ListChecks, Target } from '@lucide/vue'
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
  <article :aria-label="project.name" class="group/card relative flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-xs transition-shadow duration-200 hover:shadow-md">
    <div class="flex items-start justify-between gap-2">
      <span :class="[accent.soft, 'flex size-10 items-center justify-center rounded-xl']">
        <FolderKanban class="size-5" />
      </span>
      <div class="flex items-center gap-1.5">
        <RoleBadge :role="project.my_role" />
        <ProjectActionsMenu :project="project" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
      </div>
    </div>

    <div class="space-y-1">
      <RouterLink
        :to="{ name: 'project-dashboard', params: { id: project.id } }"
        class="line-clamp-1 text-base font-semibold tracking-tight outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
      >
        {{ project.name }}
      </RouterLink>
      <p class="line-clamp-2 min-h-10 text-sm text-muted-foreground">
        {{ project.description || 'Tidak ada deskripsi.' }}
      </p>
    </div>

    <ProjectProgress
      :progress="project.progress"
      :task-total="project.task_total"
      :task-done="project.task_done"
      :bar-class="accent.bar"
    />

    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span class="inline-flex items-center gap-1.5"><Target class="size-4" /> {{ project.epic_count }} module</span>
      <span class="inline-flex items-center gap-1.5"><ListChecks class="size-4" /> {{ project.task_total }} task</span>
    </div>

    <div class="mt-auto flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
      <AvatarStack :users="members" :total="project.member_count" />
      <span>{{ formatDate(project.created_at) }}</span>
    </div>
  </article>
</template>
