import { http } from '@/lib/http'
import type {
  MemberAdd,
  MemberRole,
  Project,
  ProjectMember,
  ProjectCreate,
  ProjectDashboard,
  ProjectDetail,
  ProjectListItem,
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

/** `dueWithin`: jumlah hari ke depan untuk menghitung task due soon (1–365, default backend 3). */
export async function getProjectDashboard(projectId: string, dueWithin?: number) {
  const { data } = await http.get<ProjectDashboard>(`/projects/${projectId}/dashboard`, {
    params: { due_within: dueWithin },
  })
  return data
}
