import type { JSONContent } from '@tiptap/core'

/**
 * Format mention di `description`: `@<email>`. Regex sama persis dengan parser backend
 * (`parseMentionEmails`), termasuk perilaku `@a@b.com.` → email `a@b.com`, titik tetap teks.
 */
export const MENTION_PATTERN = /@([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g

/** User yang boleh dirender sebagai chip mention. */
export interface MentionTarget {
  user_id: string
  name: string
  email: string
  /** Sudah bukan member project: chip abu-abu (tetap nama, bukan email). */
  inactive?: boolean
}

export type DescriptionSegment =
  | { type: 'text'; text: string }
  | { type: 'mention'; target: MentionTarget }

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

interface MemberLike {
  user_id: string
  name: string
  email: string
}

/**
 * Susun target render. `mentions` (dari response task) selalu didahulukan; user di dalamnya
 * yang bukan member lagi ditandai `inactive`. `includeMembers` menambahkan semua member
 * sebagai cadangan, dipakai editor untuk `@email` yang baru diketik dan belum tersimpan.
 */
export function buildMentionTargets(
  mentions: readonly MemberLike[],
  members: readonly MemberLike[],
  { includeMembers = false } = {},
): MentionTarget[] {
  const memberIds = new Set(members.map((member) => member.user_id))
  // User yang melihat task pasti member project, jadi daftar member yang sudah dimuat tidak pernah
  // kosong. Kosong = project belum dimuat: jangan tandai siapa pun sebagai bukan member.
  const membersLoaded = memberIds.size > 0
  const targets: MentionTarget[] = mentions.map(({ user_id, name, email }) => ({
    user_id,
    name,
    email,
    inactive: membersLoaded && !memberIds.has(user_id),
  }))
  if (includeMembers) targets.push(...members.map(({ user_id, name, email }) => ({ user_id, name, email })))
  return targets
}

function indexTargets(targets: MentionTarget[]) {
  const map = new Map<string, MentionTarget>()
  for (const target of targets) {
    const key = normalizeEmail(target.email)
    // Target pertama menang: pemanggil menaruh sumber utama (array `mentions`) di depan.
    if (!map.has(key)) map.set(key, target)
  }
  return map
}

/**
 * Pecah teks jadi segmen teks & mention. Hanya `@email` yang ada di `targets` yang menjadi
 * mention; email lain tetap teks biasa (alamat email, bukan mention).
 */
export function parseDescription(text: string, targets: MentionTarget[]): DescriptionSegment[] {
  const lookup = indexTargets(targets)
  const segments: DescriptionSegment[] = []
  let buffer = ''
  let lastIndex = 0

  for (const match of text.matchAll(MENTION_PATTERN)) {
    const target = lookup.get(normalizeEmail(match[1]!))
    if (!target) continue
    buffer += text.slice(lastIndex, match.index)
    if (buffer) segments.push({ type: 'text', text: buffer })
    buffer = ''
    segments.push({ type: 'mention', target })
    lastIndex = match.index! + match[0].length
  }

  buffer += text.slice(lastIndex)
  if (buffer) segments.push({ type: 'text', text: buffer })
  return segments
}

/** Target unik yang ter-mention di teks, urut kemunculan pertama. */
export function resolveMentions(text: string, targets: MentionTarget[]): MentionTarget[] {
  const found = new Map<string, MentionTarget>()
  for (const segment of parseDescription(text, targets)) {
    if (segment.type === 'mention' && !found.has(segment.target.user_id)) found.set(segment.target.user_id, segment.target)
  }
  return [...found.values()]
}

/** Atribut node mention TipTap: `id` = email (yang diserialisasi), `label` = nama (yang tampil). */
export interface MentionNodeAttrs {
  id: string
  label: string
  inactive: boolean
}

/** Teks tersimpan → dokumen TipTap (satu paragraf per baris). */
export function descriptionToDoc(text: string, targets: MentionTarget[]): JSONContent {
  return {
    type: 'doc',
    content: text.split('\n').map((line) => {
      const content: JSONContent[] = parseDescription(line, targets).map((segment) =>
        segment.type === 'text'
          ? { type: 'text', text: segment.text }
          : {
              type: 'mention',
              attrs: {
                id: segment.target.email,
                label: segment.target.name,
                inactive: !!segment.target.inactive,
              } satisfies MentionNodeAttrs,
            },
      )
      return content.length ? { type: 'paragraph', content } : { type: 'paragraph' }
    }),
  }
}

/**
 * Karakter yang, bila menempel langsung di belakang `@email`, akan ikut terbaca sebagai bagian
 * email oleh parser backend (mis. chip lalu "abc" → `@budi@x.comabc`).
 */
const EMAIL_CONTINUATION = /^(?:[A-Za-z0-9_%+-]|\.[A-Za-z0-9])/

/** Dokumen TipTap → teks tersimpan (`@email` untuk tiap mention, baris dipisah `\n`). */
export function docToDescription(doc: JSONContent): string {
  return (doc.content ?? [])
    .map((block) => {
      const nodes = block.content ?? []
      let line = ''
      nodes.forEach((node, index) => {
        if (node.type === 'mention') {
          line += `@${(node.attrs as MentionNodeAttrs).id}`
          const next = nodes[index + 1]
          if (next?.type === 'text' && EMAIL_CONTINUATION.test(next.text ?? '')) line += ' '
        } else if (node.type === 'text') {
          line += node.text ?? ''
        } else if (node.type === 'hardBreak') {
          line += '\n'
        }
      })
      return line
    })
    .join('\n')
}
