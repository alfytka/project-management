<script setup lang="ts">
import { Mail } from '@lucide/vue'
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import RequiredMark from '@/components/RequiredMark.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toErrorToast } from '@/lib/api-errors'
import { useLogin } from '../composables/useLogin'
import { loginSchema } from '../schema'

const { handleSubmit } = useForm({
  validationSchema: loginSchema,
  initialValues: { email: '', password: '' },
})

const { mutate, isPending } = useLogin()

const onSubmit = handleSubmit((values) => {
  mutate(values, {
    onError: (error) => {
      // Backend mengirim pesan berbahasa Inggris ("Invalid email or password").
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error('Email atau password salah')
        return
      }
      toast.error(toErrorToast(error, 'Gagal masuk, coba lagi'))
    },
  })
})
</script>

<template>
  <form class="space-y-4" novalidate @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>Email <RequiredMark /></FormLabel>
        <!-- FormControl harus langsung membungkus <Input> supaya id, aria-invalid, dan label terhubung ke input. -->
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
          <PasswordInput autocomplete="current-password" placeholder="Password Anda" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" size="lg" class="w-full" :disabled="isPending">
      {{ isPending ? 'Memproses...' : 'Masuk' }}
    </Button>
  </form>
</template>
