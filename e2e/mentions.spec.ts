import { test, expect, type Page, type Request } from '@playwright/test'
import type { MentionInboxItem, TaskMention } from '../src/features/mentions/types'
import type { Task } from '../src/features/tasks/types'

test.use({ headless: true, timezoneId: 'Asia/Jakarta' })

const admin = { user_id: 'u-admin', name: 'Admin Demo', email: 'admin@example.com', role: 'admin' }
const budi = { user_id: 'u-budi', name: 'Budi Santoso', email: 'budi@example.com', role: 'member' }
const dewi = { user_id: 'u-dewi', name: 'Dewi Lestari', email: 'dewi@example.com', role: 'member' }
const rina = { user_id: 'u-rina', name: 'Rina Sari', email: 'rina@example.com', role: 'member' }
/** Sudah di-remove dari project, tapi mention lamanya masih ada di task. */
const sinta = { user_id: 'u-sinta', name: 'Sinta Maharani', email: 'sinta@example.com' }

const sessionUser = { id: admin.user_id, name: admin.name, email: admin.email, role: 'user', created_at: '2026-11-01T00:00:00Z' }
const members = [admin, budi, dewi, rina]

const project = {
  id: 'p1',
  name: 'Sistem Akademik',
  description: null,
  created_by: admin.user_id,
  created_at: '2026-11-01T00:00:00Z',
  members,
}
const epic = {
  id: 'e1',
  title: 'Modul KRS',
  description: null,
  start_date: '2026-11-01',
  end_date: '2026-11-30',
  task_total: 2,
  task_done: 0,
  progress: 0,
  statuses: [],
}
const statuses = [
  { id: 's-todo', project_id: 'p1', name: 'Todo', order: 1, is_default: true, is_done: false },
  { id: 's-done', project_id: 'p1', name: 'Done', order: 2, is_default: false, is_done: true },
]

const ORIGINAL_DESCRIPTION =
  'Mohon dicek @budi@example.com dan @sinta@example.com.\nKontak vendor: vendor@example.com'

function makeTask(overrides: Partial<Task> & Pick<Task, 'id' | 'title'>): Task {
  return {
    epic_id: epic.id,
    status_id: 's-todo',
    description: null,
    priority: 'Medium',
    due_date: null,
    created_at: '2026-11-10T00:00:00Z',
    status: { id: 's-todo', name: 'Todo', is_default: true },
    assignees: [],
    mentions: [],
    epic: { id: epic.id, title: epic.title },
    ...overrides,
  }
}

