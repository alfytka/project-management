import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from '@tanstack/vue-table'
import { h } from 'vue'
import AvatarStack from '@/components/AvatarStack.vue'
import type { StatusColor } from '@/features/statuses/lib/color'
import TaskDueDate from './components/TaskDueDate.vue'
import TaskPriorityBadge from './components/TaskPriorityBadge.vue'
import TaskStatusBadge from './components/TaskStatusBadge.vue'
import { TASK_PRIORITY_META } from './lib/priority'
import type { Task } from './types'

export const taskTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { basic: sortFn_basic, text: sortFn_text },
})

const column = createColumnHelper<typeof taskTableFeatures, Task>()

interface TaskColumnOptions {
  showEpic: boolean
  colorOf: (statusId: string) => StatusColor
  isDone: (statusId: string) => boolean
  /** Posisi status (sesuai `order`) untuk sorting kolom status. */
  statusRank: (statusId: string) => number
}

export function createTaskColumns({ showEpic, colorOf, isDone, statusRank }: TaskColumnOptions) {
  return column.columns([
    column.accessor('title', {
      header: 'Task',
      sortFn: 'text',
      cell: ({ row }) =>
        h(
          'span',
          { class: ['font-medium', isDone(row.original.status_id) && 'text-muted-foreground line-through'] },
          row.original.title,
        ),
    }),
    ...(showEpic
      ? [
          column.accessor((task) => task.epic?.title ?? '', {
            id: 'epic',
            header: 'Module',
            sortFn: 'text',
            cell: ({ getValue }) => h('span', { class: 'text-muted-foreground' }, getValue()),
          }),
        ]
      : []),
    column.accessor((task) => statusRank(task.status_id), {
      id: 'status',
      header: 'Status',
      sortFn: 'basic',
      cell: ({ row }) =>
        h(TaskStatusBadge, { name: row.original.status.name, color: colorOf(row.original.status_id) }),
    }),
    column.accessor((task) => TASK_PRIORITY_META[task.priority]?.rank ?? 0, {
      id: 'priority',
      header: 'Prioritas',
      sortFn: 'basic',
      cell: ({ row }) => h(TaskPriorityBadge, { priority: row.original.priority }),
    }),
    column.accessor((task) => task.assignees[0]?.name ?? '', {
      id: 'assignee',
      header: 'Assignee',
      sortFn: 'text',
      cell: ({ row }) => {
        const [first, ...rest] = row.original.assignees
        if (!first) return h('span', { class: 'text-muted-foreground' }, '—')
        return h('div', { class: 'flex items-center gap-2' }, [
          h(AvatarStack, { users: row.original.assignees.map((a) => ({ id: a.user_id, name: a.name })), max: 3 }),
          rest.length ? null : h('span', { class: 'truncate' }, first.name),
        ])
      },
    }),
    column.accessor((task) => task.due_date ?? '9999', {
      id: 'due_date',
      header: 'Due Date',
      sortFn: 'text',
      cell: ({ row }) =>
        h(TaskDueDate, { dueDate: row.original.due_date, done: isDone(row.original.status_id) }),
    }),
  ])
}
