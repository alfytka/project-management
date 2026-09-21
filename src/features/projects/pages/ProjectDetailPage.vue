<script setup lang="ts">
import { ArrowLeft, Pencil, Trash2 } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '../columns'
import DeleteProjectDialog from '../components/DeleteProjectDialog.vue'
import ProjectFormDialog from '../components/ProjectFormDialog.vue'
import ProjectMembersCard from '../components/ProjectMembersCard.vue'
import { useProject } from '../composables/useProject'
import { useProjects } from '../composables/useProjects'

const route = useRoute()
const router = useRouter()

const projectId = computed(() => String(route.params.id))
const { data: project, isPending, isError } = useProject(projectId)

// `my_role` dari GET /projects dihitung backend untuk user yang login, jadi tidak perlu menebak
// identitas dari token (backend belum punya /users/me).
const { data: projects } = useProjects()
const canManage = computed(
  () => projects.value?.find((p) => p.id === projectId.value)?.my_role === 'admin',
)

const formOpen = ref(false)
const deleteOpen = ref(false)
</script>

<template>
  <div class="space-y-4">
    <Button variant="ghost" size="sm" as-child>
      <RouterLink :to="{ name: 'projects' }"><ArrowLeft /> Kembali</RouterLink>
    </Button>

    <Skeleton v-if="isPending" class="h-40 w-full" />

    <Card v-else-if="isError || !project">
      <CardHeader>
        <CardTitle>Project tidak ditemukan</CardTitle>
        <CardDescription>Project tidak ada atau kamu tidak punya akses.</CardDescription>
      </CardHeader>
    </Card>

    <template v-else>
      <Card>
        <CardHeader class="flex flex-row items-start justify-between gap-4">
          <div class="space-y-1.5">
            <CardTitle>{{ project.name }}</CardTitle>
            <CardDescription>Dibuat {{ formatDate(project.created_at) }}</CardDescription>
          </div>
          <div v-if="canManage" class="flex gap-2">
            <Button variant="outline" @click="formOpen = true"><Pencil /> Edit</Button>
            <Button variant="destructive" @click="deleteOpen = true"><Trash2 /> Hapus</Button>
          </div>
        </CardHeader>
        <CardContent class="text-sm">
          {{ project.description || 'Tidak ada deskripsi.' }}
        </CardContent>
      </Card>

      <ProjectMembersCard :project="project" :can-manage="canManage" />

      <ProjectFormDialog v-model:open="formOpen" :project="project" />
      <DeleteProjectDialog
        v-model:open="deleteOpen"
        :project="project"
        @deleted="router.push({ name: 'projects' })"
      />
    </template>
  </div>
</template>
