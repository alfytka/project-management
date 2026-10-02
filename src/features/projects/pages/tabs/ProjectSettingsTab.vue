<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import StatusManager from '@/features/statuses/components/StatusManager.vue'
import DeleteProjectDialog from '../../components/DeleteProjectDialog.vue'
import ProjectForm from '../../components/ProjectForm.vue'
import { useCurrentProject } from '../../composables/useCurrentProject'

const router = useRouter()
const { projectId, project, canManage } = useCurrentProject()

const deleteOpen = ref(false)
// Remount form setelah tersimpan / dibatalkan supaya nilai awal kembali ke data server.
const formKey = ref(0)
</script>

<template>
  <div v-if="project" class="grid max-w-4xl gap-4">
    <section class="rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
      <div class="mb-4 space-y-1">
        <h2 class="text-lg font-semibold">Umum</h2>
        <p class="text-sm text-muted-foreground">Nama dan deskripsi project.</p>
      </div>
      <ProjectForm v-if="canManage" :key="formKey" :project="project" @saved="formKey++" @cancel="formKey++" />
      <dl v-else class="space-y-3 text-sm">
        <div>
          <dt class="text-muted-foreground">Nama</dt>
          <dd class="font-medium">{{ project.name }}</dd>
        </div>
        <div>
          <dt class="text-muted-foreground">Deskripsi</dt>
          <dd>{{ project.description || '—' }}</dd>
        </div>
      </dl>
    </section>

    <section class="rounded-2xl border bg-card p-4 shadow-xs sm:p-6">
      <div class="mb-4 space-y-1">
        <h2 class="text-lg font-semibold">Status task</h2>
        <p class="text-sm text-muted-foreground">
          Kolom board dari kiri ke kanan. Geser untuk mengubah urutan; status "Menandai Selesai" dihitung
          sebagai progress module.
        </p>
      </div>
      <StatusManager :project-id="projectId" :readonly="!canManage" />
    </section>

    <section v-if="canManage" class="rounded-2xl border border-destructive/30 bg-card p-4 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold text-destructive">Hapus project</h2>
          <p class="text-sm text-muted-foreground">Seluruh module, task, dan member project ikut terhapus.</p>
        </div>
        <Button variant="destructive" @click="deleteOpen = true"><Trash2 /> Hapus project</Button>
      </div>
    </section>

    <DeleteProjectDialog v-model:open="deleteOpen" :project="project" @deleted="router.push({ name: 'projects' })" />
  </div>
</template>
