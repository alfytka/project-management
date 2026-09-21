import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string({ required_error: 'Email wajib diisi' })
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    password: z.string({ required_error: 'Password wajib diisi' }).min(1, 'Password wajib diisi'),
  }),
)

export const registerSchema = toTypedSchema(
  z
    .object({
      name: z
        .string({ required_error: 'Nama wajib diisi' })
        .min(2, 'Nama minimal 2 karakter')
        .max(100, 'Nama maksimal 100 karakter'),
      email: z
        .string({ required_error: 'Email wajib diisi' })
        .min(1, 'Email wajib diisi')
        .email('Format email tidak valid'),
      password: z
        .string({ required_error: 'Password wajib diisi' })
        .min(6, 'Password minimal 6 karakter'),
      confirmPassword: z
        .string({ required_error: 'Konfirmasi password wajib diisi' })
        .min(1, 'Konfirmasi password wajib diisi'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Konfirmasi password tidak cocok',
      path: ['confirmPassword'],
    }),
)
