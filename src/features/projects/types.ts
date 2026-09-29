export interface ProjectListItem {
  id: string
  name: string
  description: string | null
  my_role: string
  member_count: number
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
}

export interface ProjectMember {
  user_id: string
  name: string
  email: string
  role: string
}

export interface ProjectDetail extends Project {
  members: ProjectMember[]
}

export interface ProjectCreate {
  name: string
  description?: string | null
}

export interface ProjectUpdate {
  name?: string | null
  description?: string | null
}

export type MemberRole = 'admin' | 'member'

export interface MemberAdd {
  email: string
  role?: MemberRole | null
}

export interface MemberRoleUpdate {
  role: MemberRole
}

// --- Epic / task / aktivitas -------------------------------------------------
// Backend belum punya endpoint-nya; bentuk di bawah adalah usulan kontrak dan saat ini
// diisi oleh `mock.ts`. Sesuaikan begitu endpoint tersedia.

export interface Epic {
  id: string
  project_id: string
  name: string
  start_date: string
  end_date: string
  task_count: number
  task_done_count: number
}

export type EpicStatus = 'done' | 'late' | 'in_progress' | 'not_started'

export interface ProjectTaskStats {
  total: number
  done: number
  open: number
  due_this_week: number
}

export interface ProjectActivity {
  id: string
  message: string
  created_at: string
}
