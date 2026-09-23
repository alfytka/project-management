<script setup lang="ts">
import { EllipsisVertical, FolderKanban, Pencil, Trash2, Users } from '@lucide/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDate } from '@/lib/date'
import { getProjectAccent } from '../lib/accent'
import type { ProjectListItem } from '../types'

const props = defineProps<{
  project: ProjectListItem
}>()

const emit = defineEmits<{
  edit: [project: ProjectListItem]
  delete: [project: ProjectListItem]
}>()

const accent = computed(() => getProjectAccent(props.project.id))

const isAdmin = computed(() => props.project.my_role === 'admin')
</script>

<template>
  <div class="group/card relative rounded-2xl border bg-card shadow-sm transition-shadow duration-200 ease-out hover:shadow-md">
    <RouterLink
      :to="{ name: 'project-detail', params: { id: project.id } }"
      class="flex flex-col gap-3 rounded-2xl p-5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span :class="[accent, 'flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-linear-to-br text-white shadow-[0_1px_3px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]']">
        <FolderKanban class="size-5" />
      </span>

      <div class="space-y-1 pr-8">
        <p class="line-clamp-1 text-base font-semibold tracking-tight">
          {{ project.name }}
        </p>
        <p class="line-clamp-2 min-h-10 text-sm text-muted-foreground">
          {{ project.description || 'Tidak ada deskripsi.' }}
        </p>
      </div>

      <div class="mt-1 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-medium capitalize text-accent-foreground">
            {{ project.my_role }}
          </span>
          <span class="inline-flex items-center gap-1">
            <Users class="size-3.5" />
            {{ project.member_count }}
          </span>
        </div>
        <span>{{ formatDate(project.created_at) }}</span>
      </div>
    </RouterLink>

    <DropdownMenu v-if="isAdmin">
      <DropdownMenuTrigger as-child>
        <button
          type="button"
          aria-label="Aksi project"
          class="absolute top-4 right-4 z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity duration-150 hover:bg-accent hover:text-foreground group-hover/card:opacity-100 data-[state=open]:opacity-100"
        >
          <EllipsisVertical class="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="emit('edit', project)">
          <Pencil class="mr-2 size-4" />
          Edit project
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" @click="emit('delete', project)">
          <Trash2 class="mr-2 size-4" />
          Hapus project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
