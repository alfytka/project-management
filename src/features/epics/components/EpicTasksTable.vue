<script setup lang="ts">
import { Search } from '@lucide/vue'
import { computed, ref } from 'vue'
import { Input } from '@/components/ui/input'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'
import TaskList from '@/features/tasks/components/TaskList.vue'
import type { Task } from '@/features/tasks/types'

type DoneFilter = 'all' | 'open' | 'done'

const props = defineProps<{
  tasks: Task[]
  statuses: Status[]
  colorOf: (statusId: string) => StatusColor
  isDone: (statusId: string) => boolean
}>()

const emit = defineEmits<{ open: [task: Task] }>()

const search = ref('')
const doneFilter = ref<DoneFilter>('all')

const filters: { value: DoneFilter; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'open', label: 'Belum selesai' },
  { value: 'done', label: 'Selesai' },
]

const filteredTasks = computed(() => {
  const query = search.value.trim().toLowerCase()
  return props.tasks.filter(
    (task) =>
      (doneFilter.value === 'all' || props.isDone(task.status_id) === (doneFilter.value === 'done')) &&
      (!query || task.title.toLowerCase().includes(query)),
  )
})

const segmentClass =
  'inline-flex h-8 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs sm:flex-none'
</script>

<template>
  <section class="overflow-hidden rounded-2xl border bg-card shadow-xs">
    <div class="flex flex-wrap items-center gap-3 p-4 sm:px-6">
      <h2 class="text-lg font-semibold">Task di module ini</h2>
      <span class="rounded-md bg-muted px-1.5 text-xs font-medium tabular-nums text-muted-foreground">
        {{ tasks.length }}
      </span>

      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center lg:ml-auto">
        <div class="flex items-center rounded-lg bg-muted p-1" role="tablist" aria-label="Filter task">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            role="tab"
            :aria-selected="doneFilter === filter.value"
            :data-active="doneFilter === filter.value"
            :class="segmentClass"
            @click="doneFilter = filter.value"
          >
            {{ filter.label }}
          </button>
        </div>
        <div class="relative w-full sm:w-64">
          <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="module-task-search"
            v-model="search"
            name="module-task-search"
            type="search"
            autocomplete="off"
            placeholder="Cari task..."
            aria-label="Cari task di module ini"
            class="h-10 pl-9"
          />
        </div>
      </div>
    </div>

    <TaskList
      :tasks="filteredTasks"
      :statuses="statuses"
      :color-of="colorOf"
      :is-done="isDone"
      :empty-text="tasks.length ? 'Tidak ada task yang cocok dengan filter.' : 'Belum ada task di module ini.'"
      @open="emit('open', $event)"
    />
  </section>
</template>
