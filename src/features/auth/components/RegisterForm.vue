<script setup lang="ts">
import { Lock, Mail, User } from '@lucide/vue'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { extractValidationIssues, isNetworkError } from '@/lib/api-errors'
import { useRegister } from '../composables/useRegister'
import { registerSchema } from '../schema'

const { handleSubmit, setFieldError } = useForm({
  validationSchema: registerSchema,
})

const { mutate, isPending } = useRegister()

const onSubmit = handleSubmit((values) => {
  mutate(
    { name: values.name, email: values.email, password: values.password },
    {
      onError: (error) => {
        const issues = extractValidationIssues(error)
        if (issues) {
          for (const issue of issues) {
            setFieldError(issue.field as 'name' | 'email' | 'password' | 'confirmPassword', issue.message)
          }
          return
        }
        if (isNetworkError(error)) {
          toast.error('Tidak dapat terhubung ke server')
          return
        }
        toast.error('Registrasi gagal, coba lagi')
      },
    },
  )
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Nama</FormLabel>
        <FormControl>
          <div class="relative">
            <User class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input type="text" placeholder="Nama lengkap" class="pl-9" v-bind="componentField" />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <div class="relative">
            <Mail class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="email"
              placeholder="nama@perusahaan.com"
              class="pl-9"
              v-bind="componentField"
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <div class="relative">
            <Lock class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input type="password" placeholder="Minimal 6 karakter" class="pl-9" v-bind="componentField" />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="confirmPassword">
      <FormItem>
        <FormLabel>Konfirmasi Password</FormLabel>
        <FormControl>
          <div class="relative">
            <Lock class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input type="password" placeholder="Ulangi password" class="pl-9" v-bind="componentField" />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full" :disabled="isPending">
      {{ isPending ? 'Memproses...' : 'Daftar' }}
    </Button>
  </form>
</template>
