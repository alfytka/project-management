import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const projectSchema = toTypedSchema(
  z.object({
    name: z
      .string({ required_error: 'Nama project wajib diisi' })
      .trim()
      .min(1, 'Nama project wajib diisi')
      .max(150, 'Nama project maksimal 150 karakter'),
    description: z.string().optional(),
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
