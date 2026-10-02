<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpDown } from '@lucide/vue'
import { FlexRender, useTable } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useIsDesktop } from '@/composables/useIsDesktop'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'
import { createTaskColumns, taskTableFeatures } from '../columns'
import type { Task } from '../types'
import TaskCard from './TaskCard.vue'

const props = defineProps<{
  tasks: Task[]
  statuses: Status[]
  colorOf: (statusId: string) => StatusColor
  isDone: (statusId: string) => boolean
  showEpic?: boolean
  emptyText: string
}>()

const emit = defineEmits<{ open: [task: Task] }>()

const isDesktop = useIsDesktop()

const statusRank = computed(() => new Map(props.statuses.map((status, index) => [status.id, index])))

// Kolom dibuat sekali; fungsi di dalamnya membaca props/computed saat render sehingga tetap reaktif.
const columns = createTaskColumns({
  showEpic: !!props.showEpic,
  colorOf: (id) => props.colorOf(id),
  isDone: (id) => props.isDone(id),
  statusRank: (id) => statusRank.value.get(id) ?? Number.MAX_SAFE_INTEGER,
})

const table = useTable({
  features: taskTableFeatures,
  columns,
  data: computed(() => props.tasks),
})

const rows = computed(() => table.getRowModel().rows)
</script>

<template>
  <!-- Mobile: daftar kartu, tabel 6 kolom terlalu lebar untuk layar HP. -->
  <ul v-if="!isDesktop" class="space-y-2 p-3">
    <li v-for="row in rows" :key="row.id">
      <TaskCard
        :task="row.original"
        :done="isDone(row.original.status_id)"
        :status-color="colorOf(row.original.status_id)"
        @open="emit('open', $event)"
      />
    </li>
    <li v-if="!rows.length" class="py-10 text-center text-sm text-muted-foreground">{{ emptyText }}</li>
  </ul>

  <Table v-else>
    <TableHeader class="bg-muted/50">
      <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id" class="hover:bg-transparent">
        <TableHead v-for="header in headerGroup.headers" :key="header.id" class="h-11 first:pl-6 last:pr-6">
          <button
            type="button"
            class="-ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-accent hover:text-foreground"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <FlexRender :header="header" />
            <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="size-3.5" />
            <ArrowDown v-else-if="header.column.getIsSorted() === 'desc'" class="size-3.5" />
            <ArrowUpDown v-else class="size-3.5 opacity-40" />
          </button>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="row in rows"
        :key="row.id"
        class="cursor-pointer"
        tabindex="0"
        @click="emit('open', row.original)"
        @keydown.enter="emit('open', row.original)"
      >
        <TableCell v-for="cell in row.getAllCells()" :key="cell.id" class="h-14 first:pl-6 last:pr-6">
          <FlexRender :cell="cell" />
        </TableCell>
      </TableRow>
      <TableRow v-if="!rows.length" class="hover:bg-transparent">
        <TableCell :colspan="columns.length" class="h-32 text-center text-muted-foreground">{{ emptyText }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
