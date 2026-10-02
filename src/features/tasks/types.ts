export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export interface TaskAssignee {
  user_id: string
  name: string
  email: string
}

export interface TaskStatusRef {
  id: string
  name: string
  is_default: boolean
}

export interface Task {
  id: string
  epic_id: string
  status_id: string
  title: string
  description: string | null
  priority: TaskPriority
  due_date: string | null
  created_at: string
  status: TaskStatusRef
  assignees: TaskAssignee[]
  /** Hanya dikirim oleh `GET /projects/:id/tasks`, `GET /tasks/:id`, dan `PATCH /tasks/:id`. */
  epic?: { id: string; title: string }
}

export interface TaskCreate {
  title: string
  description?: string
  priority?: TaskPriority
  /** `YYYY-MM-DD`. */
  due_date?: string
  /** Kosong → backend memakai status default project. */
  status_id?: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  priority?: TaskPriority
  /** `null` mengosongkan due date. */
  due_date?: string | null
  status_id?: string
}

/** Query param `GET /projects/:projectId/tasks`. */
export interface TaskFilters {
  status?: string
  assignee?: string
  priority?: TaskPriority
  due_before?: string
}
