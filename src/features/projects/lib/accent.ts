const ACCENTS = [
  'from-sky-400 to-blue-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
]

export function getProjectAccent(id: string) {
  const hash = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return ACCENTS[hash % ACCENTS.length]
}