const MENTION_PATTERN = /@([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g

/** Tiru sinkronisasi backend: mention lama dipertahankan, mention baru hanya untuk member. */
function syncMentions(description: string, previous: TaskMention[]): TaskMention[] {
  const emails = new Set([...description.matchAll(MENTION_PATTERN)].map((match) => match[1]!.toLowerCase()))
  const kept = previous.filter((mention) => emails.has(mention.email))
  const added = members
    .filter((member) => emails.has(member.email) && !kept.some((mention) => mention.user_id === member.user_id))
    .map(({ user_id, name, email }) => ({ user_id, name, email, mentioned_by: admin.user_id }))
  return [...kept, ...added]
}

function inboxItem(overrides: Partial<MentionInboxItem> & Pick<MentionInboxItem, 'id'>): MentionInboxItem {
  return {
    read_at: null,
    created_at: '2026-11-15T03:00:00Z',
    mentioned_by: { id: budi.user_id, name: budi.name },
    task: { id: 't1', title: 'Validasi batas SKS', epic_id: epic.id },
    project: { id: project.id, name: project.name },
    has_access: true,
    snippet: '...tolong cek @Admin Demo sebelum rilis...',
    ...overrides,
  }
}

type Member = (typeof members)[number]

interface MockOptions {
  inbox?: MentionInboxItem[]
  /** Member tambahan di project (mis. untuk dropdown yang perlu di-scroll). */
  extraMembers?: Member[]
  /** Tahan response `GET /projects/p1` sampai promise ini selesai (simulasi project masih dimuat). */
  projectReady?: Promise<void>
}

/** Backend tiruan yang stateful; setiap request di luar daftar dicatat sebagai `unexpected`. */
async function mockBackend(page: Page, { inbox = [], extraMembers = [], projectReady }: MockOptions = {}) {
  const errors: string[] = []
  const unexpected: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' || message.text().includes('[Vue warn]')) errors.push(message.text())
  })

  const tasks = new Map<string, Task>([
    [
      't1',
      makeTask({
        id: 't1',
        title: 'Validasi batas SKS',
        description: ORIGINAL_DESCRIPTION,
        mentions: syncMentions(ORIGINAL_DESCRIPTION, [
          { user_id: sinta.user_id, name: sinta.name, email: sinta.email, mentioned_by: admin.user_id },
        ]),
      }),
    ],
    ['t2', makeTask({ id: 't2', title: 'Cetak KRS ke PDF' })],
  ])
  const mentions = inbox.map((item) => ({ ...item }))

  await page.addInitScript((user) => {
    localStorage.setItem('pm_access_token', 'test-token')
    localStorage.setItem('pm_user', JSON.stringify(user))
    localStorage.setItem('pm_tasks_view', 'list')
  }, sessionUser)

  await page.route('**/*', async (route) => {
    const request = route.request()
    if (!['xhr', 'fetch'].includes(request.resourceType())) return route.continue()
    const url = new URL(request.url())
    const { pathname, searchParams } = url
    const method = request.method()
    const json = (body: unknown, status = 200) => route.fulfill({ status, json: body })

    if (method === 'GET' && pathname === '/me') return json({ message: 'ok', user: sessionUser })
    if (method === 'GET' && pathname === '/projects')
      return json([
        {
          ...project,
          my_role: 'admin',
          member_count: members.length,
          epic_count: 1,
          task_total: tasks.size,
          task_done: 0,
          progress: 0,
          members_preview: members.map(({ user_id, name }) => ({ user_id, name })),
        },
      ])
    if (method === 'GET' && pathname === '/projects/p1') {
      await projectReady
      return json({ ...project, members: [...members, ...extraMembers] })
    }
    if (method === 'GET' && pathname === '/projects/p1/statuses') return json(statuses)
    if (method === 'GET' && pathname === '/projects/p1/epics') return json([epic])
    if (method === 'GET' && pathname === '/projects/p1/attachments') return json([])
    if (method === 'GET' && pathname === '/epics/e1') return json({ ...epic, project_id: project.id })
    if (method === 'GET' && pathname === '/epics/e1/tasks') return json([...tasks.values()])
    if (method === 'GET' && pathname === '/projects/p1/tasks') {
      const list = [...tasks.values()]
      const mentionedMe = searchParams.get('mentioned') === 'me'
      return json(
        mentionedMe ? list.filter((task) => task.mentions.some((m) => m.user_id === admin.user_id)) : list,
      )
    }

    const taskMatch = pathname.match(/^\/tasks\/([^/]+)$/)
    if (taskMatch) {
      const task = tasks.get(taskMatch[1]!)
      if (!task) return json({ status: 403, message: 'You are not a member of this project' }, 403)
      if (method === 'GET') return json(task)
      if (method === 'PATCH') {
        const payload = request.postDataJSON() as Partial<Task>
        const description = payload.description ?? task.description
        const updated = {
          ...task,
          ...payload,
          description,
          mentions: syncMentions(description ?? '', task.mentions),
        }
        tasks.set(task.id, updated)
        return json(updated)
      }
    }

    if (method === 'POST' && pathname === '/epics/e1/tasks') {
      const payload = request.postDataJSON() as Partial<Task>
      const created = makeTask({
        id: `t${tasks.size + 1}`,
        title: payload.title!,
        description: payload.description ?? null,
        mentions: syncMentions(payload.description ?? '', []),
      })
      tasks.set(created.id, created)
      return json(created, 201)
    }

    // --- Mentions ---
    if (method === 'GET' && pathname === '/mentions/unread-count') {
      const projectId = searchParams.get('project_id')
      return json({ count: mentions.filter((m) => !m.read_at && (!projectId || m.project.id === projectId)).length })
    }
    if (method === 'GET' && pathname === '/mentions') {
      const unread = searchParams.get('unread') === 'true'
      const projectId = searchParams.get('project_id')
      const filtered = mentions.filter((m) => (!unread || !m.read_at) && (!projectId || m.project.id === projectId))
      const limit = Number(searchParams.get('limit') ?? 20)
      // Halaman uji dibatasi 2 item supaya tombol "Muat lagi" ikut teruji.
      const pageSize = Math.min(limit, 2)
      const start = Number(searchParams.get('cursor') ?? 0)
      const items = filtered.slice(start, start + pageSize)
      const next = start + pageSize < filtered.length ? String(start + pageSize) : null
      return json({ items, next_cursor: next })
    }
    const readMatch = pathname.match(/^\/mentions\/([^/]+)\/read$/)
    if (method === 'PATCH' && readMatch) {
      const mention = mentions.find((m) => m.id === readMatch[1])
      if (!mention) return json({ status: 404, message: 'Mention not found' }, 404)
      mention.read_at ??= new Date().toISOString()
      return json({ id: mention.id, read_at: mention.read_at })
    }
    if (method === 'POST' && pathname === '/mentions/read-all') {
      const projectId = (request.postDataJSON() as { project_id?: string } | null)?.project_id
      const unread = mentions.filter((m) => !m.read_at && (!projectId || m.project.id === projectId))
      for (const mention of unread) mention.read_at = new Date().toISOString()
      return json({ updated: unread.length })
    }

    unexpected.push(`${method} ${pathname}`)
    return json({ message: 'Unexpected request' }, 404)
  })

  return { errors, unexpected, tasks }
}

