<script setup lang="ts">
import { Ellipsis, FolderOpen, Pencil, Trash2 } from '@lucide/vue'
import { useRouter } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ProjectListItem } from '../types'

const props = defineProps<{ project: ProjectListItem }>()

const emit = defineEmits<{
  edit: [project: ProjectListItem]
  delete: [project: ProjectListItem]
}>()

const router = useRouter()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        aria-label="Aksi project"
        class="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent"
      >
        <Ellipsis class="size-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="router.push({ name: 'project-overview', params: { id: props.project.id } })">
        <FolderOpen class="size-4" />
        Buka project
      </DropdownMenuItem>
      <template v-if="project.my_role === 'admin'">
        <DropdownMenuItem @click="emit('edit', project)">
          <Pencil class="size-4" />
          Edit project
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" @click="emit('delete', project)">
          <Trash2 class="size-4" />
          Hapus project
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
