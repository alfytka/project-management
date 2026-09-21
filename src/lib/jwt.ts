/**
 * Best-effort JWT payload decoder. Backend belum punya endpoint `/users/me`,
 * jadi ini dipakai sebagai fallback untuk menampilkan info user (mis. email)
 * dari claim token. Ganti dengan panggilan `/users/me` begitu tersedia.
 */
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )

    return JSON.parse(json)
  } catch {
    return null
  }
}
