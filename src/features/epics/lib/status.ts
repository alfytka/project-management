import { diffInDays, parseDateOnly, startOfToday } from '@/lib/date'
import type { EpicListItem, EpicStatus } from '../types'

type EpicDates = Pick<EpicListItem, 'start_date' | 'end_date' | 'progress'>

export function getEpicStatus(epic: EpicDates, today = startOfToday()): EpicStatus {
  if (epic.progress >= 100) return 'done'
  if (parseDateOnly(epic.end_date) < today) return 'late'
  if (parseDateOnly(epic.start_date) > today) return 'not_started'
  return 'in_progress'
}

// Kelas ditulis utuh supaya terdeteksi Tailwind.
export const EPIC_STATUS_META: Record<
  EpicStatus,
  { label: string; badge: string; dot: string; bar: string; track: string }
> = {
  in_progress: {
    label: 'Berjalan',
    badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    dot: 'bg-blue-600',
    bar: 'bg-blue-700',
    track: 'bg-blue-700/20',
  },
  late: {
    label: 'Terlambat',
    badge: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    dot: 'bg-red-600',
    bar: 'bg-red-600',
    track: 'bg-red-600/20',
  },
  done: {
    label: 'Selesai',
    badge: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300',
    dot: 'bg-green-600',
    bar: 'bg-green-700',
    track: 'bg-green-700/20',
  },
  not_started: {
    label: 'Belum mulai',
    badge: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground/60',
    bar: 'bg-muted-foreground/30',
    track: 'bg-muted',
  },
}

export const EPIC_STATUS_ORDER: EpicStatus[] = ['in_progress', 'late', 'done', 'not_started']

/** Keterangan jadwal di samping rentang tanggal: "16 hari lagi", "Lewat 2 hari", dst. */
export function getEpicSchedule(epic: EpicDates, today = startOfToday()) {
  const status = getEpicStatus(epic, today)
  if (status === 'done') return { label: 'Selesai', late: false }
  if (status === 'late') return { label: `Lewat ${diffInDays(parseDateOnly(epic.end_date), today)} hari`, late: true }
  if (status === 'not_started') {
    return { label: `Mulai dalam ${diffInDays(today, parseDateOnly(epic.start_date))} hari`, late: false }
  }
  const left = diffInDays(today, parseDateOnly(epic.end_date))
  return { label: left === 0 ? 'Berakhir hari ini' : `${left} hari lagi`, late: false }
}

/** Posisi hari ini di rentang epic: "Hari ke-14 dari 31". */
export function getEpicTimeline(epic: EpicDates, today = startOfToday()) {
  const start = parseDateOnly(epic.start_date)
  const end = parseDateOnly(epic.end_date)
  const totalDays = diffInDays(start, end) + 1
  const elapsed = Math.min(totalDays, Math.max(0, diffInDays(start, today) + 1))
  return {
    totalDays,
    elapsed,
    remaining: Math.max(0, diffInDays(today, end)),
    percent: Math.round((elapsed / totalDays) * 100),
  }
}

/** Progress keseluruhan project = task selesai / total task seluruh epic. */
export function summarizeEpics(epics: EpicListItem[]) {
  const total = epics.reduce((sum, epic) => sum + epic.task_total, 0)
  const done = epics.reduce((sum, epic) => sum + epic.task_done, 0)
  return { total, done, open: total - done, progress: total ? Math.round((done / total) * 100) : 0 }
}
