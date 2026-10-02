<script setup lang="ts">
import { Columns3, ListChecks, Plus, Rows3 } from '@lucide/vue'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import SeedStatusesEmpty from '@/features/statuses/components/SeedStatusesEmpty.vue'
import { useProjectStatuses } from '@/features/statuses/composables/useProjectStatuses'
import TaskBoard from '@/features/tasks/components/TaskBoard.vue'
import TaskDetailSheet from '@/features/tasks/components/TaskDetailSheet.vue'
import TaskFilterBar from '@/features/tasks/components/TaskFilterBar.vue'
import TaskFormDialog from '@/features/tasks/components/TaskFormDialog.vue'
import TaskList from '@/features/tasks/components/TaskList.vue'
import { useProjectTasks } from '@/features/tasks/composables/useProjectTasks'
import { useUpdateTask } from '@/features/tasks/composables/useUpdateTask'
import type { Task, TaskFilters } from '@/features/tasks/types'
import { useAuthStore } from '@/stores/auth'
import { useCurrentProject } from '../../composables/useCurrentProject'

const authStore = useAuthStore()
const { projectId, project } = useCurrentProject()

const view = useStorage<'board' | 'list'>('pm_tasks_view', 'board')
const filters = ref<TaskFilters>({})
const search = ref('')

const { statuses, colorOf, isDone, isPending: statusesPending } = useProjectStatuses(projectId)
const { data, isPending: tasksPending, isError, refetch } = useProjectTasks(projectId, filters)

const members = computed(() => project.value?.members ?? [])
const hasFilter = computed(() => !!search.value || Object.values(filters.value).some(Boolean))

// Filter API sudah diterapkan backend; pencarian judul cukup di client.
const tasks = computed(() => {
  const query = search.value.trim().toLowerCase()
  return (data.value ?? []).filter((task) => !query || task.title.toLowerCase().includes(query))
})

const { mutate: updateTask } = useUpdateTask()

function moveTask(taskId: string, statusId: string) {
  const task = data.value?.find((item) => item.id === taskId)
  if (task && task.status_id !== statusId) updateTask({ id: taskId, payload: { status_id: statusId } })
}

const formOpen = ref(false)
const detailOpen = ref(false)
const selectedTaskId = ref<string | null>(null)

function openTask(task: Task) {
  selectedTaskId.value = task.id
  detailOpen.value = true
}

const segmentClass =
  'inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs'
</script>

<template>
  <div v-if="statusesPending" class="space-y-4">
    <Skeleton class="h-9 w-full max-w-xl" />
    <div class="flex gap-3 overflow-hidden">
      <Skeleton v-for="n in 3" :key="n" class="h-72 w-72 shrink-0 rounded-2xl" />
    </div>
  </div>

  <SeedStatusesEmpty v-else-if="!statuses.length" :project-id="projectId" />

  <template v-else>
    <div class="flex flex-col gap-3 lg:flex-row lg:items-start">
      <TaskFilterBar
        v-model:filters="filters"
        v-model:search="search"
        class="flex-1"
        :statuses="statuses"
        :members="members"
        :current-user-id="authStore.user?.id"
      />
      <div class="flex items-center gap-2">
        <div class="inline-flex items-center rounded-lg bg-muted p-1" role="tablist" aria-label="Tampilan">
          <button
            type="button"
            role="tab"
            :aria-selected="view === 'board'"
            :data-active="view === 'board'"
            :class="segmentClass"
            @click="view = 'board'"
          >
            <Columns3 class="size-4" /> Board
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="view === 'list'"
            :data-active="view === 'list'"
            :class="segmentClass"
            @click="view = 'list'"
          >
            <Rows3 class="size-4" /> List
          </button>
        </div>
        <Button class="ml-auto" @click="formOpen = true"><Plus /> Buat Task</Button>
      </div>
    </div>

    <div v-if="isError" class="space-y-2 text-sm text-muted-foreground">
      <p>Gagal memuat task.</p>
      <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
    </div>

    <div v-else-if="tasksPending" class="flex gap-3 overflow-hidden">
      <Skeleton v-for="n in 3" :key="n" class="h-72 w-72 shrink-0 rounded-2xl" />
    </div>

    <div
      v-else-if="!tasks.length && !hasFilter"
      class="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
    >
      <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ListChecks class="size-6" />
      </span>
      <div class="space-y-1">
        <p class="font-medium">Belum ada task</p>
        <p class="text-sm text-muted-foreground">Buat task pertama dan bagikan ke anggota tim.</p>
      </div>
      <Button size="sm" @click="formOpen = true"><Plus /> Buat Task</Button>
    </div>

    <TaskBoard
      v-else-if="view === 'board'"
      :tasks="tasks"
      :statuses="statuses"
      :color-of="colorOf"
      @move="moveTask"
      @open="openTask"
    />

    <section v-else class="overflow-hidden rounded-2xl border bg-card shadow-xs">
      <TaskList
        :tasks="tasks"
        :statuses="statuses"
        :color-of="colorOf"
        :is-done="isDone"
        show-epic
        empty-text="Tidak ada task yang cocok dengan filter."
        @open="openTask"
      />
    </section>

    <p v-if="view === 'board' && hasFilter && !tasks.length" class="text-center text-sm text-muted-foreground">
      Tidak ada task yang cocok dengan filter.
    </p>
  </template>

  <TaskFormDialog v-model:open="formOpen" :project-id="projectId" :members="members" />
  <TaskDetailSheet v-model:open="detailOpen" :task-id="selectedTaskId" :project-id="projectId" :members="members" />
</template>
