import { http } from '@/lib/http'
import type { Task, TaskCreate, TaskFilters, TaskUpdate } from './types'

export async function getEpicTasks(epicId: string) {
  const { data } = await http.get<Task[]>(`/epics/${epicId}/tasks`)
  return data
}

export async function getProjectTasks(projectId: string, filters: TaskFilters = {}) {
  const { data } = await http.get<Task[]>(`/projects/${projectId}/tasks`, { params: filters })
  return data
}

export async function getTask(id: string) {
  const { data } = await http.get<Task>(`/tasks/${id}`)
  return data
}

export async function createTask(epicId: string, payload: TaskCreate) {
  const { data } = await http.post<Task>(`/epics/${epicId}/tasks`, payload)
  return data
}

export async function updateTask(id: string, payload: TaskUpdate) {
  const { data } = await http.patch<Task>(`/tasks/${id}`, payload)
  return data
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
