<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import RequiredMark from '@/components/RequiredMark.vue'
import AppSelectContent from '@/components/AppSelectContent.vue'
import { ResponsiveDialogBody, ResponsiveDialogFooter } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toErrorToast } from '@/lib/api-errors'
import { useAddMember } from '../composables/useAddMember'
import { memberSchema } from '../schema'

const props = defineProps<{ projectId: string }>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const { handleSubmit } = useForm({
  validationSchema: memberSchema,
  initialValues: { email: '', role: 'member' as const },
})

const { mutate, isPending } = useAddMember(() => props.projectId)

const onSubmit = handleSubmit((values) => {
  mutate(values, {
    onSuccess: () => emit('saved'),
    onError: (error) => {
      toast.error(toErrorToast(error, 'Gagal menambahkan member, coba lagi'))
    },
  })
})
</script>

<template>
  <form class="flex min-h-0 flex-1 flex-col" @submit="onSubmit">
    <ResponsiveDialogBody class="space-y-4">
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email <RequiredMark /></FormLabel>
          <FormControl>
            <Input type="email" autocomplete="off" placeholder="nama@perusahaan.com" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ value, handleChange }" name="role">
        <FormItem>
          <FormLabel>Role <RequiredMark /></FormLabel>
          <!-- Tanpa `name`: Reka tidak merender <select> native tersembunyi; nilai dikelola vee-validate. -->
          <Select :model-value="value" @update:model-value="handleChange">
            <FormControl>
              <SelectTrigger class="w-full"><SelectValue /></SelectTrigger>
            </FormControl>
            <AppSelectContent>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </AppSelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </ResponsiveDialogBody>

    <ResponsiveDialogFooter>
      <Button type="button" variant="outline" :disabled="isPending" @click="emit('cancel')">Batal</Button>
      <Button type="submit" :disabled="isPending">
        {{ isPending ? 'Menambahkan...' : 'Tambah' }}
      </Button>
    </ResponsiveDialogFooter>
  </form>
</template>
