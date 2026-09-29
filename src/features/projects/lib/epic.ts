import type { Epic, EpicStatus } from '../types'

export function getEpicProgress(epic: Epic) {
  return epic.task_count ? Math.round((epic.task_done_count / epic.task_count) * 100) : 0
}

export function getEpicStatus(epic: Epic, today = new Date()): EpicStatus {
  const progress = getEpicProgress(epic)
  if (progress === 100) return 'done'
  if (new Date(epic.end_date) < today) return 'late'
  if (progress === 0 && new Date(epic.start_date) > today) return 'not_started'
  return 'in_progress'
}

// Kelas ditulis utuh supaya terdeteksi Tailwind.
export const EPIC_STATUS_META: Record<
  EpicStatus,
  { label: string; text: string; bar: string; track: string }
> = {
  done: { label: 'Selesai', text: 'text-muted-foreground', bar: 'bg-green-700', track: 'bg-green-700/20' },
  late: { label: 'Terlambat', text: 'text-red-600', bar: 'bg-red-600', track: 'bg-red-600/20' },
  in_progress: { label: 'Berjalan', text: 'text-muted-foreground', bar: 'bg-blue-700', track: 'bg-blue-700/20' },
  not_started: { label: 'Belum mulai', text: 'text-muted-foreground', bar: 'bg-muted-foreground/30', track: 'bg-muted' },
}

/** Progress keseluruhan project = task selesai / total task seluruh epic. */
export function summarizeEpics(epics: Epic[]) {
  const total = epics.reduce((sum, epic) => sum + epic.task_count, 0)
  const done = epics.reduce((sum, epic) => sum + epic.task_done_count, 0)
  return { total, done, progress: total ? Math.round((done / total) * 100) : 0 }
}
