<script setup lang="ts">
import { FolderKanban, Plus } from '@lucide/vue'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import DeleteProjectDialog from '../components/DeleteProjectDialog.vue'
import ProjectCard from '../components/ProjectCard.vue'
import ProjectFormDialog from '../components/ProjectFormDialog.vue'
import { useProjects } from '../composables/useProjects'
import type { ProjectListItem } from '../types'

const { data, isPending, isError, refetch } = useProjects()

const formOpen = ref(false)
const editing = ref<ProjectListItem>()
const deleteOpen = ref(false)
const deleting = ref<ProjectListItem | null>(null)

function openCreate() {
  editing.value = undefined
  formOpen.value = true
}

function openEdit(project: ProjectListItem) {
  editing.value = project
  formOpen.value = true
}

function openDelete(project: ProjectListItem) {
  deleting.value = project
  deleteOpen.value = true
}
</script>

<template>
  <div class="flex items-start justify-between gap-4">
    <div class="space-y-1.5">
      <h1 class="text-2xl font-bold tracking-tight">
        Projects
      </h1>
      <p class="text-sm text-muted-foreground">
        Project yang kamu buat atau ikuti.
      </p>
    </div>
    <Button @click="openCreate"><Plus /> Buat Project</Button>
  </div>

  <div v-if="isError" class="mt-6 space-y-2 text-sm text-muted-foreground">
    <p>Gagal memuat daftar project.</p>
    <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
  </div>

  <div v-else-if="isPending" class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Skeleton v-for="n in 6" :key="n" class="h-42 rounded-2xl" />
  </div>

  <div
    v-else-if="!data?.length"
    class="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
  >
    <span class="flex size-12 items-center justify-center rounded-2xl bg-accent text-muted-foreground">
      <FolderKanban class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">
        Belum ada project
      </p>
      <p class="text-sm text-muted-foreground">
        Buat project pertamamu untuk mulai mengatur task.
      </p>
    </div>
    <Button size="sm" @click="openCreate"><Plus /> Buat Project</Button>
  </div>

  <div v-else class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <ProjectCard
      v-for="project in data"
      :key="project.id"
      :project="project"
      @edit="openEdit"
      @delete="openDelete"
    />
  </div>

  <ProjectFormDialog v-model:open="formOpen" :project="editing" />
  <DeleteProjectDialog v-model:open="deleteOpen" :project="deleting" />
</template>
