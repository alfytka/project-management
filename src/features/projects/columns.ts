import { createColumnHelper, tableFeatures } from '@tanstack/vue-table'
import { Pencil, Trash2 } from '@lucide/vue'
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import type { ProjectListItem } from './types'

export const projectTableFeatures = tableFeatures({})

const columnHelper = createColumnHelper<typeof projectTableFeatures, ProjectListItem>()

export interface ProjectColumnActions {
  onEdit: (project: ProjectListItem) => void
  onDelete: (project: ProjectListItem) => void
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(iso))
}

export function getProjectColumns({ onEdit, onDelete }: ProjectColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor('name', {
      header: 'Nama',
      cell: ({ row }) =>
        h('div', { class: 'space-y-0.5' }, [
          h(
            RouterLink,
            {
              to: { name: 'project-detail', params: { id: row.original.id } },
              class: 'font-medium hover:underline',
            },
            () => row.original.name,
          ),
          row.original.description
            ? h('p', { class: 'text-muted-foreground line-clamp-1 text-xs' }, row.original.description)
            : null,
        ]),
    }),
    columnHelper.accessor('my_role', {
      header: 'Role Saya',
      cell: ({ getValue }) => h('span', { class: 'capitalize' }, getValue()),
    }),
    columnHelper.accessor('member_count', { header: 'Member' }),
    columnHelper.accessor('created_at', {
      header: 'Dibuat',
      cell: ({ getValue }) => formatDate(getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        row.original.my_role === 'admin'
          ? h('div', { class: 'flex justify-end gap-1' }, [
              h(
                Button,
                {
                  variant: 'ghost',
                  size: 'icon',
                  'aria-label': 'Edit project',
                  onClick: () => onEdit(row.original),
                },
                () => h(Pencil),
              ),
              h(
                Button,
                {
                  variant: 'ghost',
                  size: 'icon',
                  'aria-label': 'Hapus project',
                  onClick: () => onDelete(row.original),
                },
                () => h(Trash2),
              ),
            ])
          : null,
    }),
  ])
}
