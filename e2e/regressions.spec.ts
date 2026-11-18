import { test, expect, type Page } from '@playwright/test'

/**
 * Regresi untuk langkah user yang "tak terduga": submit ganda, Escape saat mengedit, URL/deep link
 * dari project lain, dan sesi kedaluwarsa. Backend di-mock; tiap test mencatat request yang masuk.
 */
test.use({ headless: true, timezoneId: 'Asia/Jakarta' })

const user = { id: 'u1', name: 'Uji Admin', email: 'uji@example.com', role: 'user', created_at: '2026-11-01T00:00:00Z' }
const member = { user_id: user.id, name: user.name, email: user.email, role: 'admin' }
const budi = { user_id: 'u2', name: 'Budi Santoso', email: 'budi@example.com', role: 'member' }

const projects = {
  p1: { id: 'p1', name: 'Project Satu', description: null, created_by: 'u1', created_at: '2026-11-01T00:00:00Z', members: [member, budi] },
  // User hanya member biasa di p2.
  p2: { id: 'p2', name: 'Project Dua', description: null, created_by: 'u9', created_at: '2026-11-01T00:00:00Z', members: [{ ...member, role: 'member' }] },
}
const statuses = {
  p1: [
    { id: 's1-todo', project_id: 'p1', name: 'Todo', order: 1, is_default: true, is_done: false },
    { id: 's1-done', project_id: 'p1', name: 'Done', order: 2, is_default: false, is_done: true },
  ],
  p2: [
    { id: 's2-todo', project_id: 'p2', name: 'Antre', order: 1, is_default: true, is_done: false },
    { id: 's2-done', project_id: 'p2', name: 'Beres', order: 2, is_default: false, is_done: true },
  ],
}
const epics = {
  e1: { id: 'e1', project_id: 'p1', title: 'Module Satu', description: null, start_date: '2026-11-01', end_date: '2026-12-31', task_total: 0, task_done: 0, progress: 0, statuses: [] },
  e2: { id: 'e2', project_id: 'p2', title: 'Module Dua', description: null, start_date: '2026-11-01', end_date: '2026-12-31', task_total: 0, task_done: 0, progress: 0, statuses: [] },
}

function makeTask(id: string, title: string, epicId: 'e1' | 'e2', description: string | null = null) {
  const epic = epics[epicId]
  const status = statuses[epic.project_id as 'p1' | 'p2'][0]!
  return {
    id,
    epic_id: epic.id,
    status_id: status.id,
    title,
    description,
    priority: 'Medium',
    due_date: null,
    created_at: '2026-11-10T00:00:00Z',
    status: { id: status.id, name: status.name, is_default: true },
    assignees: [],
    mentions: [],
    epic: { id: epic.id, title: epic.title, project_id: epic.project_id },
  }
}

interface Recorded { method: string; path: string; body: unknown }

