<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { extractErrorMessage, extractValidationIssues, isNetworkError } from '@/lib/api-errors'
import { useAddMember } from '../composables/useAddMember'
import { memberSchema } from '../schema'

const props = defineProps<{ projectId: string }>()

const open = defineModel<boolean>('open', { required: true })

const { handleSubmit, setFieldError, resetForm } = useForm({
  validationSchema: memberSchema,
  initialValues: { email: '', role: 'member' as const },
})

const { mutate, isPending } = useAddMember(props.projectId)

const onSubmit = handleSubmit((values) => {
  mutate(values, {
    onSuccess: () => {
      open.value = false
      resetForm()
    },
    onError: (error) => {
      const issues = extractValidationIssues(error)
      if (issues) {
        for (const issue of issues) {
          setFieldError(issue.field as 'email' | 'role', issue.message)
        }
        return
      }
      toast.error(
        isNetworkError(error)
          ? 'Tidak dapat terhubung ke server'
          : extractErrorMessage(error, 'Gagal menambahkan member, coba lagi'),
      )
    },
  })
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Tambah Member</DialogTitle>
        <DialogDescription>Undang pengguna terdaftar lewat email.</DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="nama@perusahaan.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="role">
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <NativeSelect class="w-full" v-bind="componentField">
                <NativeSelectOption value="member">Member</NativeSelectOption>
                <NativeSelectOption value="admin">Admin</NativeSelectOption>
              </NativeSelect>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-end gap-2">
          <Button type="button" variant="outline" :disabled="isPending" @click="open = false">
            Batal
          </Button>
          <Button type="submit" :disabled="isPending">
            {{ isPending ? 'Menambahkan...' : 'Tambah' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
