/** Item `GET /projects/:projectId/epics`. */
export interface EpicListItem {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  task_total: number
  task_done: number
  /** 0–100, dihitung backend. */
  progress: number
}

/**
 * `GET /epics/:id`. Response juga membawa `tasks` versi ringkas (status hanya nama);
 * halaman detail memakai `GET /epics/:id/tasks` yang lengkap (status id & assignee).
 */
export interface EpicDetail extends EpicListItem {
  project_id: string
}

export interface EpicCreate {
  title: string
  description?: string
  start_date: string
  end_date: string
}

export type EpicUpdate = Partial<EpicCreate>

/** Status turunan (bukan dari backend): dihitung dari progress dan rentang tanggal. */
export type EpicStatus = 'in_progress' | 'late' | 'done' | 'not_started'
