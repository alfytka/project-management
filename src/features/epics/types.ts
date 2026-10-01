export type EpicStatus = 'PLANNED' | 'IN_PROGRESS' | 'DELAYED' | 'COMPLETED'

export interface TaskCount {
  todo?: number
  in_progress?: number
  done?: number
  total?: number
}

export interface Epic {
  id: string
  project_id: string
  title: string
  description?: string
  status: EpicStatus
  start_date: string
  end_date: string
  progress: number
  task_total?: number
  task_done?: number
  task_todo?: number
  task_in_progress?: number
  task_count?: TaskCount
  created_at?: string
  updated_at?: string
}

export interface CreateEpicPayload {
  title: string
  description?: string
  start_date: string
  end_date: string
}

export interface UpdateEpicPayload extends Partial<CreateEpicPayload> {
  status?: EpicStatus
}