import { http } from '@/lib/http'
import { mockActivities, mockEpics, mockTaskStats } from './mock'
import type {
  Epic,
  MemberAdd,
  MemberRole,
  Project,
  ProjectMember,
  ProjectCreate,
  ProjectDetail,
  ProjectActivity,
  ProjectListItem,
  ProjectTaskStats,
  ProjectUpdate,
} from './types'

export async function getProjects() {
  const { data } = await http.get<ProjectListItem[]>('/projects')
  return data
}

export async function getProject(id: string) {
  const { data } = await http.get<ProjectDetail>(`/projects/${id}`)
  return data
}

export async function createProject(payload: ProjectCreate) {
  const { data } = await http.post<Project>('/projects', payload)
  return data
}

export async function updateProject(id: string, payload: ProjectUpdate) {
  const { data } = await http.patch<Project>(`/projects/${id}`, payload)
  return data
}

export async function deleteProject(id: string) {
  await http.delete(`/projects/${id}`)
}

export async function addMember(projectId: string, payload: MemberAdd) {
  const { data } = await http.post<ProjectMember>(`/projects/${projectId}/members`, payload)
  return data
}

export async function updateMemberRole(projectId: string, userId: string, role: MemberRole) {
  const { data } = await http.patch<ProjectMember>(`/projects/${projectId}/members/${userId}`, {
    role,
  })
  return data
}

export async function removeMember(projectId: string, userId: string) {
  await http.delete(`/projects/${projectId}/members/${userId}`)
}

// TODO(mock): ganti dengan endpoint epic begitu tersedia, mis. GET /projects/:id/epics
export async function getProjectEpics(projectId: string): Promise<Epic[]> {
  return mockEpics(projectId)
}

// TODO(mock): ganti dengan endpoint statistik task, mis. GET /projects/:id/tasks/stats
export async function getProjectTaskStats(projectId: string): Promise<ProjectTaskStats> {
  return mockTaskStats(projectId)
}

// TODO(mock): ganti dengan endpoint aktivitas, mis. GET /projects/:id/activities
export async function getProjectActivities(projectId: string): Promise<ProjectActivity[]> {
  return mockActivities(await getProject(projectId))
}
