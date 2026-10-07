import { http } from '@/lib/http'
import type { Task, TaskAssignee, TaskCreate, TaskFilters, TaskUpdate } from './types'

type RawAssignee = Omit<TaskAssignee, 'user_id'> & { id?: string; user_id?: string }
type RawTask = Omit<Task, 'assignees'> & { assignees: RawAssignee[] }

// Backend mengirim assignee sebagai `{ id, name, email }`; frontend memakai `user_id` (sama dengan member project).
function normalizeTask({ assignees, ...task }: RawTask): Task {
  return {
    ...task,
    assignees: assignees.map(({ id, user_id, ...rest }) => ({ ...rest, user_id: (user_id ?? id)! })),
  }
}

export async function getEpicTasks(epicId: string) {
  const { data } = await http.get<RawTask[]>(`/epics/${epicId}/tasks`)
  return data.map(normalizeTask)
}

export async function getProjectTasks(projectId: string, filters: TaskFilters = {}) {
  const { data } = await http.get<RawTask[]>(`/projects/${projectId}/tasks`, { params: filters })
  return data.map(normalizeTask)
}

export async function getTask(id: string) {
  const { data } = await http.get<RawTask>(`/tasks/${id}`)
  return normalizeTask(data)
}

export async function createTask(epicId: string, payload: TaskCreate) {
  const { data } = await http.post<RawTask>(`/epics/${epicId}/tasks`, payload)
  return normalizeTask(data)
}

export async function updateTask(id: string, payload: TaskUpdate) {
  const { data } = await http.patch<RawTask>(`/tasks/${id}`, payload)
  return normalizeTask(data)
}

export async function deleteTask(id: string) {
  await http.delete(`/tasks/${id}`)
}

export async function assignTask(id: string, userId: string) {
  await http.post(`/tasks/${id}/assignees`, { user_id: userId })
}

export async function unassignTask(id: string, userId: string) {
  await http.delete(`/tasks/${id}/assignees/${userId}`)
}
