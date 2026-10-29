<script setup lang="ts">
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { toErrorToast } from '@/lib/api-errors'
import { useDeleteAttachment } from '../composables/useDeleteAttachment'

const props = defineProps<{
  attachment: { id: string; title: string } | null
}>()

const open = defineModel<boolean>('open', { required: true })

const { mutate, isPending } = useDeleteAttachment()

function onConfirm() {
  if (!props.attachment) return
  mutate(props.attachment.id, {
    onSuccess: () => {
      open.value = false
    },
    onError: (error) => {
      toast.error(toErrorToast(error, 'Gagal menghapus lampiran, coba lagi'))
    },
  })
}
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Hapus lampiran?"
    :pending="isPending"
    pending-label="Menghapus..."
    @confirm="onConfirm"
  >
    <template #description>
      Lampiran <strong>{{ attachment?.title }}</strong> akan dihapus dari project. Halaman tujuan link-nya tidak ikut terhapus.
    </template>
  </ConfirmDialog>
</template>
