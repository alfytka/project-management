<script setup lang="ts">
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { toErrorToast } from '@/lib/api-errors'
import { singleFlight } from '@/lib/single-flight'
import { useDeleteProject } from '../composables/useDeleteProject'

const props = defineProps<{
  project: { id: string; name: string } | null
}>()

const emit = defineEmits<{ deleted: [] }>()

const open = defineModel<boolean>('open', { required: true })

const { mutateAsync, isPending } = useDeleteProject()

const onConfirm = singleFlight(async () => {
  if (!props.project) return
  try {
    await mutateAsync(props.project.id)
    open.value = false
    emit('deleted')
  } catch (error) {
    toast.error(toErrorToast(error, 'Gagal menghapus project, coba lagi'))
  }
})
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Hapus project?"
    :pending="isPending"
    pending-label="Menghapus..."
    @confirm="onConfirm"
  >
    <template #description>
      Project <strong>{{ project?.name }}</strong> beserta seluruh module dan task-nya akan dihapus
      permanen.
    </template>
  </ConfirmDialog>
</template>
