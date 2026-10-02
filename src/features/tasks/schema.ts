import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { TASK_PRIORITIES } from './types'

export const taskTitleSchema = z
  .string({ required_error: 'Judul task wajib diisi' })
  .trim()
  .min(1, 'Judul task wajib diisi')
  .max(200, 'Judul task maksimal 200 karakter')

export const taskSchema = toTypedSchema(
  z.object({
    title: taskTitleSchema,
    description: z.string().max(2000, 'Deskripsi maksimal 2000 karakter').optional(),
    epic_id: z.string({ required_error: 'Pilih module' }).min(1, 'Pilih module'),
    status_id: z.string().optional(),
    priority: z.enum(TASK_PRIORITIES),
    due_date: z.string().optional(),
    assignee_ids: z.array(z.string()),
  }),
)
