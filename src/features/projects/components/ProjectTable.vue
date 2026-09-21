<script setup lang="ts">
import { FlexRender, useTable } from '@tanstack/vue-table'
import { computed } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getProjectColumns, projectTableFeatures } from '../columns'
import type { ProjectListItem } from '../types'

const props = defineProps<{
  data: ProjectListItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [project: ProjectListItem]
  delete: [project: ProjectListItem]
}>()

const columns = getProjectColumns({
  onEdit: (project) => emit('edit', project),
  onDelete: (project) => emit('delete', project),
})

const data = computed(() => props.data)

const table = useTable({
  features: projectTableFeatures,
  columns,
  data,
})
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <TableHead v-for="header in headerGroup.headers" :key="header.id">
          <FlexRender v-if="!header.isPlaceholder" :header="header" />
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-if="loading">
        <TableRow v-for="n in 4" :key="n">
          <TableCell :colspan="columns.length"><Skeleton class="h-6 w-full" /></TableCell>
        </TableRow>
      </template>
      <template v-else-if="table.getRowModel().rows.length">
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
          <TableCell v-for="cell in row.getAllCells()" :key="cell.id">
            <FlexRender :cell="cell" />
          </TableCell>
        </TableRow>
      </template>
      <TableEmpty v-else :colspan="columns.length">Belum ada project.</TableEmpty>
    </TableBody>
  </Table>
</template>
