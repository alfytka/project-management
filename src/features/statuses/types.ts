export interface Status {
  id: string
  project_id: string
  name: string
  order: number
  /** Status otomatis untuk task baru; tepat satu per project. */
  is_default: boolean
  /** Task dengan status ini dihitung selesai (dasar progress epic). */
  is_done: boolean
}

export interface StatusCreate {
  name: string
  order?: number
  is_default?: boolean
  is_done?: boolean
}

export type StatusUpdate = Partial<StatusCreate>

/** `PATCH /projects/:projectId/statuses/reorder`: seluruh id status project dalam urutan baru. */
export interface StatusReorder {
  order: string[]
}
