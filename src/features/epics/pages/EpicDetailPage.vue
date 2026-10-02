<script setup lang="ts">
import { ArrowLeft, Pencil, Plus, Target, Trash2 } from '@lucide/vue'
import { isAxiosError } from 'axios'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentProject } from '@/features/projects/composables/useCurrentProject'
import { useProjectStatuses } from '@/features/statuses/composables/useProjectStatuses'
import TaskDetailSheet from '@/features/tasks/components/TaskDetailSheet.vue'
import TaskFormDialog from '@/features/tasks/components/TaskFormDialog.vue'
import { useEpicTasks } from '@/features/tasks/composables/useEpicTasks'
import type { Task } from '@/features/tasks/types'
import DeleteEpicDialog from '../components/DeleteEpicDialog.vue'
import EpicFormDialog from '../components/EpicFormDialog.vue'
import EpicStatCards from '../components/EpicStatCards.vue'
import EpicStatusBadge from '../components/EpicStatusBadge.vue'
import EpicTasksTable from '../components/EpicTasksTable.vue'
import { useEpic } from '../composables/useEpic'
import { getEpicStatus } from '../lib/status'

const route = useRoute()
const router = useRouter()

const { projectId, project, canManage } = useCurrentProject()
const epicId = computed(() => String(route.params.epicId ?? ''))
const { data: epic, isPending, isError, error } = useEpic(epicId)
const { data: tasks } = useEpicTasks(epicId)
const { statuses, colorOf, isDone } = useProjectStatuses(projectId)

const members = computed(() => project.value?.members ?? [])

const status = computed(() => (epic.value ? getEpicStatus(epic.value) : 'not_started'))
const epicsRoute = computed(() => ({ name: 'project-epics', params: { id: projectId.value } }))

const errorMessage = computed(() => {
  const code = isAxiosError(error.value) ? error.value.response?.status : undefined
  if (code === 404) return { title: 'Module tidak ditemukan', description: 'Module mungkin sudah dihapus.' }
  if (code === 403) return { title: 'Tidak punya akses', description: 'Anda bukan member project ini.' }
  return { title: 'Gagal memuat module', description: 'Periksa koneksi Anda lalu coba lagi.' }
})

const formOpen = ref(false)
const deleteOpen = ref(false)
const taskFormOpen = ref(false)
const taskDetailOpen = ref(false)
const selectedTaskId = ref<string | null>(null)

function openTask(task: Task) {
  selectedTaskId.value = task.id
  taskDetailOpen.value = true
}
</script>

<template>
  <div>
    <Button variant="link" class="h-auto px-0 text-muted-foreground hover:text-foreground hover:no-underline" as-child>
      <RouterLink :to="epicsRoute"><ArrowLeft /> Kembali ke Modules</RouterLink>
    </Button>
  </div>

  <div v-if="isPending" class="space-y-4">
    <Skeleton class="h-9 w-80" />
    <Skeleton class="h-5 w-full max-w-xl" />
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <Skeleton v-for="n in 3" :key="n" class="h-36 rounded-2xl" />
    </div>
    <Skeleton class="h-64 rounded-2xl" />
  </div>

  <div v-else-if="isError || !epic" class="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
    <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <Target class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">{{ errorMessage.title }}</p>
      <p class="text-sm text-muted-foreground">{{ errorMessage.description }}</p>
    </div>
    <Button variant="outline" size="sm" as-child>
      <RouterLink :to="epicsRoute">Kembali ke Modules</RouterLink>
    </Button>
  </div>

  <template v-else>
    <div class="flex flex-col gap-4 md:flex-row md:items-start">
      <div class="min-w-0 flex-1 space-y-2">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ epic.title }}</h1>
          <EpicStatusBadge :status="status" />
        </div>
        <p v-if="epic.description" class="max-w-3xl text-muted-foreground">{{ epic.description }}</p>
      </div>

      <div class="flex items-center gap-2">
        <template v-if="canManage">
          <Button variant="outline" size="lg" @click="formOpen = true"><Pencil /> Edit</Button>
          <Button
            variant="outline"
            size="icon-lg"
            class="text-destructive hover:text-destructive"
            aria-label="Hapus module"
            @click="deleteOpen = true"
          >
            <Trash2 />
          </Button>
        </template>
        <Button size="lg" class="flex-1 md:flex-none" @click="taskFormOpen = true"><Plus /> Tambah Task</Button>
      </div>
    </div>

    <EpicStatCards :epic="epic" :tasks="tasks ?? []" :statuses="statuses" :color-of="colorOf" />
    <EpicTasksTable
      :tasks="tasks ?? []"
      :statuses="statuses"
      :color-of="colorOf"
      :is-done="isDone"
      @open="openTask"
    />

    <EpicFormDialog v-model:open="formOpen" :project-id="projectId" :epic-id="epic.id" />
    <DeleteEpicDialog v-model:open="deleteOpen" :epic="epic" @deleted="router.push(epicsRoute)" />
    <TaskFormDialog v-model:open="taskFormOpen" :project-id="projectId" :members="members" :epic-id="epic.id" />
    <TaskDetailSheet
      v-model:open="taskDetailOpen"
      :task-id="selectedTaskId"
      :project-id="projectId"
      :members="members"
    />
  </template>
</template>
