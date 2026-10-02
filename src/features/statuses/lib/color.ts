import type { Status } from '../types'

export interface StatusColor {
  badge: string
  dot: string
}

// Kelas ditulis utuh supaya terdeteksi Tailwind. Urutan mengikuti Figma: To Do, In Progress, Review, ...
const PALETTE: StatusColor[] = [
  { badge: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground/60' },
  { badge: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300', dot: 'bg-blue-600' },
  { badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300', dot: 'bg-orange-600' },
  { badge: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300', dot: 'bg-violet-600' },
  { badge: 'bg-pink-50 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300', dot: 'bg-pink-600' },
  { badge: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300', dot: 'bg-teal-600' },
]

const DONE: StatusColor = {
  badge: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300',
  dot: 'bg-green-600',
}

/**
 * Status kustom tidak punya warna dari backend. Warna diturunkan dari posisinya di antara status
 * yang belum selesai; status `is_done` selalu hijau. `statuses` harus terurut sesuai `order`.
 */
export function buildStatusColors(statuses: Status[]) {
  const colors = new Map<string, StatusColor>()
  let index = 0
  for (const status of statuses) {
    colors.set(status.id, status.is_done ? DONE : PALETTE[index++ % PALETTE.length]!)
  }
  return colors
}

export const FALLBACK_STATUS_COLOR = PALETTE[0]!

export const DEFAULT_STATUSES = [
  { name: 'To Do', is_default: true, is_done: false },
  { name: 'In Progress', is_default: false, is_done: false },
  { name: 'Done', is_default: false, is_done: true },
] as const
