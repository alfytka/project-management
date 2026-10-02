import { http } from '@/lib/http'
import type { EpicCreate, EpicDetail, EpicListItem, EpicUpdate } from './types'

export async function getProjectEpics(projectId: string) {
  const { data } = await http.get<EpicListItem[]>(`/projects/${projectId}/epics`)
  return data
}

export async function getEpic(id: string) {
  const { data } = await http.get<EpicDetail>(`/epics/${id}`)
  return data
}

export async function createEpic(projectId: string, payload: EpicCreate) {
  const { data } = await http.post<EpicDetail>(`/projects/${projectId}/epics`, payload)
  return data
}

export async function updateEpic(id: string, payload: EpicUpdate) {
  const { data } = await http.patch<EpicDetail>(`/epics/${id}`, payload)
  return data
}

export async function deleteEpic(id: string) {
  await http.delete(`/epics/${id}`)
}
