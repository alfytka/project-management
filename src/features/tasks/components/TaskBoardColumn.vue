<script setup lang="ts">
import { insertNodeAt, removeNode, useSortable } from '@vueuse/integrations/useSortable'
import { useTemplateRef } from 'vue'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'
import type { Task } from '../types'
import TaskCard from './TaskCard.vue'

const props = defineProps<{
  status: Status
  color: StatusColor
  tasks: Task[]
}>()

const emit = defineEmits<{
  move: [taskId: string, statusId: string]
  open: [task: Task]
}>()

const list = useTemplateRef<HTMLElement>('list')

useSortable(list, [], {
  group: 'tasks',
  // Urutan dalam kolom tidak disimpan backend, jadi drag hanya untuk pindah kolom (ubah status).
  sort: false,
  animation: 150,
  // Di layar sentuh tahan sebentar sebelum drag supaya scroll board tetap bisa.
  delay: 200,
  delayOnTouchOnly: true,
  ghostClass: 'opacity-40',
  watchElement: true,
  onAdd: (event) => {
    const taskId = (event.item as HTMLElement).dataset.taskId
    // Kembalikan DOM ke kolom asal; Vue memindahkan kartu lewat optimistic update.
    removeNode(event.item)
    insertNodeAt(event.from, event.item, event.oldIndex!)
    if (taskId) emit('move', taskId, props.status.id)
  },
})
</script>

<template>
  <section class="flex w-[17rem] shrink-0 snap-start flex-col rounded-2xl bg-muted/50 sm:w-72">
    <header class="flex items-center gap-2 px-3 pt-3 pb-2">
      <span :class="[color.dot, 'size-2.5 rounded-full']" />
      <h3 class="truncate text-sm font-semibold">{{ status.name }}</h3>
      <span class="rounded-md bg-background px-1.5 text-xs font-medium tabular-nums text-muted-foreground">
        {{ tasks.length }}
      </span>
    </header>
    <ul ref="list" class="flex min-h-28 flex-1 flex-col gap-2 px-2 pb-2" :data-status-id="status.id">
      <li v-for="task in tasks" :key="task.id" :data-task-id="task.id">
        <TaskCard :task="task" :done="status.is_done" @open="emit('open', $event)" />
      </li>
    </ul>
  </section>
</template>
