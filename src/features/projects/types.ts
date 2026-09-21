export interface ProjectListItem {
  id: string
  name: string
  description: string | null
  my_role: string
  member_count: number
  created_at: string
}

export interface Project {
  id: string
  name: string
  description: string | null
  created_by: string
  created_at: string
}

export interface ProjectMember {
  user_id: string
  name: string
  email: string
  role: string
}

export interface ProjectDetail extends Project {
  members: ProjectMember[]
}

export interface ProjectCreate {
  name: string
  description?: string | null
}

export interface ProjectUpdate {
  name?: string | null
  description?: string | null
}

export type MemberRole = 'admin' | 'member'

export interface MemberAdd {
  email: string
  role?: MemberRole | null
}

export interface MemberRoleUpdate {
  role: MemberRole
}
