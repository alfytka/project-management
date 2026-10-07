interface EpicBase {
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

/** Jumlah task per status project dalam satu epic. */
export interface EpicStatusTotal {
  id: string
  name: string
  total: number
}

/** Item `GET /projects/:projectId/epics`. */
export interface EpicListItem extends EpicBase {
  statuses: EpicStatusTotal[]
}

/**
 * `GET /epics/:id`. Response juga membawa `tasks` versi ringkas (status hanya nama);
 * halaman detail memakai `GET /epics/:id/tasks` yang lengkap (status id & assignee).
 */
export interface EpicDetail extends EpicBase {
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
