const DAY = 24 * 60 * 60 * 1000

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(iso))
}

const relativeFormatter = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' })

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** "10 menit yang lalu", "kemarin", dst. */
export function formatRelative(iso: string, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(seconds) >= size) return relativeFormatter.format(Math.round(seconds / size), unit)
  }
  return 'baru saja'
}

// --- Tanggal tanpa jam -------------------------------------------------------
// Backend mengirim kolom DATE sebagai "2026-10-01T00:00:00.000Z". Kalau di-parse apa adanya,
// user di zona waktu barat UTC melihat tanggal mundur sehari. Ambil bagian tanggalnya saja
// dan jadikan tengah malam waktu lokal.

/** "2026-10-01T00:00:00.000Z" → Date 1 Okt 2026 00:00 waktu lokal. */
export function parseDateOnly(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year!, month! - 1, day!)
}

/** Nilai untuk `<input type="date">` / payload API: "2026-10-01". */
export function toDateInput(iso: string) {
  return iso.slice(0, 10)
}

export function startOfToday(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Selisih hari kalender `to - from` (keduanya tengah malam lokal). */
export function diffInDays(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / DAY)
}

const dayMonth = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })
const dayMonthYear = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

/** "15 Sep – 15 Okt 2026"; tahun awal ikut ditulis bila beda tahun. */
export function formatDateRange(startIso: string, endIso: string) {
  const start = parseDateOnly(startIso)
  const end = parseDateOnly(endIso)
  const startLabel = start.getFullYear() === end.getFullYear() ? dayMonth.format(start) : dayMonthYear.format(start)
  return `${startLabel} – ${dayMonthYear.format(end)}`
}

/** "1 Okt 2026" untuk kolom DATE. */
export function formatDateOnly(iso: string) {
  return dayMonthYear.format(parseDateOnly(iso))
}
