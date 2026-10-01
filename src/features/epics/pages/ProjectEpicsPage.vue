<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  useEpicsQuery,
  useCreateEpicMutation,
  useUpdateEpicMutation,
  useDeleteEpicMutation,
} from '../api'
import EpicCard from '../components/EpicCard.vue'
import EpicFormDialog from '../components/EpicFormDialog.vue'
import type { Epic, EpicStatus, CreateEpicPayload } from '../types'

const route = useRoute()
const projectId = computed(() => route.params.id as string)

const { data: epicsData, isLoading, isError, refetch } = useEpicsQuery(projectId.value)

const createMutation = useCreateEpicMutation(projectId.value)
const updateMutation = useUpdateEpicMutation(projectId.value)
const deleteMutation = useDeleteEpicMutation(projectId.value)

const epicsList = computed(() => epicsData.value ?? [])

const searchQuery = ref('')
const selectedStatus = ref<EpicStatus | 'ALL'>('ALL')
const isDialogOpen = ref(false)
const selectedEpicToEdit = ref<Epic | null>(null)

const selected_epic_to_delete = ref<Epic | null>(null)
const is_delete_dialog_open = ref(false)

const counts = computed(() => ({
  ALL: epicsList.value.length,
  IN_PROGRESS: epicsList.value.filter((e) => e.status === 'IN_PROGRESS').length,
  DELAYED: epicsList.value.filter((e) => e.status === 'DELAYED').length,
  COMPLETED: epicsList.value.filter((e) => e.status === 'COMPLETED').length,
  PLANNED: epicsList.value.filter((e) => e.status === 'PLANNED').length,
}))

const filteredEpics = computed(() => {
  return epicsList.value.filter((epic) => {
    const matchSearch =
      epic.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (epic.description && epic.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchStatus = selectedStatus.value === 'ALL' || epic.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

function handleOpenCreateModal() {
  selectedEpicToEdit.value = null
  isDialogOpen.value = true
}

function handleOpenEditModal(epic: Epic) {
  selectedEpicToEdit.value = epic
  isDialogOpen.value = true
}

async function handleDeleteEpic(epic: Epic) {
  if (confirm(`Apakah Anda yakin ingin menghapus epic "${epic.title}"?`)) {
    try {
      await deleteMutation.mutateAsync(epic.id)
    } catch (err) {
      alert('Gagal menghapus epic.')
    }
  }
}

async function handleFormSubmit(payload: CreateEpicPayload) {
  try {
    if (selectedEpicToEdit.value) {
      await updateMutation.mutateAsync({ epicId: selectedEpicToEdit.value.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
    isDialogOpen.value = false
  } catch (err) {
    alert('Gagal menyimpan data epic.')
  }
}

function handleOpenDeleteDialog(epic: Epic) {
  selected_epic_to_delete.value = epic
  is_delete_dialog_open.value = true
}

async function handleConfirmDelete() {
  if (!selected_epic_to_delete.value) return

  try {
    await deleteMutation.mutateAsync(selected_epic_to_delete.value.id)
    is_delete_dialog_open.value = false
    selected_epic_to_delete.value = null
  } catch (err) {
    alert('Gagal menghapus epic.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div class="w-full md:w-64">
        <input v-model="searchQuery" type="text" placeholder="Cari epic..." class="h-9 w-full px-3 text-sm rounded-md border bg-background" />
      </div>

      <div class="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
        <div class="flex items-center gap-1 bg-muted/50 p-1 rounded-lg text-xs overflow-x-auto">
          <button
            v-for="status in [
              { key: 'ALL', label: 'Semua', count: counts.ALL },
              { key: 'IN_PROGRESS', label: 'Berjalan', count: counts.IN_PROGRESS },
              { key: 'DELAYED', label: 'Terlambat', count: counts.DELAYED },
              { key: 'COMPLETED', label: 'Selesai', count: counts.COMPLETED },
              { key: 'PLANNED', label: 'Belum mulai', count: counts.PLANNED },
            ]"
            :key="status.key"
            type="button"
            :class="[selectedStatus === status.key ? 'bg-background text-foreground shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground', 'px-2.5 py-1 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5']"
            @click="selectedStatus = status.key as any"
          >
            <span>{{ status.label }}</span>
            <span class="text-[0.6875rem] opacity-70">{{ status.count }}</span>
          </button>
        </div>

        <button type="button" class="bg-primary text-primary-foreground px-3.5 py-1.5 text-xs rounded-md font-medium shrink-0 hover:bg-primary/90" @click="handleOpenCreateModal">
          + Buat Epic
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="py-12 text-center text-sm text-muted-foreground">Memuat data epic...</div>
    <div v-else-if="isError" class="py-12 text-center border border-destructive/20 bg-destructive/5 rounded-xl space-y-3">
      <p class="text-sm text-destructive font-medium">Gagal mengambil data dari server.</p>
      <button type="button" class="text-xs bg-background border px-3 py-1.5 rounded-md" @click="refetch()">Coba Lagi</button>
    </div>
    <div v-else-if="filteredEpics.length === 0" class="py-16 text-center border border-dashed rounded-xl space-y-2">
      <p class="text-sm font-medium">Tidak ada epic yang ditemukan.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <EpicCard v-for="epic in filteredEpics" :key="epic.id" :epic="epic" @edit="handleOpenEditModal" @delete="handleDeleteEpic" />
    </div>

    <EpicFormDialog :open="isDialogOpen" :epic-to-edit="selectedEpicToEdit" :is-loading="createMutation.isPending.value || updateMutation.isPending.value" @close="isDialogOpen = false" @submit="handleFormSubmit" />
  </div>

     <ConfirmDeleteDialog
      :open="is_delete_dialog_open"
      :is_loading="deleteMutation.isPending.value"
      title="Hapus Epic Ini?"
      :description="`Apakah Anda yakin ingin menghapus epic '${selected_epic_to_delete?.title}'?`"
      @close="is_delete_dialog_open = false"
      @confirm="handleConfirmDelete"
     />
</template>

