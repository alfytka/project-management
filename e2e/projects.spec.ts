import { test, expect, type Page } from '@playwright/test'
import type { ProjectListItem } from '../src/features/projects/types'

test.use({ headless: true, timezoneId: 'Asia/Jakarta' })

const member1 = { name: 'Member1', user_id: '15fbb672-759a-4326-9bf8-0a87c6582bdc' }
const manges = { name: 'Manges', user_id: '1cb73008-09a9-402a-9f04-1358763cc2ce' }
const admin = { name: 'Atmin', user_id: 'cb7b8cd6-52e6-4257-80ce-00756766e03f' }
const user = { id: manges.user_id, name: manges.name, email: 'test@example.com' }
const projects: ProjectListItem[] = [
  {
    id: '06b4fbeb-ac0a-4552-8728-01a8076c347a',
    name: 'Toko Online',
    description:
      'Website toko online: katalog produk, keranjang, checkout, pembayaran, dan dashboard admin.',
    my_role: 'admin',
    member_count: 3,
    created_at: '2026-10-02T06:43:16.223Z',
    epic_count: 5,
    task_total: 53,
    task_done: 16,
    progress: 30,
    members_preview: [member1, manges, admin],
  },
  {
    id: '260e94e0-6322-45e1-8ea2-7af0b62f2fc1',
    name: 'Sisma',
    description: null,
    my_role: 'admin',
    member_count: 2,
    created_at: '2026-10-02T03:23:31.467Z',
    epic_count: 2,
    task_total: 1,
    task_done: 0,
    progress: 0,
    members_preview: [manges, admin],
  },
  {
    id: '20d9ae45-c94f-41fc-a61d-015c340d045b',
    name: 'Website Revamp',
    description: 'Redesign website company profile dan landing page produk untuk Q4 2026.',
    my_role: 'admin',
    member_count: 1,
    created_at: '2026-09-30T07:13:13.164Z',
    epic_count: 1,
    task_total: 2,
    task_done: 1,
    progress: 50,
    members_preview: [manges],
  },
  {
    id: 'fd8a164f-ba07-4e77-8fd1-f930dc188936',
    name: 'Mobile App v2',
    description: 'Versi baru aplikasi mobile dengan fitur pembayaran dan notifikasi.',
    my_role: 'admin',
    member_count: 1,
    created_at: '2026-09-30T07:13:07.340Z',
    epic_count: 0,
    task_total: 0,
    task_done: 0,
    progress: 0,
    members_preview: [manges],
  },
  {
    id: 'f98232fd-3a07-4891-866d-9bc8aac0426f',
    name: 'Internal Tools',
    description: 'Tool internal untuk manajemen project dan pelaporan tim.',
    my_role: 'admin',
    member_count: 2,
    created_at: '2026-09-28T09:21:31.812Z',
    epic_count: 1,
    task_total: 0,
    task_done: 0,
    progress: 0,
    members_preview: [manges, admin],
  },
]

async function mockProjects(page: Page, response = projects) {
  const errors: string[] = []
  const extraRequests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error' || message.text().includes('[Vue warn]'))
      errors.push(message.text())
  })
  await page.addInitScript((sessionUser) => {
    localStorage.setItem('pm_access_token', 'test-token')
    localStorage.setItem('pm_user', JSON.stringify(sessionUser))
  }, user)
  await page.route('**/*', async (route) => {
    if (!['xhr', 'fetch'].includes(route.request().resourceType())) return route.continue()
    const pathname = new URL(route.request().url()).pathname
    if (pathname === '/me') return route.fulfill({ json: { user } })
    if (pathname === '/projects') return route.fulfill({ json: response })
    extraRequests.push(pathname)
    return route.fulfill({ status: 404, json: { message: 'Unexpected request' } })
  })
  return { errors, extraRequests }
}

