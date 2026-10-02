<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { insertNodeAt, removeNode, useSortable } from '@vueuse/integrations/useSortable'
import { useForm } from 'vee-validate'
import { ref, useTemplateRef } from 'vue'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toErrorToast } from '@/lib/api-errors'
import { useCreateStatus } from '../composables/useCreateStatus'
import { useDeleteStatus } from '../composables/useDeleteStatus'
import { useProjectStatuses } from '../composables/useProjectStatuses'
import { useReorderStatuses } from '../composables/useReorderStatuses'
import { statusSchema } from '../schema'
import type { Status } from '../types'
import SeedStatusesEmpty from './SeedStatusesEmpty.vue'
import StatusRow from './StatusRow.vue'

const props = defineProps<{
  projectId: string
  readonly: boolean
}>()

const { statuses, colorOf, isPending, isError, refetch } = useProjectStatuses(() => props.projectId)

// --- Reorder (drag) ---
const { mutate: reorder } = useReorderStatuses(() => props.projectId)
const list = useTemplateRef<HTMLElement>('list')

useSortable(list, [], {
  handle: '.drag-handle',
  animation: 150,
  watchElement: true,
  onUpdate: (event) => {
    const { oldIndex, newIndex } = event
    // Kembalikan DOM ke posisi semula; Vue yang merender ulang dari cache yang di-update optimistic.
    removeNode(event.item)
    insertNodeAt(event.from, event.item, oldIndex!)
    const ids = statuses.value.map((status) => status.id)
    ids.splice(newIndex!, 0, ids.splice(oldIndex!, 1)[0]!)
    reorder(ids, { onError: (error) => toast.error(toErrorToast(error, 'Gagal mengubah urutan status')) })
  },
})

// --- Tambah ---
const { mutate: create, isPending: isCreating } = useCreateStatus(() => props.projectId)
const { handleSubmit, resetForm } = useForm({ validationSchema: statusSchema, initialValues: { name: '' } })

const onCreate = handleSubmit((values) => {
  create(values, {
    onSuccess: () => resetForm(),
    onError: (error) => toast.error(toErrorToast(error, 'Gagal menambahkan status')),
  })
})

// --- Hapus ---
const { mutate: remove, isPending: isDeleting } = useDeleteStatus()
const deleteOpen = ref(false)
const deleting = ref<Status | null>(null)

function openDelete(status: Status) {
  deleting.value = status
  deleteOpen.value = true
}

function onDelete() {
  if (!deleting.value) return
  remove(deleting.value.id, {
    onSuccess: () => (deleteOpen.value = false),
    // Backend menolak status terakhir / status yang masih dipakai task dengan pesan yang jelas.
    onError: (error) => toast.error(toErrorToast(error, 'Gagal menghapus status')),
  })
}
</script>

<template>
  <div v-if="isPending" class="space-y-2">
    <Skeleton v-for="n in 3" :key="n" class="h-14 rounded-xl" />
  </div>

  <div v-else-if="isError" class="space-y-2 text-sm text-muted-foreground">
    <p>Gagal memuat status.</p>
    <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
  </div>

  <SeedStatusesEmpty v-else-if="!statuses.length" :project-id="projectId" />

  <div v-else class="space-y-4">
    <ul ref="list" class="divide-y overflow-hidden rounded-xl border">
      <StatusRow
        v-for="status in statuses"
        :key="status.id"
        :status="status"
        :color="colorOf(status.id)"
        :readonly="readonly"
        @delete="openDelete"
      />
    </ul>

    <form v-if="!readonly" class="flex items-start gap-2" @submit="onCreate">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem class="flex-1">
          <FormControl>
            <Input autocomplete="off" placeholder="Nama status baru, mis. Review" aria-label="Nama status baru" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <Button type="submit" :disabled="isCreating"><Plus /> Tambah</Button>
    </form>
  </div>

  <ConfirmDialog
    v-model:open="deleteOpen"
    title="Hapus status?"
    :pending="isDeleting"
    pending-label="Menghapus..."
    @confirm="onDelete"
  >
    <template #description>
      Status <strong>{{ deleting?.name }}</strong> akan dihapus. Status yang masih dipakai task tidak
      bisa dihapus — pindahkan task-nya dulu.
    </template>
  </ConfirmDialog>
</template>
