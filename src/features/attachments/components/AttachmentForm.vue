<script setup lang="ts">
import { isAxiosError } from 'axios'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import RequiredMark from '@/components/RequiredMark.vue'
import { ResponsiveDialogBody, ResponsiveDialogFooter } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toErrorToast } from '@/lib/api-errors'
import { useCreateAttachment } from '../composables/useCreateAttachment'
import { useUpdateAttachment } from '../composables/useUpdateAttachment'
import { attachmentSchema } from '../schema'
import { ATTACHMENT_LIMIT, type ProjectAttachment } from '../types'
import { getDomain } from '../lib/url'

const props = defineProps<{
  projectId: string
  count: number
  attachment?: ProjectAttachment | null
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const { handleSubmit, setFieldError } = useForm({
  validationSchema: attachmentSchema,
  initialValues: {
    url: props.attachment?.url ?? '',
    title: props.attachment?.title ?? '',
  },
})

const create = useCreateAttachment(() => props.projectId)
const update = useUpdateAttachment()
const isPending = computed(() => create.isPending.value || update.isPending.value)

function onError(error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status
    if (status === 400) {
      setFieldError('url', 'URL tidak valid. Gunakan alamat yang diawali http:// atau https://')
      return
    }
    if (status === 409) {
      if (!props.attachment && props.count >= ATTACHMENT_LIMIT) {
        toast.error(`Batas ${ATTACHMENT_LIMIT} lampiran per project sudah tercapai`)
      } else {
        setFieldError('url', 'URL ini sudah dilampirkan di project ini')
      }
      return
    }
    if (status === 403) {
      toast.error('Anda tidak punya akses untuk mengubah lampiran ini')
      return
    }
  }
  toast.error(toErrorToast(error, 'Gagal menyimpan lampiran, coba lagi'))
}

const onSubmit = handleSubmit((values) => {
  const title = values.title?.trim() ?? ''
  const callbacks = { onSuccess: () => emit('saved'), onError }

  if (props.attachment) {
    update.mutate({ id: props.attachment.id, payload: { url: values.url, title: title || getDomain(values.url) } }, callbacks)
  } else {
    create.mutate({ url: values.url, title: title || undefined }, callbacks)
  }
})
</script>

<template>
  <form class="flex min-h-0 flex-1 flex-col" novalidate @submit="onSubmit">
    <ResponsiveDialogBody class="space-y-4">
      <FormField v-slot="{ componentField }" name="url" :validate-on-blur="false">
        <FormItem>
          <FormLabel>URL <RequiredMark /></FormLabel>
          <FormControl>
            <Input
              type="url"
              inputmode="url"
              autocomplete="off"
              placeholder="https://..."
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="title" :validate-on-blur="false">
        <FormItem>
          <FormLabel>Judul</FormLabel>
          <FormControl>
            <Input
              type="text"
              autocomplete="off"
              placeholder="Judul otomatis dari domain jika kosong"
              v-bind= "componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </ResponsiveDialogBody>

    <ResponsiveDialogFooter>
      <Button type="button" variant="outline" :disabled="isPending" @click="emit('cancel')">Batal</Button>
      <Button type="submit" :disabled="isPending">
        {{ isPending ? 'Menyimpan...' : 'Simpan' }}
      </Button>
    </ResponsiveDialogFooter>
  </form>
</template>
