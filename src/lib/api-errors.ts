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
  if (Array.isArray(message) && message.length) return message.join(', ')
  if (typeof message === 'string' && message) return message
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
