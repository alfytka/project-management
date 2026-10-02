import { http } from '@/lib/http'
import type { Status, StatusCreate, StatusReorder, StatusUpdate } from './types'

export async function getProjectStatuses(projectId: string) {
  const { data } = await http.get<Status[]>(`/projects/${projectId}/statuses`)
  return data
}

export async function createStatus(projectId: string, payload: StatusCreate) {
  const { data } = await http.post<Status>(`/projects/${projectId}/statuses`, payload)
  return data
}

export async function updateStatus(id: string, payload: StatusUpdate) {
  const { data } = await http.patch<Status>(`/statuses/${id}`, payload)
  return data
}

export async function deleteStatus(id: string) {
  await http.delete(`/statuses/${id}`)
}

export async function reorderStatuses(projectId: string, payload: StatusReorder) {
  const { data } = await http.patch<Status[]>(`/projects/${projectId}/statuses/reorder`, payload)
  return data
}
