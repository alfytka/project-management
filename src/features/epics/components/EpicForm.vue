<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import RequiredMark from '@/components/RequiredMark.vue'
import DatePicker from '@/components/DatePicker.vue'
import { ResponsiveDialogBody, ResponsiveDialogFooter } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toErrorToast } from '@/lib/api-errors'
import { toDateInput } from '@/lib/date'
import { singleFlight } from '@/lib/single-flight'
import { useCreateEpic } from '../composables/useCreateEpic'
import { useUpdateEpic } from '../composables/useUpdateEpic'
import { epicSchema } from '../schema'
import type { EpicDetail } from '../types'

const props = defineProps<{
  projectId: string
  epic?: EpicDetail
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const { handleSubmit, values: formValues } = useForm({
  validationSchema: epicSchema,
  initialValues: {
    title: props.epic?.title ?? '',
    description: props.epic?.description ?? '',
    start_date: props.epic ? toDateInput(props.epic.start_date) : '',
    end_date: props.epic ? toDateInput(props.epic.end_date) : '',
  },
})

const create = useCreateEpic(() => props.projectId)
const update = useUpdateEpic()

const isPending = computed(() => create.isPending.value || update.isPending.value)

function onError(error: unknown) {
  toast.error(toErrorToast(error, 'Gagal menyimpan module, coba lagi'))
}

const onSubmit = singleFlight(
  handleSubmit(async (values) => {
    const description = values.description?.trim() ?? ''
    try {
      if (props.epic) {
        // Kirim string kosong supaya deskripsi yang dihapus user ikut terhapus di server.
        await update.mutateAsync({ id: props.epic.id, payload: { ...values, description } })
      } else {
        await create.mutateAsync({ ...values, description: description || undefined })
      }
      emit('saved')
    } catch (error) {
      onError(error)
    }
  }),
)
</script>

<template>
  <form class="flex min-h-0 flex-1 flex-col" @submit="onSubmit">
    <ResponsiveDialogBody class="space-y-4">
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormLabel>Judul <RequiredMark /></FormLabel>
          <FormControl>
            <Input type="text" autocomplete="off" placeholder="Contoh: Redesign Halaman Utama" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Deskripsi</FormLabel>
          <FormControl>
            <Textarea autocomplete="off" placeholder="Deskripsi singkat (opsional)" rows="3" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField v-slot="{ value, handleChange }" name="start_date">
          <FormItem>
            <FormLabel>Tanggal Mulai <RequiredMark /></FormLabel>
            <FormControl>
              <DatePicker :model-value="value" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="end_date">
          <FormItem>
            <FormLabel>Tanggal Selesai <RequiredMark /></FormLabel>
            <FormControl>
              <DatePicker :model-value="value" :min="formValues.start_date || undefined" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </ResponsiveDialogBody>

    <ResponsiveDialogFooter>
      <Button type="button" variant="outline" :disabled="isPending" @click="emit('cancel')">Batal</Button>
      <Button type="submit" :disabled="isPending">
        {{ isPending ? 'Menyimpan...' : 'Simpan' }}
      </Button>
    </ResponsiveDialogFooter>
  </form>
</template>
