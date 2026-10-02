<script setup lang="ts">
import { ExternalLink, Trash2 } from '@lucide/vue'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import DatePicker from '@/components/DatePicker.vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'
import { toErrorToast } from '@/lib/api-errors'
import { formatDate } from '@/lib/date'
import { useDeleteTask } from '../composables/useDeleteTask'
import { useToggleTaskAssignee } from '../composables/useTaskAssignees'
import { useUpdateTask } from '../composables/useUpdateTask'
import { taskTitleSchema } from '../schema'
import type { Task, TaskAssignee, TaskUpdate } from '../types'
import AssigneePicker from './AssigneePicker.vue'
import PrioritySelect from './PrioritySelect.vue'
import StatusSelect from './StatusSelect.vue'

const props = defineProps<{
  task: Task
  projectId: string
  statuses: Status[]
  colorOf: (statusId: string) => StatusColor
  members: TaskAssignee[]
}>()

const emit = defineEmits<{ deleted: [] }>()

const { mutate: update } = useUpdateTask()
const { mutate: toggleAssignee } = useToggleTaskAssignee()

function save(payload: TaskUpdate) {
  update({ id: props.task.id, payload })
}

// --- Judul & deskripsi: disimpan saat blur / Enter ---
const title = ref(props.task.title)
const titleError = ref('')
const description = ref(props.task.description ?? '')

watch(
  () => [props.task.title, props.task.description] as const,
  ([newTitle, newDescription]) => {
    title.value = newTitle
    description.value = newDescription ?? ''
  },
)

function saveTitle() {
  const parsed = taskTitleSchema.safeParse(title.value)
  if (!parsed.success) {
    titleError.value = parsed.error.issues[0]!.message
    return
  }
  titleError.value = ''
  if (parsed.data !== props.task.title) save({ title: parsed.data })
}

function saveDescription() {
  const value = description.value.trim()
  if (value !== (props.task.description ?? '')) save({ description: value })
}

// --- Hapus ---
const { mutate: remove, isPending: isDeleting } = useDeleteTask()
const deleteOpen = ref(false)

function onDelete() {
  remove(props.task.id, {
    onSuccess: () => {
      deleteOpen.value = false
      emit('deleted')
    },
    onError: (error) => toast.error(toErrorToast(error, 'Gagal menghapus task, coba lagi')),
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-1">
      <Label for="task-title" class="sr-only">Judul Task</Label>
      <Textarea
        id="task-title"
        v-model="title"
        rows="1"
        class="min-h-0 resize-none border-transparent px-2 py-1 text-lg font-semibold shadow-none hover:border-input focus-visible:border-ring md:text-xl"
        :aria-invalid="!!titleError"
        @blur="saveTitle"
        @keydown.enter.prevent="($event.target as HTMLTextAreaElement).blur()"
      />
      <p v-if="titleError" class="px-2 text-sm text-destructive">{{ titleError }}</p>
    </div>

    <dl class="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 text-sm">
      <dt class="text-muted-foreground">Status</dt>
      <dd>
        <StatusSelect
          :model-value="task.status_id"
          :statuses="statuses"
          :color-of="colorOf"
          aria-label="Status"
          @update:model-value="(id) => id && id !== task.status_id && save({ status_id: id })"
        />
      </dd>

      <dt class="text-muted-foreground">Prioritas</dt>
      <dd>
        <PrioritySelect
          :model-value="task.priority"
          aria-label="Prioritas"
          @update:model-value="(priority) => priority && priority !== task.priority && save({ priority })"
        />
      </dd>

      <dt class="text-muted-foreground">Due Date</dt>
      <dd>
        <DatePicker
          :model-value="task.due_date?.slice(0, 10)"
          clearable
          placeholder="Tanpa due date"
          aria-label="Due Date"
          @update:model-value="(date) => save({ due_date: date ?? null })"
        />
      </dd>

      <dt class="text-muted-foreground">Assignee</dt>
      <dd>
        <AssigneePicker
          :model-value="task.assignees.map((assignee) => assignee.user_id)"
          :members="members"
          aria-label="Assignee"
          @toggle="(member, assigned) => toggleAssignee({ taskId: task.id, member, assigned })"
        />
      </dd>

      <template v-if="task.epic">
        <dt class="text-muted-foreground">Module</dt>
        <dd class="min-w-0">
          <RouterLink
            :to="{ name: 'epic-detail', params: { id: projectId, epicId: task.epic.id } }"
            class="inline-flex max-w-full items-center gap-1.5 font-medium hover:underline"
          >
            <span class="truncate">{{ task.epic.title }}</span>
            <ExternalLink class="size-3.5 shrink-0 text-muted-foreground" />
          </RouterLink>
        </dd>
      </template>

      <dt class="text-muted-foreground">Dibuat</dt>
      <dd>{{ formatDate(task.created_at) }}</dd>
    </dl>

    <div class="space-y-2">
      <Label for="task-description">Deskripsi</Label>
      <Textarea
        id="task-description"
        v-model="description"
        rows="5"
        placeholder="Tambahkan deskripsi..."
        @blur="saveDescription"
      />
    </div>

    <Button variant="outline" class="w-full text-destructive hover:text-destructive sm:w-auto" @click="deleteOpen = true">
      <Trash2 /> Hapus task
    </Button>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Hapus task?"
      :pending="isDeleting"
      pending-label="Menghapus..."
      @confirm="onDelete"
    >
      <template #description>
        Task <strong>{{ task.title }}</strong> akan dihapus permanen.
      </template>
    </ConfirmDialog>
  </div>
</template>
