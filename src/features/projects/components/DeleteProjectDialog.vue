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
import { isNetworkError } from '@/lib/api-errors'
import { useDeleteProject } from '../composables/useDeleteProject'

const props = defineProps<{
  project: { id: string; name: string } | null
}>()

const emit = defineEmits<{ deleted: [] }>()

const open = defineModel<boolean>('open', { required: true })

const { mutate, isPending } = useDeleteProject()

function onConfirm() {
  if (!props.project) return
  mutate(props.project.id, {
    onSuccess: () => {
      open.value = false
      emit('deleted')
    },
    onError: (error) => {
      toast.error(
        isNetworkError(error)
          ? 'Tidak dapat terhubung ke server'
          : 'Gagal menghapus project, coba lagi',
      )
    },
  })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Hapus project?</DialogTitle>
        <DialogDescription>
          Project <strong>{{ project?.name }}</strong> akan dihapus permanen. Tindakan ini tidak
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
