import { isAxiosError } from 'axios'

/**
 * Bentuk error dari backend (NestJS):
 * `{ message: string | string[], error: string, statusCode: number }`.
 * `message` berupa array untuk validation error (400) — tiap item satu pesan,
 * tanpa nama field yang terstruktur, jadi ditampilkan sebagai satu pesan gabungan.
 */
interface ApiErrorBody {
  message?: string | string[]
  error?: string
  statusCode?: number
}

const CONCURRENT = 'Data sedang diubah pengguna lain, silakan coba lagi'

/**
 * Pesan backend (bahasa Inggris) yang bisa sampai ke user → bahasa Indonesia, supaya toast
 * konsisten dengan UI. Dicocokkan persis; pesan lain ditampilkan apa adanya.
 */
const SERVER_MESSAGES: Record<string, string> = {
  'Invalid email or password': 'Email atau password salah',
  'Email already registered': 'Email sudah terdaftar',
  'Invalid or expired token': 'Sesi Anda sudah berakhir, silakan masuk lagi',
  'Not a member of this project': 'Anda bukan member project ini',
  'Only project admin can perform this action': 'Hanya admin project yang bisa melakukan ini',
  'Project not found': 'Project tidak ditemukan',
  'Epic not found': 'Module tidak ditemukan',
  'Task not found': 'Task tidak ditemukan',
  'Status not found': 'Status tidak ditemukan',
  'Attachment not found': 'Lampiran tidak ditemukan',
  'Mention not found': 'Mention tidak ditemukan',
  'User not found': 'Email belum terdaftar di aplikasi',
  'User is already a member of this project': 'Pengguna ini sudah menjadi member project',
  'Member not found in this project': 'Member tidak ditemukan di project ini',
  'Cannot demote the last admin of the project': 'Admin terakhir tidak bisa diturunkan menjadi member',
  'Cannot remove the last admin of the project': 'Admin terakhir tidak bisa dihapus dari project',
  'Cannot remove yourself as the last admin of the project': 'Anda admin terakhir, jadi tidak bisa keluar dari project',
  'User is not a member of this project': 'Pengguna ini bukan member project',
  'User is already assigned to this task': 'Member ini sudah menjadi assignee task',
  'Assignee not found on this task': 'Member ini sudah tidak menjadi assignee task',
  'Status still has tasks, move them to another status first':
    'Status masih dipakai task. Pindahkan task-nya ke status lain dulu.',
  'Project must have at least one status': 'Project harus punya minimal satu status',
  'Set another status as default first': 'Jadikan status lain sebagai default terlebih dahulu',
  'Project has no default status': 'Project belum punya status default',
  'Invalid status for this project': 'Status tidak berlaku untuk project ini',
  'Epic still has tasks, move or delete them first': 'Module masih punya task. Pindahkan atau hapus task-nya dulu.',
  'end_date must be after start_date': 'Tanggal Selesai tidak boleh sebelum Tanggal Mulai',
  'Attachment limit reached (50 per project)': 'Batas 50 lampiran per project sudah tercapai',
  'This link is already attached to the project': 'Link ini sudah dilampirkan di project ini',
  'You are not allowed to modify this attachment': 'Anda tidak punya akses untuk mengubah lampiran ini',
  'URL hostname exceeds 150 characters; provide a shorter title':
    'Nama domain URL terlalu panjang, isi judul yang lebih pendek',
  'Project members changed concurrently, please retry': CONCURRENT,
  'Task or project members changed concurrently, please retry': CONCURRENT,
  'Statuses changed concurrently, please retry': CONCURRENT,
  'Epic is being modified concurrently, please retry': CONCURRENT,
  'Attachment data changed concurrently, please retry': CONCURRENT,
  'Internal server error': 'Terjadi kesalahan di server, coba lagi nanti',
}

export function translateServerMessage(message: string) {
  return SERVER_MESSAGES[message.trim()] ?? message
}

/**
 * True kalau request tidak pernah sampai mendapat response (server mati,
 * CORS diblokir browser, dll) — beda kasus dengan error dari server (401/400/dst).
 */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response
}

/**
 * Ambil pesan `message` dari response error backend, selain itu pakai `fallback`.
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError<ApiErrorBody>(error)) return fallback

  const message = error.response?.data?.message
  if (Array.isArray(message) && message.length) return message.map(translateServerMessage).join(', ')
  if (typeof message === 'string' && message) return translateServerMessage(message)
  return fallback
}

/**
 * Pesan siap tampil untuk toast: bedakan server tidak terjangkau vs error dari server.
 */
export function toErrorToast(error: unknown, fallback: string): string {
  return isNetworkError(error)
    ? 'Tidak dapat terhubung ke server'
    : extractErrorMessage(error, fallback)
}