const isPatchTask = (id: string) => (request: Request) =>
  request.method() === 'PATCH' && new URL(request.url()).pathname === `/tasks/${id}`

test('deskripsi task menampilkan chip @Nama dan menyimpan mention baru sebagai @email', async ({ page }) => {
  const { errors, unexpected, tasks } = await mockBackend(page)
  await page.goto('/projects/p1/tasks?task=t1')

  const sheet = page.getByRole('dialog', { name: 'Detail task' })
  const readView = sheet.getByRole('button', { name: 'Ubah deskripsi' })

  // Mode baca: mention jadi chip nama, email mentah tidak tampil, email non-mention tetap teks.
  await expect(readView).toContainText('@Budi Santoso')
  await expect(readView).toContainText('@Sinta Maharani')
  await expect(readView).toContainText('vendor@example.com')
  await expect(readView).not.toContainText('@budi@example.com')
  // Sinta sudah bukan member: chip abu-abu (data-inactive), Budi tidak.
  await expect(readView.locator('[data-inactive]')).toHaveText('@Sinta Maharani')
  await expect(readView.locator('span', { hasText: '@Budi Santoso' })).not.toHaveAttribute('data-inactive')

  // Mode edit: editor mention dengan fokus di akhir teks.
  await readView.click()
  const editor = sheet.getByRole('textbox', { name: 'Deskripsi' })
  await expect(editor).toBeFocused()
  await expect(editor.locator('[data-inactive]')).toHaveText('@Sinta Maharani')

  await page.keyboard.type(' cc @de')
  const suggestions = page.getByRole('listbox', { name: 'Mention member' })
  // Domain email (@example.com) tidak ikut dicocokkan, jadi Rina tidak muncul.
  const options = suggestions.getByRole('option')
  await expect(options).toHaveCount(2)
  // Nama yang cocok di awal kata diurutkan lebih dulu; inisial avatar tidak ikut nama aksesibel.
  await expect(options.nth(0)).toHaveAccessibleName('Dewi Lestari')
  await expect(options.nth(1)).toHaveAccessibleName('Admin Demo')

  // Escape menutup dropdown saja, bukan sheet.
  await page.keyboard.press('Escape')
  await expect(suggestions).toBeHidden()
  await expect(sheet).toBeVisible()

  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await page.keyboard.type('@de')
  await expect(suggestions.getByRole('option').first()).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Enter')
  await expect(suggestions).toBeHidden()
  await expect(editor).toContainText('@Dewi Lestari')
  await page.keyboard.type('tolong cek.')

  const patch = page.waitForRequest(isPatchTask('t1'))
  await sheet.getByText('Dibuat', { exact: true }).click()
  const body = (await patch).postDataJSON() as { description: string }

  expect(body.description).toBe(`${ORIGINAL_DESCRIPTION} cc @dewi@example.com tolong cek.`)
  // Mention lama ke non-member tetap tersimpan, dan mention baru tersinkron.
  expect(tasks.get('t1')!.mentions.map((m) => m.user_id).sort()).toEqual([budi.user_id, dewi.user_id, sinta.user_id])
  await expect(readView).toContainText('@Dewi Lestari')
  await expect(readView).not.toContainText('@dewi@example.com')

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('memilih mention dengan klik mouse tidak menutup sheet dan tetap tersimpan', async ({ page }) => {
  const { errors, unexpected } = await mockBackend(page)
  await page.goto('/projects/p1/tasks?task=t2')

  const sheet = page.getByRole('dialog', { name: 'Detail task' })
  await sheet.getByRole('button', { name: 'Ubah deskripsi' }).click()
  await expect(sheet.getByRole('textbox', { name: 'Deskripsi' })).toBeFocused()
  await page.keyboard.type('Minta tolong @ri')
  await page.getByRole('listbox', { name: 'Mention member' }).getByRole('option', { name: 'Rina Sari' }).click()
  await expect(sheet).toBeVisible()
  await expect(sheet.getByRole('textbox', { name: 'Deskripsi' })).toBeFocused()

  const patch = page.waitForRequest(isPatchTask('t2'))
  await sheet.getByText('Dibuat', { exact: true }).click()
  expect(((await patch).postDataJSON() as { description: string }).description).toBe('Minta tolong @rina@example.com')

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('form Buat Task mengirim mention sebagai @email', async ({ page }) => {
  const { errors, unexpected } = await mockBackend(page)
  await page.goto('/projects/p1/tasks')

  await page.getByRole('button', { name: 'Buat Task' }).click()
  const dialog = page.getByRole('dialog', { name: 'Buat Task' })
  await dialog.getByRole('textbox', { name: /Judul/ }).fill('Review form KRS')
  await dialog.getByRole('combobox', { name: /Module/ }).click()
  await page.getByRole('option', { name: 'Modul KRS' }).click()

  await dialog.getByRole('textbox', { name: 'Deskripsi' }).click()
  await page.keyboard.type('Minta review @bu')
  await page.keyboard.press('Enter')
  await expect(dialog.getByRole('textbox', { name: 'Deskripsi' })).toContainText('@Budi Santoso')

  const create = page.waitForRequest(
    (request) => request.method() === 'POST' && new URL(request.url()).pathname === '/epics/e1/tasks',
  )
  await dialog.getByRole('button', { name: 'Buat Task' }).click()
  expect((await create).postDataJSON()).toMatchObject({
    title: 'Review form KRS',
    description: 'Minta review @budi@example.com',
  })
  await expect(dialog).toBeHidden()

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('filter Mentioned me meminta task dengan mentioned=me', async ({ page }) => {
  const { errors, unexpected, tasks } = await mockBackend(page)
  // Task t2 me-mention user login.
  const t2 = tasks.get('t2')!
  tasks.set('t2', {
    ...t2,
    description: '@admin@example.com',
    mentions: [{ user_id: admin.user_id, name: admin.name, email: admin.email, mentioned_by: budi.user_id }],
  })
  await page.goto('/projects/p1/tasks')

  const table = page.getByRole('table')
  await expect(table.getByText('Validasi batas SKS')).toBeVisible()
  await expect(table.getByText('Cetak KRS ke PDF')).toBeVisible()

  const filtered = page.waitForRequest(
    (request) =>
      new URL(request.url()).pathname === '/projects/p1/tasks' &&
      new URL(request.url()).searchParams.get('mentioned') === 'me',
  )
  const toggle = page.getByRole('button', { name: 'Mentioned me' })
  await toggle.click()
  await filtered
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect(table.getByText('Validasi batas SKS')).toBeHidden()
  await expect(table.getByText('Cetak KRS ke PDF')).toBeVisible()

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  await expect(table.getByText('Validasi batas SKS')).toBeVisible()

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('inbox mention: badge, tab belum dibaca, muat lagi, item terkunci, tandai semua, buka task', async ({
  page,
}) => {
  const inbox = [
    inboxItem({ id: 'm1', created_at: '2026-11-15T03:00:00Z' }),
    inboxItem({
      id: 'm2',
      created_at: '2026-11-14T03:00:00Z',
      mentioned_by: { id: rina.user_id, name: rina.name },
      task: { id: 't-old', title: 'Task project lama', epic_id: 'e-old' },
      project: { id: 'p-old', name: 'Project Lama' },
      has_access: false,
      snippet: '...@Admin Demo bantu migrasi data...',
    }),
    inboxItem({
      id: 'm3',
      created_at: '2026-11-13T03:00:00Z',
      read_at: '2026-11-13T04:00:00Z',
      task: { id: 't2', title: 'Cetak KRS ke PDF', epic_id: epic.id },
    }),
  ]
  const { errors, unexpected } = await mockBackend(page, { inbox })
  await page.goto('/mentions')

  // Badge di header & sidebar.
  await expect(page.getByRole('link', { name: 'Mentions, 2 belum dibaca' })).toBeVisible()
  await expect(page.getByLabel('2 mention belum dibaca')).toHaveText('2')

  const items = page.getByRole('list', { name: 'Daftar mention' }).getByRole('listitem')
  await expect(items).toHaveCount(2)
  await page.getByRole('button', { name: 'Muat lagi' }).click()
  await expect(items).toHaveCount(3)
  await expect(page.getByRole('button', { name: 'Muat lagi' })).toBeHidden()
  await expect(items.nth(0)).toContainText('Budi Santoso me-mention kamu di Validasi batas SKS')
  await expect(items.nth(0)).toContainText('tolong cek @Admin Demo sebelum rilis')
  await expect(items.nth(1)).toContainText('Tidak ada akses')

  // Tab "Belum dibaca" memakai unread=true dari server.
  const unreadRequest = page.waitForRequest(
    (request) => new URL(request.url()).pathname === '/mentions' && new URL(request.url()).searchParams.get('unread') === 'true',
  )
  await page.getByRole('tab', { name: /Belum dibaca/ }).click()
  await unreadRequest
  await expect(items).toHaveCount(2)
  await page.getByRole('tab', { name: 'Semua' }).click()

  // Item tanpa akses: ditandai dibaca, toast, tidak pindah halaman.
  const markLocked = page.waitForRequest(
    (request) => request.method() === 'PATCH' && new URL(request.url()).pathname === '/mentions/m2/read',
  )
  await page.getByRole('button', { name: /Rina Sari me-mention kamu di Task project lama/ }).click()
  await markLocked
  await expect(page.getByText('Kamu sudah tidak punya akses ke project ini')).toBeVisible()
  await expect(page).toHaveURL(/\/mentions$/)
  await expect(page.getByRole('link', { name: 'Mentions, 1 belum dibaca' })).toBeVisible()

  // Tandai semua dibaca → badge hilang, tab belum dibaca kosong.
  const readAll = page.waitForRequest(
    (request) => request.method() === 'POST' && new URL(request.url()).pathname === '/mentions/read-all',
  )
  await page.getByRole('button', { name: 'Tandai semua dibaca' }).click()
  await readAll
  await expect(page.getByLabel('Mentions', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Tandai semua dibaca' })).toBeDisabled()
  await page.getByRole('tab', { name: /Belum dibaca/ }).click()
  await expect(page.getByText('Semua mention sudah dibaca')).toBeVisible()
  await page.getByRole('tab', { name: 'Semua' }).click()

  // Item dengan akses: buka detail task lewat deep link, query dibersihkan saat sheet ditutup.
  await page.getByRole('button', { name: /Budi Santoso me-mention kamu di Validasi batas SKS/ }).click()
  await expect(page).toHaveURL(/\/projects\/p1\/tasks\?task=t1$/)
  const sheet = page.getByRole('dialog', { name: 'Detail task' })
  await expect(sheet.getByRole('textbox', { name: 'Judul Task' })).toHaveValue('Validasi batas SKS')
  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()
  await expect(page).toHaveURL(/\/projects\/p1\/tasks$/)

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('inbox kosong menampilkan empty state dan sidebar tanpa badge', async ({ page }) => {
  const { errors, unexpected } = await mockBackend(page)
  await page.goto('/notifications')

  // URL lama dialihkan ke /mentions.
  await expect(page).toHaveURL(/\/mentions$/)
  await expect(page.getByText('Belum ada yang me-mention kamu')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Tandai semua dibaca' })).toBeDisabled()
  await expect(page.getByLabel('Mentions', { exact: true })).toBeVisible()
  await expect(page.getByLabel(/mention belum dibaca/)).toHaveCount(0)

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('detail task yang aksesnya dicabut menampilkan pesan 403', async ({ page }) => {
  const { errors, unexpected } = await mockBackend(page)
  await page.goto('/projects/p1/tasks?task=t-revoked')

  await expect(page.getByRole('dialog', { name: 'Detail task' })).toContainText(
    'Kamu sudah tidak punya akses ke project ini',
  )

  expect(unexpected).toEqual([])
  // 403 dari GET /tasks/:id dicatat browser sebagai error jaringan; itu memang skenarionya.
  expect(errors.filter((error) => !error.includes('403'))).toEqual([])
})

// --- Regresi temuan code review ---

test('dropdown panjang: item aktif ikut ter-scroll dan klik area dropdown tidak menutup editor', async ({ page }) => {
  const extraMembers = Array.from({ length: 8 }, (_, index) => {
    const n = String(index + 1).padStart(2, '0')
    return { user_id: `u-extra-${n}`, name: `Tim ${n}`, email: `tim${n}@example.com`, role: 'member' }
  })
  const { errors, unexpected } = await mockBackend(page, { extraMembers })
  await page.goto('/projects/p1/tasks?task=t2')

  const sheet = page.getByRole('dialog', { name: 'Detail task' })
  await sheet.getByRole('button', { name: 'Ubah deskripsi' }).click()
  const editor = sheet.getByRole('textbox', { name: 'Deskripsi' })
  await expect(editor).toBeFocused()
  await page.keyboard.type('@')

  const listbox = page.getByRole('listbox', { name: 'Mention member' })
  const options = listbox.getByRole('option')
  await expect(options).toHaveCount(8)
  // Props internal TipTap tidak boleh bocor sebagai atribut DOM.
  await expect(listbox).not.toHaveAttribute('editor')
  await expect(listbox).not.toHaveAttribute('clientrect')
  const last = options.nth(7)
  await expect(last).not.toBeInViewport({ ratio: 1 })
  for (let i = 0; i < 7; i++) await page.keyboard.press('ArrowDown')
  await expect(last).toHaveAttribute('aria-selected', 'true')
  await expect(last).toBeInViewport({ ratio: 1 })

  // Klik padding kiri dropdown (bukan item, dan bukan sudut membulat yang tidak ikut hit-test
  // di Firefox): editor tetap aktif, tidak tersimpan/tertutup.
  await listbox.click({ position: { x: 3, y: 40 } })
  await expect(editor).toBeFocused()
  await expect(listbox).toBeVisible()

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('unread count & tandai semua di halaman Mentions mengikuti filter project', async ({ page }) => {
  const inbox = [
    inboxItem({ id: 'm1' }),
    inboxItem({ id: 'm2', project: { id: 'p-other', name: 'Project Lain' }, task: { id: 't-x', title: 'Task lain', epic_id: 'e-x' } }),
    inboxItem({ id: 'm3', project: { id: 'p-other', name: 'Project Lain' }, task: { id: 't-y', title: 'Task lain 2', epic_id: 'e-x' } }),
  ]
  const { errors, unexpected } = await mockBackend(page, { inbox })
  await page.goto('/mentions')

  const unreadTab = page.getByRole('tab', { name: /Belum dibaca/ })
  await expect(unreadTab).toHaveText('Belum dibaca 3')
  await expect(page.getByLabel('Mentions, 3 belum dibaca')).toBeVisible()

  await page.getByRole('combobox', { name: 'Filter project' }).click()
  await page.getByRole('option', { name: 'Sistem Akademik' }).click()
  // Tab mengikuti project terpilih; badge global di header tetap semua project.
  await expect(unreadTab).toHaveText('Belum dibaca 1')
  await expect(page.getByLabel('Mentions, 3 belum dibaca')).toBeVisible()

  const readAll = page.waitForRequest(
    (request) => request.method() === 'POST' && new URL(request.url()).pathname === '/mentions/read-all',
  )
  await page.getByRole('button', { name: 'Tandai semua dibaca' }).click()
  expect((await readAll).postDataJSON()).toEqual({ project_id: project.id })
  await expect(unreadTab).toHaveText('Belum dibaca')
  await expect(page.getByRole('button', { name: 'Tandai semua dibaca' })).toBeDisabled()
  await expect(page.getByLabel('Mentions, 2 belum dibaca')).toBeVisible()

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('menyimpan deskripsi task menyegarkan badge & inbox mention', async ({ page }) => {
  const { errors, unexpected } = await mockBackend(page)
  // Catat urutan request; yang dicek: ada unread-count SETELAH PATCH (request awal halaman tidak dihitung).
  const order: string[] = []
  page.on('request', (request) => {
    const { pathname } = new URL(request.url())
    if (isPatchTask('t2')(request)) order.push('patch')
    else if (pathname === '/mentions/unread-count') order.push('unread-count')
  })
  await page.goto('/projects/p1/tasks?task=t2')

  const sheet = page.getByRole('dialog', { name: 'Detail task' })
  await sheet.getByRole('button', { name: 'Ubah deskripsi' }).click()
  await expect(sheet.getByRole('textbox', { name: 'Deskripsi' })).toBeFocused()
  await page.keyboard.type('Catatan untuk diri sendiri @adm')
  await page.keyboard.press('Enter')
  await sheet.getByText('Dibuat', { exact: true }).click()

  await expect
    .poll(() => {
      const patchIndex = order.indexOf('patch')
      return patchIndex >= 0 && order.slice(patchIndex + 1).includes('unread-count')
    })
    .toBe(true)

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('chip tidak tampil abu-abu selama data member project belum dimuat', async ({ page }) => {
  let releaseProject!: () => void
  const projectReady = new Promise<void>((resolve) => (releaseProject = resolve))
  const { errors, unexpected } = await mockBackend(page, { projectReady })
  await page.goto('/projects/p1/modules/e1')

  // Halaman module hanya menunggu data epic; project (members) masih tertahan.
  await page.getByRole('table').getByText('Validasi batas SKS').click()
  const readView = page.getByRole('dialog', { name: 'Detail task' }).getByRole('button', { name: 'Ubah deskripsi' })
  await expect(readView).toContainText('@Budi Santoso')
  await expect(readView.locator('[data-inactive]')).toHaveCount(0)

  releaseProject()
  await expect(readView.locator('[data-inactive]')).toHaveText('@Sinta Maharani')

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})

test('deskripsi yang melebihi 2000 karakter (dihitung dengan @email) tidak disimpan', async ({ page }) => {
  const { errors, unexpected, tasks } = await mockBackend(page)
  // 1990 karakter: masih muat, tapi satu mention (@budi@example.com = 17 karakter) membuatnya lewat batas.
  const longText = 'a'.repeat(1990)
  tasks.set('t2', { ...tasks.get('t2')!, description: longText })
  let patched = false
  page.on('request', (request) => {
    if (isPatchTask('t2')(request)) patched = true
  })
  await page.goto('/projects/p1/tasks?task=t2')

  const sheet = page.getByRole('dialog', { name: 'Detail task' })
  await sheet.getByRole('button', { name: 'Ubah deskripsi' }).click()
  const editor = sheet.getByRole('textbox', { name: 'Deskripsi' })
  await expect(editor).toBeFocused()
  await page.keyboard.type(' @bu')
  await page.keyboard.press('Enter')
  await sheet.getByText('Dibuat', { exact: true }).click()

  await expect(sheet.getByText('Deskripsi maksimal 2000 karakter (tiap mention dihitung sebagai alamat email)')).toBeVisible()
  // Tetap di mode edit dengan teks utuh, dan tidak ada request simpan.
  await expect(editor).toContainText('@Budi Santoso')
  expect(patched).toBe(false)

  // Memendekkan teks lalu blur → tersimpan dan pesan hilang.
  await editor.click()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.type('Pendek saja @bu')
  await page.keyboard.press('Enter')
  const patch = page.waitForRequest(isPatchTask('t2'))
  await sheet.getByText('Dibuat', { exact: true }).click()
  expect(((await patch).postDataJSON() as { description: string }).description).toBe('Pendek saja @budi@example.com')
  await expect(sheet.getByText(/Deskripsi maksimal 2000 karakter/)).toBeHidden()

  expect(unexpected).toEqual([])
  expect(errors).toEqual([])
})
