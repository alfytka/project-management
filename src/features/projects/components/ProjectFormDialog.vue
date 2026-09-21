<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ProjectForm from './ProjectForm.vue'

defineProps<{
  project?: { id: string; name: string; description: string | null }
}>()

const open = defineModel<boolean>('open', { required: true })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ project ? 'Edit Project' : 'Buat Project' }}</DialogTitle>
        <DialogDescription>
          {{ project ? 'Perbarui nama atau deskripsi project.' : 'Isi detail project baru.' }}
        </DialogDescription>
      </DialogHeader>
      <!-- v-if + key: form di-reset setiap dialog dibuka / target edit berganti -->
      <ProjectForm
        v-if="open"
        :key="project?.id ?? 'new'"
        :project="project"
        @saved="open = false"
        @cancel="open = false"
      />
    </DialogContent>
  </Dialog>
</template>
