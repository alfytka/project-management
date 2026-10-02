/**
 * DATA MOCK SEMENTARA — backend belum punya endpoint aktivitas.
 *
 * Dipakai oleh `getProjectActivities` di `api.ts` (ditandai `TODO(mock)`). Begitu endpoint
 * tersedia, ganti isi fungsi tersebut dengan panggilan `http` dan hapus file ini.
 * Sengaja hanya memuat kejadian yang waktunya benar-benar diketahui.
 */
import type { ProjectActivity, ProjectDetail } from './types'

export function mockActivities(project: ProjectDetail): ProjectActivity[] {
  return [{ id: 'created', message: 'Project dibuat', created_at: project.created_at }]
}
