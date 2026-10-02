import type { TaskPriority } from '../types'

// Kelas ditulis utuh supaya terdeteksi Tailwind.
export const TASK_PRIORITY_META: Record<TaskPriority, { label: string; badge: string; rank: number }> = {
  Low: { label: 'Low', badge: 'bg-muted text-muted-foreground', rank: 0 },
  Medium: { label: 'Medium', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300', rank: 1 },
  High: { label: 'High', badge: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300', rank: 2 },
  Urgent: { label: 'Urgent', badge: 'bg-red-600 text-white', rank: 3 },
}
