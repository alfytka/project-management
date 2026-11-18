import { describe, expect, it } from 'vitest'
import {
  buildMentionTargets,
  descriptionToDoc,
  docToDescription,
  parseDescription,
  resolveMentions,
  type MentionTarget,
} from './description'

const budi: MentionTarget = { user_id: 'u-budi', name: 'Budi', email: 'budi@example.com' }
const rina: MentionTarget = { user_id: 'u-rina', name: 'Rina', email: 'rina@example.com' }

describe('parseDescription', () => {
  it('memecah beberapa mention dalam satu teks', () => {
    expect(parseDescription('Tolong @budi@example.com dan @rina@example.com cek', [budi, rina])).toEqual([
      { type: 'text', text: 'Tolong ' },
      { type: 'mention', target: budi },
      { type: 'text', text: ' dan ' },
      { type: 'mention', target: rina },
      { type: 'text', text: ' cek' },
    ])
  })

  it('menyisakan titik di akhir kalimat sebagai teks', () => {
    expect(parseDescription('Cek @budi@example.com.', [budi])).toEqual([
      { type: 'text', text: 'Cek ' },
      { type: 'mention', target: budi },
      { type: 'text', text: '.' },
    ])
  })

  it('membiarkan email yang tidak ada di target sebagai teks biasa', () => {
    const text = 'Hubungi @vendor@example.com atau vendor@example.com'
    expect(parseDescription(text, [budi])).toEqual([{ type: 'text', text }])
  })

  it('mencocokkan email tanpa memedulikan huruf besar', () => {
    expect(parseDescription('@Budi@Example.com', [budi])).toEqual([{ type: 'mention', target: budi }])
  })
})

describe('resolveMentions', () => {
  it('mengembalikan target unik sesuai urutan kemunculan', () => {
    const text = '@rina@example.com lalu @budi@example.com dan @rina@example.com lagi'
    expect(resolveMentions(text, [budi, rina])).toEqual([rina, budi])
  })
})

describe('buildMentionTargets', () => {
  it('menandai user yang bukan member lagi sebagai inactive', () => {
    const targets = buildMentionTargets([{ ...budi }, { ...rina }], [budi])
    expect(targets.map((target) => [target.user_id, target.inactive])).toEqual([
      ['u-budi', false],
      ['u-rina', true],
    ])
  })

  it('tidak menandai siapa pun inactive selama daftar member belum dimuat (masih kosong)', () => {
    const targets = buildMentionTargets([{ ...budi }, { ...rina }], [])
    expect(targets.every((target) => !target.inactive)).toBe(true)
  })

  it('menambahkan member sebagai cadangan bila diminta', () => {
    expect(buildMentionTargets([], [budi], { includeMembers: true })).toEqual([budi])
  })
})

describe('descriptionToDoc / docToDescription', () => {
  it('round-trip teks multi-baris dengan mention', () => {
    const text = 'Baris satu @budi@example.com.\n\nBaris tiga @rina@example.com'
    const doc = descriptionToDoc(text, [budi, rina])

    expect(doc.content).toHaveLength(3)
    expect(doc.content![0]!.content![1]).toEqual({
      type: 'mention',
      attrs: { id: 'budi@example.com', label: 'Budi', inactive: false },
    })
    expect(doc.content![1]).toEqual({ type: 'paragraph' })
    expect(docToDescription(doc)).toBe(text)
  })

  it('menyisipkan spasi bila teks setelah mention akan tersambung ke email', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'mention', attrs: { id: 'budi@example.com', label: 'Budi', inactive: false } },
            { type: 'text', text: 'abc' },
          ],
        },
      ],
    }
    expect(docToDescription(doc)).toBe('@budi@example.com abc')
  })

  it('tidak menyisipkan spasi sebelum tanda baca', () => {
    const doc = descriptionToDoc('@budi@example.com, ok', [budi])
    expect(docToDescription(doc)).toBe('@budi@example.com, ok')
  })
})
