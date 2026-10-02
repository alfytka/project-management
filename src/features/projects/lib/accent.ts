import { hashString } from '@/lib/avatar'

export interface ProjectAccent {
  /** Titik warna di sidebar. */
  dot: string
  /** Ikon tinted (card list). */
  soft: string
  /** Ikon solid (header detail). */
  solid: string
  /** Isi progress bar. */
  bar: string
}

// Kelas ditulis utuh supaya terdeteksi Tailwind.
const ACCENTS: ProjectAccent[] = [
  {
    dot: 'bg-violet-600',
    soft: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
    solid: 'bg-violet-600 text-white',
    bar: 'bg-violet-600',
  },
  {
    dot: 'bg-teal-600',
    soft: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
    solid: 'bg-teal-600 text-white',
    bar: 'bg-teal-600',
  },
  {
    dot: 'bg-orange-600',
    soft: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
    solid: 'bg-orange-600 text-white',
    bar: 'bg-orange-600',
  },
  {
    dot: 'bg-pink-600',
    soft: 'bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300',
    solid: 'bg-pink-600 text-white',
    bar: 'bg-pink-600',
  },
  {
    dot: 'bg-blue-700',
    soft: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    solid: 'bg-blue-700 text-white',
    bar: 'bg-blue-700',
  },
]

/**
 * Aksen berdasarkan posisi project (urut `created_at`, terlama dulu) supaya project-project awal
 * dijamin mendapat warna berbeda. `index` negatif (project tidak ada di daftar) → fallback hash id.
 */
export function getProjectAccent(id: string, index = -1): ProjectAccent {
  const position = index >= 0 ? index : hashString(id)
  return ACCENTS[position % ACCENTS.length]!
}
