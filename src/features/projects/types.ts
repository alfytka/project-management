import type { TaskPriority } from '@/features/tasks/types'

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

// --- Dashboard -----------------------------------------------------------------

/** `GET /projects/:projectId/dashboard`: satu response agregat untuk seluruh halaman dashboard. */
export interface ProjectDashboard {
  total_tasks: number
  by_status: { status_id: string; status_name: string; count: number }[]
  by_priority: { priority: TaskPriority; count: number }[]
  overdue_count: number
  due_soon_count: number
  epics: { id: string; title: string; progress: number; task_total: number; task_done: number }[]
}
