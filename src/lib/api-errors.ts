import { isAxiosError } from 'axios'

export interface ValidationIssue {
  field: string
  message: string
}

/**
 * FastAPI mengembalikan 422 dengan bentuk `{ detail: [{ loc, msg, type }] }`.
 * Mengembalikan null kalau error bukan validation error 422.
 */
export function extractValidationIssues(error: unknown): ValidationIssue[] | null {
  if (!isAxiosError(error) || error.response?.status !== 422) return null

  const detail = error.response.data?.detail
  if (!Array.isArray(detail)) return null

  return detail.map((issue: { loc: Array<string | number>; msg: string }) => ({
    field: String(issue.loc.at(-1)),
    message: issue.msg,
  }))
}

/**
 * True kalau request tidak pernah sampai mendapat response (server mati,
 * CORS diblokir browser, dll) — beda kasus dengan error dari server (401/422/dst).
 */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response
}

/**
 * Ambil pesan `detail` bila server mengirim string (mis. HTTPException FastAPI 404/409),
 * selain itu pakai `fallback`.
 */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error) && typeof error.response?.data?.detail === 'string') {
    return error.response.data.detail
  }
  return fallback
}
