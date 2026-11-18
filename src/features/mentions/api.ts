import { http } from '@/lib/http'
import type { MentionInboxPage, MentionInboxQuery } from './types'

export async function getMentions(query: MentionInboxQuery = {}) {
  const { data } = await http.get<MentionInboxPage>('/mentions', { params: query })
  return data
}

export async function getUnreadMentionCount(projectId?: string) {
  const { data } = await http.get<{ count: number }>('/mentions/unread-count', {
    params: { project_id: projectId },
  })
  return data.count
}

export async function markMentionRead(id: string) {
  const { data } = await http.patch<{ id: string; read_at: string }>(`/mentions/${id}/read`)
  return data
}

export async function markAllMentionsRead(projectId?: string) {
  const { data } = await http.post<{ updated: number }>('/mentions/read-all', projectId ? { project_id: projectId } : {})
  return data
}
