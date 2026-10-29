/** Hanya http:// dan https:// (sama dengan aturan backend). Skema lain seperti `javascript:` ditolak. */
export function isHttpUrl(value: string) {
  if (!/^https?:\/\//i.test(value)) return false
  try {
    const { protocol, username, password } = new URL(value)
    return (protocol === 'http:' || protocol === 'https:') && !username && !password
  } catch {
    return false
  }
}

export function getDomain(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return value
  }
}
