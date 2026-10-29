export type AttachmentType = 'link' | 'file'

export const ATTACHMENT_LIMIT = 50

export interface ProjectAttachment {
  id: string
  type: AttachmentType
  title: string
  url: string
  created_by: { id: string; name: string }
  created_at: string
  can_edit: boolean
}

export interface AttachmentCreate {
  url: string
  title?: string
}

export type AttachmentUpdate = Partial<AttachmentCreate>
