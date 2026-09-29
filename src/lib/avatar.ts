const AVATAR_COLORS = ['bg-pink-600', 'bg-teal-600', 'bg-orange-600', 'bg-blue-700', 'bg-violet-600']

function hashString(value: string) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

/** Warna latar avatar yang stabil untuk id yang sama. */
export function getAvatarColor(id: string) {
  return AVATAR_COLORS[hashString(id) % AVATAR_COLORS.length]
}

/**
 * Inisial dua huruf: "Rina Sari" → "RS", "Manges" → "MG" (huruf pertama + konsonan berikutnya).
 */
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return '?'
  if (words.length > 1) return (words[0]![0]! + words[1]![0]!).toUpperCase()

  const word = words[0]!
  const consonant = word.slice(1).match(/[b-df-hj-np-tv-z]/i)?.[0]
  return (word[0]! + (consonant ?? word[1] ?? '')).toUpperCase()
}
