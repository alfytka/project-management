<script setup lang="ts">
import { computed } from 'vue'
import { ResponsiveDialog, ResponsiveDialogBody } from '@/components/responsive-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectEpics } from '@/features/epics/composables/useProjectEpics'
import SeedStatusesEmpty from '@/features/statuses/components/SeedStatusesEmpty.vue'
import { useProjectStatuses } from '@/features/statuses/composables/useProjectStatuses'
import type { TaskAssignee } from '../types'
import TaskForm from './TaskForm.vue'

const props = defineProps<{
  projectId: string
  members: TaskAssignee[]
  epicId?: string
}>()

const open = defineModel<boolean>('open', { required: true })

const { statuses, colorOf, isPending: statusesPending } = useProjectStatuses(() => props.projectId)
const { data: epics, isPending: epicsPending } = useProjectEpics(() => props.projectId)

const loading = computed(() => statusesPending.value || (!props.epicId && epicsPending.value))
</script>

<template>
  <ResponsiveDialog v-model:open="open" title="Buat Task" description="Tambahkan pekerjaan baru ke module." class="sm:max-w-xl">
    <ResponsiveDialogBody v-if="loading" class="space-y-4 pb-6">
      <Skeleton v-for="n in 4" :key="n" class="h-9 w-full" />
    </ResponsiveDialogBody>
    <ResponsiveDialogBody v-else-if="!statuses.length" class="pb-6">
      <SeedStatusesEmpty :project-id="projectId" />
    </ResponsiveDialogBody>
    <ResponsiveDialogBody v-else-if="!epicId && !epics?.length" class="pb-6 text-sm text-muted-foreground">
      Belum ada module. Admin project perlu membuat module sebelum task bisa dibuat.
    </ResponsiveDialogBody>
    <!-- v-if: form di-reset setiap dialog dibuka -->
    <TaskForm
      v-else-if="open"
      :epic-id="epicId"
      :epics="epics ?? []"
      :statuses="statuses"
      :color-of="colorOf"
      :members="members"
      @saved="open = false"
      @cancel="open = false"
    />
  </ResponsiveDialog>
</template>
