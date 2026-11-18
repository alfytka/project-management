/** "1"…"99", lalu "99+"; kosong bila 0/belum dimuat. */
export function formatBadgeCount(count: number | undefined) {
  if (!count) return ''
  return count > 99 ? '99+' : String(count)
}
