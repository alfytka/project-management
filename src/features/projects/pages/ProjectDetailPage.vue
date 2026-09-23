<script setup lang="ts">
import { ArrowLeft, EllipsisVertical, FolderKanban, Pencil, Trash2, Users } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/date'
import DeleteProjectDialog from '../components/DeleteProjectDialog.vue'
import ProjectFormDialog from '../components/ProjectFormDialog.vue'
import ProjectMembersCard from '../components/ProjectMembersCard.vue'
import { useProject } from '../composables/useProject'
import { useProjects } from '../composables/useProjects'
import { getProjectAccent } from '../lib/accent'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => String(route.params.id))
const { data: project, isPending, isError } = useProject(projectId)
const accent = computed(() => getProjectAccent(projectId.value))

// `my_role` dari GET /projects dihitung backend untuk user yang login, jadi tidak perlu menebak
// identitas dari token (backend belum punya /users/me).
const { data: projects } = useProjects()
const myRole = computed(() => projects.value?.find((p) => p.id === projectId.value)?.my_role)
const canManage = computed(() => myRole.value === 'admin')

const formOpen = ref(false)
const deleteOpen = ref(false)
</script>

<template>
  <div class="space-y-6">
    <Button variant="ghost" size="sm" class="-ml-2 text-muted-foreground" as-child>
      <RouterLink :to="{ name: 'projects' }"><ArrowLeft /> Kembali</RouterLink>
    </Button>

    <div v-if="isPending" class="flex items-start gap-4">
      <Skeleton class="size-14 shrink-0 rounded-2xl" />
      <div class="flex-1 space-y-2">
        <Skeleton class="h-7 w-64" />
        <Skeleton class="h-4 w-40" />
        <Skeleton class="mt-2 h-4 w-full max-w-md" />
      </div>
    </div>

    <div v-else-if="isError || !project" class="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
      <span class="flex size-12 items-center justify-center rounded-2xl bg-accent text-muted-foreground">
        <FolderKanban class="size-6" />
      </span>
      <div class="space-y-1">
        <p class="font-medium">
          Project tidak ditemukan
        </p>
        <p class="text-sm text-muted-foreground">
          Project tidak ada atau kamu tidak punya akses.
        </p>
      </div>
    </div>

    <template v-else>
      <div class="flex items-start gap-4">
        <span :class="[accent, 'flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-[0_1px_3px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.35)]']">
          <FolderKanban class="size-7" />
        </span>

        <div class="min-w-0 flex-1 space-y-1.5">
          <div class="flex items-start justify-between gap-2">
            <h1 class="truncate text-2xl font-bold tracking-tight">
              {{ project.name }}
            </h1>

            <DropdownMenu v-if="canManage">
              <DropdownMenuTrigger as-child>
                <button
                  type="button"
                  aria-label="Aksi project"
                  class="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground"
                >
                  <EllipsisVertical class="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="formOpen = true">
                  <Pencil class="mr-2 size-4" />
                  Edit project
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" @click="deleteOpen = true">
                  <Trash2 class="mr-2 size-4" />
                  Hapus project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span class="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium capitalize text-accent-foreground">
              {{ myRole ?? 'member' }}
            </span>
            <span class="inline-flex items-center gap-1">
              <Users class="size-3.5" />
              {{ project.members.length }} member
            </span>
            <span>Dibuat {{ formatDate(project.created_at) }}</span>
          </div>

          <p class="pt-1 text-sm text-muted-foreground">
            {{ project.description || 'Tidak ada deskripsi.' }}
          </p>
        </div>
      </div>

      <ProjectMembersCard :project="project" :can-manage="canManage" />

      <ProjectFormDialog v-model:open="formOpen" :project="project" />
      <DeleteProjectDialog
        v-model:open="deleteOpen"
        :project="project"
        @deleted="router.push({ name: 'projects' })"
      />
    </template>
  </div>
</template>
