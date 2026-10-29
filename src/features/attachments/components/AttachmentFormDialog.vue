<script setup lang="ts">
import { ResponsiveDialog } from '@/components/responsive-dialog'
import type { ProjectAttachment } from '../types'
import AttachmentForm from './AttachmentForm.vue'

defineProps<{
  projectId: string
  count: number
  /** Lampiran yang diedit; kosong = tambah baru. */
  attachment?: ProjectAttachment | null
}>()

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <ResponsiveDialog
    v-model:open="open"
    :title="attachment ? 'Edit Lampiran' : 'Tambah Lampiran'"
    :description="attachment ? 'Perbarui judul atau URL lampiran.' : 'Tempel link Figma, Drive, Notion, GitHub, atau referensi lain.'"
  >
    <!-- v-if + key: form di-reset setiap dialog dibuka / target edit berganti -->
    <AttachmentForm
      v-if="open"
      :key="attachment?.id ?? 'new'"
      :project-id="projectId"
      :count="count"
      :attachment="attachment"
      @saved="open = false"
      @cancel="open = false"
    />
  </ResponsiveDialog>
</template>
