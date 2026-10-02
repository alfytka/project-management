<script setup lang="ts">
import { Mail, User } from '@lucide/vue'
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import RequiredMark from '@/components/RequiredMark.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toErrorToast } from '@/lib/api-errors'
import { useRegister } from '../composables/useRegister'
import { registerSchema } from '../schema'

const { handleSubmit, setFieldError } = useForm({
  validationSchema: registerSchema,
  initialValues: { name: '', email: '', password: '', confirmPassword: '' },
})

const { mutate, isPending } = useRegister()

const onSubmit = handleSubmit((values) => {
  mutate(
    { name: values.name, email: values.email, password: values.password },
    {
      onError: (error) => {
        // Backend mengirim 409 "Email already registered" — tampilkan di field email.
        if (isAxiosError(error) && error.response?.status === 409) {
          setFieldError('email', 'Email sudah terdaftar')
          return
        }
        toast.error(toErrorToast(error, 'Registrasi gagal, coba lagi'))
      },
    },
  )
})
</script>

<template>
  <form class="space-y-4" novalidate @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Nama <RequiredMark /></FormLabel>
        <div class="relative">
          <User class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <FormControl>
            <Input type="text" autocomplete="name" placeholder="Nama lengkap" class="h-10 pl-9" v-bind="componentField" />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email <RequiredMark /></FormLabel>
        <div class="relative">
          <Mail class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <FormControl>
            <Input
              type="email"
              autocomplete="email"
              placeholder="nama@perusahaan.com"
              class="h-10 pl-9"
              v-bind="componentField"
            />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password <RequiredMark /></FormLabel>
        <FormControl>
          <PasswordInput autocomplete="new-password" placeholder="Minimal 6 karakter" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="confirmPassword">
      <FormItem>
        <FormLabel>Konfirmasi Password <RequiredMark /></FormLabel>
        <FormControl>
          <PasswordInput autocomplete="new-password" placeholder="Ulangi password" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" size="lg" class="w-full" :disabled="isPending">
      {{ isPending ? 'Memproses...' : 'Daftar' }}
    </Button>
  </form>
</template>
