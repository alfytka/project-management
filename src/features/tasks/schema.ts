import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { TASK_PRIORITIES } from './types'

export const taskTitleSchema = z
  .string({ required_error: 'Judul task wajib diisi' })
  .trim()
  .min(1, 'Judul task wajib diisi')
  .max(200, 'Judul task maksimal 200 karakter')

/**
 * Batas dihitung dari teks tersimpan, di mana tiap mention berupa `@email` (lebih panjang dari
 * `@Nama` yang tampil) — pesan menyebutkannya supaya user tidak bingung.
 */
export const taskDescriptionSchema = z
  .string()
  .max(2000, 'Deskripsi maksimal 2000 karakter (tiap mention dihitung sebagai alamat email)')

export const taskSchema = toTypedSchema(
  z.object({
    title: taskTitleSchema,
    description: taskDescriptionSchema.optional(),
    epic_id: z.string({ required_error: 'Pilih module' }).min(1, 'Pilih module'),
    status_id: z.string().optional(),
    priority: z.enum(TASK_PRIORITIES),
    due_date: z.string().optional(),
    assignee_ids: z.array(z.string()),
  }),
)
