/** Entri `mentions` di response task: sumber kebenaran siapa yang ter-mention. */
export interface TaskMention {
  user_id: string
  name: string
  email: string
  /** user_id penulis mention. */
  mentioned_by: string
}

/** Item `GET /mentions`. */
export interface MentionInboxItem {
  id: string
  /** `null` = belum dibaca. */
  read_at: string | null
  created_at: string
  mentioned_by: { id: string; name: string }
  task: { id: string; title: string; epic_id: string }
  project: { id: string; name: string }
  /** False bila user sudah tidak menjadi member project task tersebut. */
  has_access: boolean
  /** Potongan deskripsi dengan `@email` sudah diganti `@Nama` oleh backend. */
  snippet: string
}

export interface MentionInboxPage {
  items: MentionInboxItem[]
  next_cursor: string | null
}

export interface MentionInboxQuery {
  unread?: boolean
  project_id?: string
  limit?: number
  cursor?: string
}