async function mockBackend(page: Page, { failAssign = false, slowMs = 300 } = {}) {
  const calls: Recorded[] = []
  const tasks: Record<string, ReturnType<typeof makeTask>> = {
    t1: makeTask('t1', 'Task Satu', 'e1'),
    t2: makeTask('t2', 'Task Dua', 'e2'),
  }

  await page.addInitScript((sessionUser) => {
    localStorage.setItem('pm_access_token', 'test-token')
    localStorage.setItem('pm_user', JSON.stringify(sessionUser))
  }, user)

  await page.route('**/*', async (route) => {
    const request = route.request()
    if (!['xhr', 'fetch'].includes(request.resourceType())) return route.continue()
    const url = new URL(request.url())
    if (url.port !== '3000') return route.continue()
    const { pathname } = url
    const method = request.method()
    const body = request.postDataJSON?.() ?? null
    calls.push({ method, path: pathname, body })
    const json = (data: unknown, status = 200) => route.fulfill({ status, json: data })
    const slow = () => new Promise((resolve) => setTimeout(resolve, slowMs))

    if (pathname === '/me') return json({ user })
    if (pathname === '/mentions/unread-count') return json({ count: 0 })
    if (pathname === '/projects' && method === 'GET') {
      return json(Object.values(projects).map((p) => ({
        id: p.id, name: p.name, description: null, my_role: p.members[0]!.role, member_count: p.members.length,
        created_at: p.created_at, epic_count: 1, task_total: 1, task_done: 0, progress: 0,
        members_preview: p.members.map((m) => ({ user_id: m.user_id, name: m.name })),
      })))
    }
    if (pathname === '/projects' && method === 'POST') {
      await slow()
      return json({ id: `p-new-${calls.length}`, name: (body as { name: string }).name, description: null, created_by: 'u1', created_at: '2026-11-18T00:00:00Z' }, 201)
    }

    const project = pathname.match(/^\/projects\/(p1|p2)(\/.*)?$/)
    if (project) {
      const [, id, rest = ''] = project as unknown as [string, 'p1' | 'p2', string?]
      if (rest === '') return json(projects[id])
      if (rest === '/statuses') return json(statuses[id])
      if (rest === '/statuses/reorder') return json(statuses[id])
      if (rest === '/epics') return json(Object.values(epics).filter((e) => e.project_id === id))
      if (rest === '/tasks') return json(Object.values(tasks).filter((t) => t.epic.project_id === id))
      if (rest === '/attachments') return json([])
    }

    const epic = pathname.match(/^\/epics\/(e1|e2)(\/tasks)?$/)
    if (epic) {
      const id = epic[1] as 'e1' | 'e2'
      if (!epic[2]) return json(epics[id])
      if (method === 'GET') return json(Object.values(tasks).filter((t) => t.epic_id === id))
      await slow()
      const created = makeTask(`t-new-${calls.length}`, (body as { title: string }).title, id)
      tasks[created.id] = created
      return json(created, 201)
    }

    if (/^\/tasks\/[^/]+\/assignees$/.test(pathname)) {
      return failAssign ? json({ message: 'Internal server error' }, 500) : json({}, 201)
    }
    const task = pathname.match(/^\/tasks\/([^/]+)$/)
    if (task && tasks[task[1]!]) {
      if (method === 'PATCH') Object.assign(tasks[task[1]!]!, body)
      return json(tasks[task[1]!])
    }

    return json({ message: `Tidak di-mock: ${method} ${pathname}` }, 404)
  })

  return { calls, count: (method: string, path: RegExp) => calls.filter((c) => c.method === method && path.test(c.path)).length }
}

test('Enter dua kali di form project hanya membuat satu project', async ({ page }) => {
  const backend = await mockBackend(page)
  await page.goto('/projects')
  await page.getByRole('button', { name: 'Buat Project' }).first().click()
  const name = page.getByLabel('Nama Project')
  await name.fill('Project Baru')
  await name.press('Enter')
  await name.press('Enter').catch(() => {})
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(backend.count('POST', /^\/projects$/)).toBe(1)
})

test('double click "Buat Task" hanya membuat satu task', async ({ page }) => {
  const backend = await mockBackend(page)
  await page.goto('/projects/p1/modules/e1')
  await page.getByRole('button', { name: 'Tambah Task' }).click()
  await page.getByLabel('Judul').fill('Task dobel')
  await page.getByRole('button', { name: 'Buat Task' }).dblclick()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(backend.count('POST', /^\/epics\/e1\/tasks$/)).toBe(1)
})

