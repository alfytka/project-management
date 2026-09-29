/**
 * DATA MOCK SEMENTARA — backend belum punya endpoint epic, task, dan aktivitas.
 *
 * Dipakai oleh fungsi di `api.ts` yang ditandai `TODO(mock)`. Begitu endpoint tersedia,
 * ganti isi fungsi tersebut dengan panggilan `http` dan hapus file ini.
 * Data dibuat deterministik dari id project supaya tampilan tidak berubah tiap reload.
 */
import type { Epic, ProjectActivity, ProjectDetail, ProjectTaskStats } from './types'

const DAY = 24 * 60 * 60 * 1000

const EPIC_TEMPLATES = [
  { name: 'Sistem Autentikasi', start: -58, end: -25, tasks: 14, done: 14 },
  { name: 'Integrasi Payment', start: -58, end: -2, tasks: 17, done: 6 },
  { name: 'Redesign Halaman Utama', start: -10, end: 20, tasks: 18, done: 13 },
  { name: 'Dashboard Analitik', start: 33, end: 63, tasks: 8, done: 0 },
  { name: 'Notifikasi Push', start: -20, end: 35, tasks: 10, done: 4 },
  { name: 'Laporan Bulanan', start: 5, end: 50, tasks: 6, done: 0 },
]

function hash(value: string) {
  return [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function daysFromNow(days: number) {
  return new Date(Date.now() + days * DAY).toISOString()
}

export function mockEpics(projectId: string): Epic[] {
  const seed = hash(projectId)
  const count = seed % 5
  const offset = seed % EPIC_TEMPLATES.length

  return Array.from({ length: count }, (_, i) => {
    const template = EPIC_TEMPLATES[(offset + i) % EPIC_TEMPLATES.length]!
    return {
      id: `${projectId}-epic-${i}`,
      project_id: projectId,
      name: template.name,
      start_date: daysFromNow(template.start),
      end_date: daysFromNow(template.end),
      task_count: template.tasks,
      task_done_count: template.done,
    }
  })
}

export function mockTaskStats(projectId: string): ProjectTaskStats {
  const epics = mockEpics(projectId)
  const total = epics.reduce((sum, epic) => sum + epic.task_count, 0)
  const done = epics.reduce((sum, epic) => sum + epic.task_done_count, 0)
  const open = total - done
  return { total, done, open, due_this_week: Math.min(open, hash(projectId) % 7) }
}

export function mockActivities(project: ProjectDetail): ProjectActivity[] {
  const epics = mockEpics(project.id)
  const now = Date.now()
  const activities: ProjectActivity[] = []

  const running = epics.find((epic) => epic.task_done_count > 0 && epic.task_done_count < epic.task_count)
  const actor = project.members[1] ?? project.members[0]
  if (running && actor) {
    activities.push({
      id: 'a1',
      message: `${actor.name} menyelesaikan 3 task di “${running.name}”`,
      created_at: new Date(now - 10 * 60 * 1000).toISOString(),
    })
  }

  const late = epics.find((epic) => new Date(epic.end_date).getTime() < now && epic.task_done_count < epic.task_count)
  if (late) {
    activities.push({
      id: 'a2',
      message: `Epic “${late.name}” melewati end date`,
      created_at: late.end_date,
    })
  }

  const newest = project.members.at(-1)
  if (newest && project.members.length > 1) {
    activities.push({
      id: 'a3',
      message: `${newest.name} bergabung sebagai ${newest.role}`,
      created_at: new Date(now - DAY).toISOString(),
    })
  }

  activities.push({ id: 'a4', message: 'Project dibuat', created_at: project.created_at })
  return activities
}
