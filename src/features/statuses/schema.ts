import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const statusNameSchema = z
  .string({ required_error: 'Nama status wajib diisi' })
  .trim()
  .min(1, 'Nama status wajib diisi')
  .max(50, 'Nama status maksimal 50 karakter')

export const statusSchema = toTypedSchema(z.object({ name: statusNameSchema }))
