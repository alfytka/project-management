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
import { extractErrorMessage, isNetworkError } from '@/lib/api-errors'
import { useRemoveMember } from '../composables/useRemoveMember'
import type { ProjectMember } from '../types'

const props = defineProps<{
  projectId: string
  member: ProjectMember | null
}>()

const open = defineModel<boolean>('open', { required: true })

const { mutate, isPending } = useRemoveMember(props.projectId)

function onConfirm() {
  if (!props.member) return
  mutate(props.member.user_id, {
    onSuccess: () => {
      open.value = false
    },
    onError: (error) => {
      toast.error(
        isNetworkError(error)
          ? 'Tidak dapat terhubung ke server'
          : extractErrorMessage(error, 'Gagal menghapus member, coba lagi'),
      )
    },
  })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Hapus member?</DialogTitle>
        <DialogDescription>
          <strong>{{ member?.name }}</strong> ({{ member?.email }}) akan dikeluarkan dari project
          ini.
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
