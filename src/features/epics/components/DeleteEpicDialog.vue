<script setup lang="ts">
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { toErrorToast } from '@/lib/api-errors'
import { useDeleteEpic } from '../composables/useDeleteEpic'

const props = defineProps<{
  epic: { id: string; title: string; task_total: number } | null
}>()

const emit = defineEmits<{ deleted: [] }>()

const open = defineModel<boolean>('open', { required: true })

const { mutate, isPending } = useDeleteEpic()

// Backend menolak (409) epic yang masih punya task.
const hasTasks = computed(() => (props.epic?.task_total ?? 0) > 0)

function onConfirm() {
  if (!props.epic) return
  mutate(props.epic.id, {
    onSuccess: () => {
      open.value = false
      emit('deleted')
    },
    onError: (error) => {
      toast.error(toErrorToast(error, 'Gagal menghapus module, coba lagi'))
    },
  })
}
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Hapus module?"
    :pending="isPending"
    pending-label="Menghapus..."
    :disabled="hasTasks"
    @confirm="onConfirm"
  >
    <template #description>
      Module <strong>{{ epic?.title }}</strong> akan dihapus permanen.
    </template>
    <p
      v-if="hasTasks"
      class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
    >
      Module ini masih punya {{ epic?.task_total }} task. Pindahkan atau hapus task tersebut terlebih
      dahulu sebelum menghapus module.
    </p>
  </ConfirmDialog>
</template>