test('projects renders the actual summary response in grid, list, search, and sidebar', async ({
  page,
}) => {
  const { errors, extraRequests } = await mockProjects(page)
  await page.goto('/projects')

  for (const mode of ['grid', 'list']) {
    await page.getByRole('button', { name: `Tampilan ${mode}` }).click()
    await expect(page.getByRole('article')).toHaveCount(projects.length)
    for (const project of projects) {
      const item = page.getByRole('article', { name: project.name, exact: true })
      await expect(item.getByRole('link', { name: project.name })).toHaveAttribute(
        'href',
        `/projects/${project.id}/dashboard`,
      )
      await expect(item).toContainText(project.description || 'Tidak ada deskripsi.')
      await expect(item).toContainText(`${project.epic_count} module`)
      await expect(item).toContainText(`${project.task_total} task`)
      await expect(item).toContainText(
        project.task_total
          ? `${project.task_done} dari ${project.task_total} task selesai`
          : 'Belum ada task',
      )
      await expect(item.getByRole('progressbar')).toHaveAttribute(
        'aria-valuenow',
        String(project.progress),
      )
      await expect(item).toContainText(`${project.progress}%`)
      for (const member of project.members_preview) {
        await expect(item.getByTitle(member.name, { exact: true })).toBeVisible()
      }
    }
    await expect(page.getByRole('article', { name: 'Toko Online' })).toContainText('2 Okt 2026')
    await expect(page.getByRole('article', { name: 'Website Revamp' })).toContainText('30 Sep 2026')
  }

  await page.reload()
  await expect(page.getByRole('button', { name: 'Tampilan list' })).toHaveAttribute(
    'data-active',
    'true',
  )
  const search = page.getByRole('searchbox', { name: 'Cari project', exact: true })
  await search.fill('  tOkO  ')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(page.getByRole('article')).toHaveAttribute('aria-label', 'Toko Online')
  await search.fill('PELAPORAN')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(page.getByRole('article')).toHaveAttribute('aria-label', 'Internal Tools')
  await search.fill('tidak ditemukan')
  await expect(page.getByText('Tidak ada project yang cocok dengan pencarian.')).toBeVisible()
  await search.clear()
  await expect(page.getByRole('article')).toHaveCount(projects.length)

  await page.getByRole('searchbox', { name: 'Cari menu dan project' }).fill('SISMA')
  await expect(page.getByRole('link', { name: 'Sisma', exact: true })).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Toko Online', exact: true })).toHaveCount(1)

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(
    page.getByRole('article', { name: 'Toko Online' }).getByRole('progressbar'),
  ).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  expect(extraRequests).toEqual([])
  expect(errors).toEqual([])
})

test('the successful response replaces loading skeletons in the page and sidebar', async ({
  page,
}) => {
  const { errors, extraRequests } = await mockProjects(page)
  await page.addInitScript(() => localStorage.setItem('pm_projects_view', 'list'))
  let releaseResponse!: () => void
  const responseReady = new Promise<void>((resolve) => {
    releaseResponse = resolve
  })
  await page.route('**/projects', async (route) => {
    if (!['xhr', 'fetch'].includes(route.request().resourceType())) return route.fallback()
    await responseReady
    return route.fulfill({ json: projects })
  })
  await page.goto('/projects')
  await expect(page.locator('[data-slot="skeleton"]').first()).toBeVisible()
  await expect(page.getByRole('article')).toHaveCount(0)
  releaseResponse()
  await expect(page.getByRole('article')).toHaveCount(projects.length)
  await expect(page.getByRole('link', { name: 'Toko Online', exact: true })).toHaveCount(2)
  await expect(page.locator('[data-slot="skeleton"]')).toHaveCount(0)
  expect(extraRequests).toEqual([])
  expect(errors).toEqual([])
})

test('member previews use member_count for the remaining avatars', async ({ page }) => {
  const project: ProjectListItem = {
    ...projects[0]!,
    member_count: 7,
    members_preview: [
      ...projects[0]!.members_preview,
      { user_id: 'member-4', name: 'Fourth Member' },
    ],
  }
  const { errors, extraRequests } = await mockProjects(page, [project])
  await page.goto('/projects')
  for (const mode of ['grid', 'list']) {
    await page.getByRole('button', { name: `Tampilan ${mode}` }).click()
    const item = page.getByRole('article')
    await expect(item.getByText('+4', { exact: true })).toBeVisible()
    await expect(item.getByTitle('Fourth Member', { exact: true })).toHaveCount(0)
  }
  expect(extraRequests).toEqual([])
  expect(errors).toEqual([])
})

test('role filters and edit and delete dialogs use the project name', async ({ page }) => {
  const withRoles = projects.map((project, index) => ({
    ...project,
    my_role: index === 0 ? 'admin' : 'member',
  }))
  const { errors, extraRequests } = await mockProjects(page, withRoles)
  await page.goto('/projects')
  await page.getByRole('tab', { name: 'Admin 1' }).click()
  await expect(page.getByRole('article')).toHaveCount(1)
  await page.getByRole('article').getByRole('button', { name: 'Aksi project' }).click()
  await page.getByRole('menuitem', { name: 'Edit project' }).click()
  const edit = page.getByRole('dialog', { name: 'Edit Project' })
  await expect(edit.getByRole('textbox', { name: 'Nama Project' })).toHaveValue(projects[0]!.name)
  await expect(edit.getByRole('textbox', { name: 'Deskripsi' })).toHaveValue(
    projects[0]!.description!,
  )
  await edit.getByRole('button', { name: 'Batal' }).click()
  await page.getByRole('article').getByRole('button', { name: 'Aksi project' }).click()
  await page.getByRole('menuitem', { name: 'Hapus project' }).click()
  const remove = page.getByRole('dialog', { name: 'Hapus project?' })
  await expect(remove).toContainText(projects[0]!.name)
  await remove.getByRole('button', { name: 'Batal' }).click()
  await page.getByRole('tab', { name: 'Member 4' }).click()
  await expect(page.getByRole('article')).toHaveCount(4)
  await page.getByRole('article').first().getByRole('button', { name: 'Aksi project' }).click()
  await expect(page.getByRole('menuitem', { name: 'Buka project' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Edit project' })).toHaveCount(0)
  await expect(page.getByRole('menuitem', { name: 'Hapus project' })).toHaveCount(0)
  expect(extraRequests).toEqual([])
  expect(errors).toEqual([])
})
