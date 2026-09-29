import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const projectSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: 'Nama project wajib diisi' })
      .trim()
      .min(3, 'Nama project minimal 3 karakter')
      .max(100, 'Nama project maksimal 100 karakter'),
    description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  }),
)

export const memberSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: 'Email wajib diisi' })
      .trim()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    role: z.enum(['admin', 'member']),
  }),
)
