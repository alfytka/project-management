<script setup lang="ts">
import { X } from '@lucide/vue'
import { isAxiosError } from 'axios'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsDesktop } from '@/composables/useIsDesktop'
import { useProjectStatuses } from '@/features/statuses/composables/useProjectStatuses'
import { useTask } from '../composables/useTask'
import type { TaskAssignee } from '../types'
import TaskDetailContent from './TaskDetailContent.vue'

/** Detail & edit task: panel kanan di desktop, bottom sheet di mobile. */
const props = defineProps<{
  taskId: string | null
  projectId: string
  members: TaskAssignee[]
}>()

const open = defineModel<boolean>('open', { required: true })

const isDesktop = useIsDesktop()
const { data: task, isPending, isError, error } = useTask(() => props.taskId ?? '')
const { statuses, colorOf } = useProjectStatuses(() => props.projectId)

const notFound = computed(() => isAxiosError(error.value) && error.value.response?.status === 404)
</script>

<template>
  <component
    :is="isDesktop ? Sheet : Drawer"
    v-model:open="open"
  >
    <component
      :is="isDesktop ? SheetContent : DrawerContent"
      :class="isDesktop ? 'w-full gap-0 overflow-y-auto sm:max-w-lg' : 'max-h-[92dvh]! rounded-t-2xl'"
    >
      <component :is="isDesktop ? SheetTitle : DrawerTitle" class="sr-only">Detail task</component>
      <component :is="isDesktop ? SheetDescription : DrawerDescription" class="sr-only">
        Ubah status, prioritas, due date, assignee, dan deskripsi task.
      </component>

      <div v-if="!isDesktop" class="flex justify-end px-5 pt-2">
        <DrawerClose
          class="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
          aria-label="Tutup"
        >
          <X class="size-4" />
        </DrawerClose>
      </div>

      <div :class="isDesktop ? 'p-6 pt-10' : 'overflow-y-auto px-5 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]'">
        <div v-if="isPending" class="space-y-4">
          <Skeleton class="h-8 w-3/4" />
          <Skeleton v-for="n in 5" :key="n" class="h-9 w-full" />
        </div>
        <div v-else-if="isError || !task" class="space-y-3 py-8 text-center">
          <p class="font-medium">{{ notFound ? 'Task tidak ditemukan' : 'Gagal memuat task' }}</p>
          <Button variant="outline" size="sm" @click="open = false">Tutup</Button>
        </div>
        <TaskDetailContent
          v-else
          :key="task.id"
          :task="task"
          :project-id="projectId"
          :statuses="statuses"
          :color-of="colorOf"
          :members="members"
          @deleted="open = false"
        />
      </div>
    </component>
  </component>
</template>
