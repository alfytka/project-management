import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const dateField = (label: string) =>
  z.string({ required_error: `${label} wajib diisi` }).regex(/^\d{4}-\d{2}-\d{2}$/, `${label} wajib diisi`)

export const epicSchema = toTypedSchema(
  z
    .object({
      title: z
        .string({ required_error: 'Judul module wajib diisi' })
        .trim()
        .min(3, 'Judul module minimal 3 karakter')
        .max(100, 'Judul module maksimal 100 karakter'),
      description: z.string().max(500, 'Deskripsi maksimal 500 karakter').optional(),
      start_date: dateField('Tanggal Mulai'),
      end_date: dateField('Tanggal Selesai'),
    })
    // Format YYYY-MM-DD bisa dibandingkan sebagai string.
    .refine((values) => values.end_date >= values.start_date, {
      message: 'Tanggal Selesai tidak boleh sebelum Tanggal Mulai',
      path: ['end_date'],
    }),
)