test('assign gagal: task tetap dianggap terbuat, dialog tertutup, tidak ada submit ulang', async ({ page }) => {
  const backend = await mockBackend(page, { failAssign: true })
  await page.goto('/projects/p1/modules/e1')
  await page.getByRole('button', { name: 'Tambah Task' }).click()
  await page.getByLabel('Judul').fill('Task dengan assignee')
  await page.getByText('Pilih assignee').click()
  await page.getByRole('button', { name: /Budi Santoso/ }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Buat Task' }).click()

  await expect(page.getByText('Task berhasil dibuat, tapi 1 assignee gagal ditambahkan')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(backend.count('POST', /^\/epics\/e1\/tasks$/)).toBe(1)
})

test('reorder status mengirim payload sesuai backend ({ order: [id...] })', async ({ page }) => {
  const backend = await mockBackend(page)
  await page.goto('/projects/p1/settings')
  await expect(page.getByRole('button', { name: 'Geser Todo' })).toBeVisible()
  // Fungsi yang dipanggil StatusManager setelah drag selesai.
  await page.evaluate(async () => {
    const { reorderStatuses } = await import('/src/features/statuses/api.ts')
    await reorderStatuses('p1', { order: ['s1-done', 's1-todo'] })
  })
  const call = backend.calls.find((c) => c.path === '/projects/p1/statuses/reorder')
  expect(call?.method).toBe('PATCH')
  expect(call?.body).toEqual({ order: ['s1-done', 's1-todo'] })
})

test('Escape saat mengedit deskripsi menyimpan ketikan dan panel tetap terbuka', async ({ page }) => {
  const backend = await mockBackend(page)
  await page.goto('/projects/p1/tasks?task=t1')
  await page.getByRole('button', { name: 'Ubah deskripsi' }).click()
  // Saat mengedit hanya editor yang tampil; tampilan baca tidak boleh ikut muncul (deskripsi ganda).
  await expect(page.getByRole('textbox', { name: 'Deskripsi' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ubah deskripsi' })).toHaveCount(0)
  await page.getByRole('textbox', { name: 'Deskripsi' }).pressSequentially('Jangan hilang')
  await page.keyboard.press('Escape')

  await expect.poll(() => backend.calls.find((c) => c.method === 'PATCH' && c.path === '/tasks/t1')?.body).toEqual({
    description: 'Jangan hilang',
  })
  await expect(page.locator('#task-title')).toHaveValue('Task Satu')
  await expect(page.getByRole('button', { name: 'Ubah deskripsi' })).toContainText('Jangan hilang')
})

test('tombol Back saat mengedit deskripsi tetap menyimpan ketikan', async ({ page }) => {
  const backend = await mockBackend(page)
  // Navigasi di dalam aplikasi (SPA), supaya Back = popstate, bukan muat ulang dokumen.
  await page.goto('/projects/p1/dashboard')
  await page.getByRole('navigation', { name: 'Tab project' }).getByRole('link', { name: /Tasks/ }).click()
  await page.getByRole('button', { name: /Task Satu/ }).click()
  await page.getByRole('button', { name: 'Ubah deskripsi' }).click()
  await page.getByRole('textbox', { name: 'Deskripsi' }).pressSequentially('Sebelum kembali')
  await page.goBack()

  await expect.poll(() => backend.calls.find((c) => c.method === 'PATCH' && c.path === '/tasks/t1')?.body).toEqual({
    description: 'Sebelum kembali',
  })
})

test('URL module milik project lain diarahkan ke project pemiliknya', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/projects/p1/modules/e2')
  await expect(page).toHaveURL(/\/projects\/p2\/modules\/e2$/)
  await expect(page.getByRole('heading', { name: 'Module Dua' })).toBeVisible()
  // User hanya member di p2: aksi admin tidak tampil walau ia admin di p1.
  await expect(page.getByRole('button', { name: 'Hapus module' })).toHaveCount(0)
})

test('deep link ?task= milik project lain dibuka di project pemiliknya', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/projects/p1/tasks?task=t2')
  await expect(page).toHaveURL(/\/projects\/p2\/tasks\?task=t2$/)
  await expect(page.locator('#task-title')).toHaveValue('Task Dua')
  await page.getByRole('combobox', { name: 'Status' }).click()
  await expect(page.getByRole('option', { name: 'Beres' })).toBeVisible()
  await expect(page.getByRole('option', { name: 'Done' })).toHaveCount(0)
})

test('sesi kedaluwarsa: login ulang kembali ke halaman semula', async ({ page }) => {
  await mockBackend(page)
  await page.route('**/projects/p1', (route) => route.fulfill({ status: 401, json: { message: 'Unauthorized' } }))
  await page.goto('/projects/p1/members')
  await expect(page).toHaveURL(/\/login\?redirect=(%2F|\/)projects(%2F|\/)p1(%2F|\/)members$/)
})
