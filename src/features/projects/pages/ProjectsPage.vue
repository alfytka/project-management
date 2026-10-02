<script setup lang="ts">
import { FolderKanban, LayoutGrid, List, Plus, Search } from '@lucide/vue'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import DeleteProjectDialog from '../components/DeleteProjectDialog.vue'
import NewProjectCard from '../components/NewProjectCard.vue'
import ProjectCard from '../components/ProjectCard.vue'
import ProjectFormDialog from '../components/ProjectFormDialog.vue'
import ProjectListRow from '../components/ProjectListRow.vue'
import { useProjects } from '../composables/useProjects'
import type { ProjectListItem } from '../types'

type RoleFilter = 'all' | 'admin' | 'member'

const { data, isPending, isError, refetch } = useProjects()

const search = ref('')
const roleFilter = ref<RoleFilter>('all')
const viewMode = useStorage<'grid' | 'list'>('pm_projects_view', 'grid')

const projects = computed(() => data.value ?? [])
const filters = computed<{ value: RoleFilter; label: string; count: number }[]>(() => [
  { value: 'all', label: 'Semua', count: projects.value.length },
  { value: 'admin', label: 'Admin', count: projects.value.filter((p) => p.my_role === 'admin').length },
  { value: 'member', label: 'Member', count: projects.value.filter((p) => p.my_role === 'member').length },
])

const filteredProjects = computed(() => {
  const query = search.value.trim().toLowerCase()
  return projects.value.filter(
    (project) =>
      (roleFilter.value === 'all' || project.my_role === roleFilter.value) &&
      (!query ||
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)),
  )
})

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

const segmentClass =
  'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs'
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="space-y-1">
      <h1 class="text-3xl font-bold tracking-tight">Projects</h1>
      <p class="text-muted-foreground">Project yang Anda buat atau ikuti.</p>
    </div>
    <Button size="lg" @click="openCreate"><Plus /> Buat Project</Button>
  </div>

  <div class="mt-4 flex flex-wrap items-center gap-3">
    <div class="relative w-full sm:w-80">
      <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="project-search"
        v-model="search"
        name="project-search"
        type="search"
        autocomplete="off"
        placeholder="Cari project..."
        aria-label="Cari project"
        class="h-10 pl-9"
      />
    </div>

    <div class="inline-flex items-center rounded-lg bg-muted p-1" role="tablist" aria-label="Filter role">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        role="tab"
        :aria-selected="roleFilter === filter.value"
        :data-active="roleFilter === filter.value"
        :class="segmentClass"
        @click="roleFilter = filter.value"
      >
        {{ filter.label }}
        <span class="tabular-nums text-muted-foreground">{{ filter.count }}</span>
      </button>
    </div>

    <div class="ml-auto inline-flex items-center rounded-lg bg-muted p-1" aria-label="Tampilan">
      <button
        type="button"
        aria-label="Tampilan grid"
        :data-active="viewMode === 'grid'"
        :class="[segmentClass, 'px-2']"
        @click="viewMode = 'grid'"
      >
        <LayoutGrid class="size-4" />
      </button>
      <button
        type="button"
        aria-label="Tampilan list"
        :data-active="viewMode === 'list'"
        :class="[segmentClass, 'px-2']"
        @click="viewMode = 'list'"
      >
        <List class="size-4" />
      </button>
    </div>
  </div>

  <div v-if="isError" class="mt-4 space-y-2 text-sm text-muted-foreground">
    <p>Gagal memuat daftar project.</p>
    <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
  </div>

  <div v-else-if="isPending" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <Skeleton v-for="n in 3" :key="n" class="h-72 rounded-2xl" />
  </div>

  <div
    v-else-if="!projects.length"
    class="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
  >
    <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <FolderKanban class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">Belum ada project</p>
      <p class="text-sm text-muted-foreground">Buat project pertama Anda untuk mulai mengatur task.</p>
    </div>
    <Button size="sm" @click="openCreate"><Plus /> Buat Project</Button>
  </div>

  <p v-else-if="!filteredProjects.length" class="mt-4 py-12 text-center text-sm text-muted-foreground">
    Tidak ada project yang cocok dengan pencarian.
  </p>

  <div v-else-if="viewMode === 'grid'" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    <ProjectCard
      v-for="project in filteredProjects"
      :key="project.id"
      :project="project"
      @edit="openEdit"
      @delete="openDelete"
    />
    <NewProjectCard @click="openCreate" />
  </div>

  <div v-else class="@container mt-4 divide-y overflow-hidden rounded-2xl border bg-card shadow-xs">
    <ProjectListRow
      v-for="project in filteredProjects"
      :key="project.id"
      :project="project"
      @edit="openEdit"
      @delete="openDelete"
    />
  </div>

  <ProjectFormDialog v-model:open="formOpen" :project="editing" />
  <DeleteProjectDialog v-model:open="deleteOpen" :project="deleting" />
</template>
