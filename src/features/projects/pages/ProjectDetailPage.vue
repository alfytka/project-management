<script setup lang="ts">
import { Ellipsis, FolderKanban, Pencil, Trash2, UserPlus } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AvatarStack from '@/components/AvatarStack.vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/date'
import AddMemberDialog from '../components/AddMemberDialog.vue'
import DeleteProjectDialog from '../components/DeleteProjectDialog.vue'
import ProjectFormDialog from '../components/ProjectFormDialog.vue'
import ProjectTabsNav from '../components/ProjectTabsNav.vue'
import RoleBadge from '../components/RoleBadge.vue'
import { useCurrentProject } from '../composables/useCurrentProject'
import { useProjectEpics } from '../composables/useProjectEpics'
import { useProjectTaskStats } from '../composables/useProjectTaskStats'
import { getProjectAccent } from '../lib/accent'

const router = useRouter()

const { projectId, project, isPending, isError, myRole, canManage } = useCurrentProject()
const { data: epics } = useProjectEpics(projectId)
const { data: taskStats } = useProjectTaskStats(projectId)

const accent = computed(() => getProjectAccent(projectId.value))
const members = computed(() => project.value?.members.map((m) => ({ id: m.user_id, name: m.name })) ?? [])
const counts = computed(() => ({
  epics: epics.value?.length,
  tasks: taskStats.value?.total,
  members: project.value?.members.length,
}))

const formOpen = ref(false)
const deleteOpen = ref(false)
const inviteOpen = ref(false)
</script>

<template>
  <div v-if="isPending" class="space-y-6">
    <div class="flex items-start gap-4">
      <Skeleton class="size-14 shrink-0 rounded-2xl" />
      <div class="flex-1 space-y-2">
        <Skeleton class="h-8 w-64" />
        <Skeleton class="h-4 w-full max-w-md" />
        <Skeleton class="h-6 w-48" />
      </div>
    </div>
    <Skeleton class="h-9 w-full max-w-lg" />
  </div>

  <div v-else-if="isError || !project" class="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
    <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <FolderKanban class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">Project tidak ditemukan</p>
      <p class="text-sm text-muted-foreground">Project tidak ada atau Anda tidak punya akses.</p>
    </div>
    <Button variant="outline" size="sm" as-child>
      <RouterLink :to="{ name: 'projects' }">Kembali ke Projects</RouterLink>
    </Button>
  </div>

  <template v-else>
    <div class="flex flex-wrap items-start gap-4">
      <span :class="[accent.solid, 'flex size-14 shrink-0 items-center justify-center rounded-2xl']">
        <FolderKanban class="size-7" />
      </span>

      <div class="min-w-0 flex-1 space-y-1.5">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="truncate text-3xl font-bold tracking-tight">{{ project.name }}</h1>
          <RoleBadge v-if="myRole" :role="myRole" />
        </div>
        <p v-if="project.description" class="text-muted-foreground">{{ project.description }}</p>
        <div class="flex flex-wrap items-center gap-2 pt-1 text-sm text-muted-foreground">
          <AvatarStack :users="members" :max="4" />
          <span class="text-foreground/80">{{ project.members.length }} member</span>
          <span aria-hidden="true">·</span>
          <span>Dibuat {{ formatDate(project.created_at) }}</span>
        </div>
      </div>

      <div v-if="canManage" class="flex items-center gap-2">
        <Button variant="outline" size="lg" @click="inviteOpen = true"><UserPlus /> Undang</Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon-lg" aria-label="Aksi project"><Ellipsis /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="formOpen = true">
              <Pencil class="size-4" />
              Edit project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" @click="deleteOpen = true">
              <Trash2 class="size-4" />
              Hapus project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <ProjectTabsNav class="mt-4" :project-id="project.id" :counts="counts" />

    <RouterView />

    <ProjectFormDialog v-model:open="formOpen" :project="project" />
    <DeleteProjectDialog v-model:open="deleteOpen" :project="project" @deleted="router.push({ name: 'projects' })" />
    <AddMemberDialog v-model:open="inviteOpen" :project-id="project.id" />
  </template>
</template>
