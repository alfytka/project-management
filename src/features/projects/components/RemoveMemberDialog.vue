<script setup lang="ts">
import { toast } from 'vue-sonner'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { toErrorToast } from '@/lib/api-errors'
import { useRemoveMember } from '../composables/useRemoveMember'
import type { ProjectMember } from '../types'

const props = defineProps<{
  projectId: string
  member: ProjectMember | null
}>()

const open = defineModel<boolean>('open', { required: true })

const { mutate, isPending } = useRemoveMember(() => props.projectId)

function onConfirm() {
  if (!props.member) return
  mutate(props.member.user_id, {
    onSuccess: () => {
      open.value = false
    },
    onError: (error) => {
      toast.error(toErrorToast(error, 'Gagal menghapus member, coba lagi'))
    },
  })
}
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Hapus member?"
    :pending="isPending"
    pending-label="Menghapus..."
    @confirm="onConfirm"
  >
    <template #description>
      <strong>{{ member?.name }}</strong> ({{ member?.email }}) akan dikeluarkan dari project ini.
    </template>
  </ConfirmDialog>
</template>
