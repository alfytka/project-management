import { http } from '@/lib/http'
import type { AttachmentCreate, AttachmentUpdate, ProjectAttachment } from './types'

export async function getProjectAttachments(projectId: string) {
  const { data } = await http.get<ProjectAttachment[]>(`/projects/${projectId}/attachments`)
  return data
}

export async function createAttachment(projectId: string, payload: AttachmentCreate) {
  const { data } = await http.post<ProjectAttachment>(`/projects/${projectId}/attachments`, payload)
  return data
}

export async function updateAttachment(id: string, payload: AttachmentUpdate) {
  const { data } = await http.patch<ProjectAttachment>(`/attachments/${id}`, payload)
  return data
}

export async function deleteAttachment(id: string) {
  await http.delete(`/attachments/${id}`)
}
