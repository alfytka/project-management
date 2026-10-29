import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { isHttpUrl } from './lib/url'

export const attachmentSchema = toTypedSchema(
  z.object({
    url: z
      .string({ required_error: 'URL wajib diisi' })
      .trim()
      .min(1, 'URL wajib diisi')
      .max(2048, 'URL maksimal 2048 karakter')
      .refine(isHttpUrl, 'URL harus diawali http:// atau https://'),
    title: z.string().trim().max(150, 'Judul maksimal 150 karakter').optional(),
  }),
)
