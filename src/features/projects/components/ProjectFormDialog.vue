<script setup lang="ts">
import { ResponsiveDialog } from '@/components/responsive-dialog'
import ProjectForm from './ProjectForm.vue'

defineProps<{
  project?: { id: string; name: string; description: string | null }
}>()

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <ResponsiveDialog
    v-model:open="open"
    :title="project ? 'Edit Project' : 'Buat Project'"
    :description="project ? 'Perbarui nama atau deskripsi project.' : 'Isi detail project baru.'"
  >
    <!-- v-if + key: form di-reset setiap dialog dibuka / target edit berganti -->
    <ProjectForm
      v-if="open"
      :key="project?.id ?? 'new'"
      :project="project"
      @saved="open = false"
      @cancel="open = false"
    />
  </ResponsiveDialog>
</template>
