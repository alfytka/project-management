<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteProjectDialog from '../components/DeleteProjectDialog.vue'
import ProjectFormDialog from '../components/ProjectFormDialog.vue'
import ProjectTable from '../components/ProjectTable.vue'
import { useProjects } from '../composables/useProjects'
import type { ProjectListItem } from '../types'

const { data, isPending, isError, refetch } = useProjects()

const formOpen = ref(false)
const editing = ref<ProjectListItem>()
const deleteOpen = ref(false)
const deleting = ref<ProjectListItem | null>(null)

function openCreate() {
  editing.value = undefined
  formOpen.value = true
}

function openEdit(project: ProjectListItem) {
  editing.value = project
  formOpen.value = true
}

function openDelete(project: ProjectListItem) {
  deleting.value = project
  deleteOpen.value = true
}
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-start justify-between gap-4">
      <div class="space-y-1.5">
        <CardTitle>Projects</CardTitle>
        <CardDescription>Project yang kamu buat atau ikuti.</CardDescription>
      </div>
      <Button @click="openCreate"><Plus /> Buat Project</Button>
    </CardHeader>
    <CardContent>
      <div v-if="isError" class="text-muted-foreground space-y-2 text-sm">
        <p>Gagal memuat daftar project.</p>
        <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
      </div>
      <ProjectTable
        v-else
        :data="data ?? []"
        :loading="isPending"
        @edit="openEdit"
        @delete="openDelete"
      />
    </CardContent>
  </Card>

  <ProjectFormDialog v-model:open="formOpen" :project="editing" />
  <DeleteProjectDialog v-model:open="deleteOpen" :project="deleting" />
</template>
