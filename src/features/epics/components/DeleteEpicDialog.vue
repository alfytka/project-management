<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toErrorToast } from '@/lib/api-errors'
import { useDeleteEpic } from '../composables/useDeleteEpic'

const props = defineProps<{
  epic: { id: string; title: string } | null
}>()

const emit = defineEmits<{ deleted: [] }>()

const open = defineModel<boolean>('open', { required: true })

const { mutate, isPending } = useDeleteEpic()

function onConfirm() {
  if (!props.epic) return
  mutate(props.epic.id, {
    onSuccess: () => {
      open.value = false
      emit('deleted')
    },
    onError: (error: unknown) => {
      toast.error(toErrorToast(error, 'Gagal menghapus epic, coba lagi'))
    },
  })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Hapus epic?</DialogTitle>
        <DialogDescription>
          Epic <strong>{{ epic?.title }}</strong> akan dihapus permanen. Tindakan ini tidak
          bisa dibatalkan.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" :disabled="isPending" @click="open = false">Batal</Button>
        <Button variant="destructive" :disabled="isPending" @click="onConfirm">
          {{ isPending ? 'Menghapus...' : 'Hapus' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>