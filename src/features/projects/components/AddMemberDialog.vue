<script setup lang="ts">
import { ResponsiveDialog } from '@/components/responsive-dialog'
import AddMemberForm from './AddMemberForm.vue'

defineProps<{ projectId: string }>()

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <ResponsiveDialog v-model:open="open" title="Tambah Member" description="Undang pengguna terdaftar lewat email.">
    <!-- v-if: form (nilai & error) di-reset setiap dialog dibuka -->
    <AddMemberForm v-if="open" :project-id="projectId" @saved="open = false" @cancel="open = false" />
  </ResponsiveDialog>
</template>
