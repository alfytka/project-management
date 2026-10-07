import { test, expect } from '@playwright/test'

test.use({ headless: true })

test('project content follows repeated Modules and Dashboard navigation', async ({ page }) => {
  const user = { id: 'user-1', name: 'Test User', email: 'test@example.com' }
  const project = {
    id: 'project-1',
    name: 'Test Project',
    description: null,
    created_at: '2026-10-01T00:00:00Z',
    created_by: user.id,
    members: [{ user_id: user.id, name: user.name, email: user.email, role: 'admin' }],
  }
  const epic = {
    id: 'module-1',
    title: 'Test Module',
    description: null,
    start_date: '2026-10-01',
    end_date: '2026-10-31',
    task_total: 4,
    task_done: 1,
    progress: 25,
  }
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.text().includes('[Vue warn]')) errors.push(message.text())
  })
  await page.addInitScript(
    ({ user }) => {
      localStorage.setItem('pm_access_token', 'test-token')
      localStorage.setItem('pm_user', JSON.stringify(user))
    },
    { user },
  )
  await page.route('**/*', async (route) => {
    if (!['xhr', 'fetch'].includes(route.request().resourceType())) return route.continue()
    const path = new URL(route.request().url()).pathname
    const responses: Record<string, unknown> = {
      '/me': user,
      '/projects': [{ ...project, my_role: 'admin', member_count: 1 }],
      '/projects/project-1': project,
      '/projects/project-1/epics': [epic],
      '/projects/project-1/tasks': [],
      '/projects/project-1/statuses': [
        { id: 'todo', name: 'To Do', order: 0, is_default: true, is_done: false },
        { id: 'done', name: 'Done', order: 1, is_default: false, is_done: true },
      ],
      '/projects/project-1/dashboard': {
        total_tasks: 4,
        overdue_count: 1,
        due_soon_count: 2,
        epics: [epic],
        by_status: [
          { status_id: 'todo', status_name: 'To Do', count: 3 },
          { status_id: 'done', status_name: 'Done', count: 1 },
        ],
        by_priority: [{ priority: 'Medium', count: 4 }],
      },
    }
    if (!(path in responses)) return route.continue()
    await route.fulfill({ json: responses[path] })
  })
  await page.goto('/projects/project-1/modules')
  const tabs = page.getByRole('navigation', { name: 'Tab project' })
  for (let i = 0; i < 5; i++) {
    await expect(page.getByRole('searchbox', { name: 'Cari module' })).toBeVisible()
    await page.getByRole('button', { name: 'Aksi module', exact: true }).click()
    await expect(page.getByRole('menuitem', { name: 'Edit module' })).toBeVisible()
    await tabs.getByRole('link', { name: 'Dashboard', exact: true }).click()
    await expect(page).toHaveURL(/\/projects\/project-1\/dashboard$/)
    await expect(page.getByRole('heading', { name: 'Ringkasan project' })).toBeVisible()
    await expect(page.getByRole('searchbox', { name: 'Cari module' })).toHaveCount(0)
    await expect(page.getByRole('menuitem', { name: 'Edit module' })).toHaveCount(0)
    await tabs.getByRole('link', { name: /^Modules/ }).click()
    await expect(page).toHaveURL(/\/projects\/project-1\/modules$/)
    await expect(page.getByRole('heading', { name: 'Ringkasan project' })).toHaveCount(0)
  }
  await expect(page.getByRole('searchbox', { name: 'Cari module' })).toBeVisible()
  // Navigasi cepat dan history juga harus mengganti isi, termasuk saat data sudah di-cache.
  await tabs.getByRole('link', { name: 'Dashboard', exact: true }).click()
  await tabs.getByRole('link', { name: /^Modules/ }).click()
  await tabs.getByRole('link', { name: 'Dashboard', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Ringkasan project' })).toBeVisible()
  await expect(page.getByRole('searchbox', { name: 'Cari module' })).toHaveCount(0)
  await page.goBack()
  await expect(page.getByRole('searchbox', { name: 'Cari module' })).toBeVisible()
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'Ringkasan project' })).toBeVisible()
  await expect(page.getByRole('searchbox', { name: 'Cari module' })).toHaveCount(0)
  expect(errors).toEqual([])
})
