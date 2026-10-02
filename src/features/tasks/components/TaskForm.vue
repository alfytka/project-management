<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import RequiredMark from '@/components/RequiredMark.vue'
import DatePicker from '@/components/DatePicker.vue'
import { ResponsiveDialogBody, ResponsiveDialogFooter } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AppSelectContent from '@/components/AppSelectContent.vue'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { EpicListItem } from '@/features/epics/types'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'
import { toErrorToast } from '@/lib/api-errors'
import { useCreateTask } from '../composables/useCreateTask'
import { taskSchema } from '../schema'
import type { TaskAssignee } from '../types'
import AssigneePicker from './AssigneePicker.vue'
import PrioritySelect from './PrioritySelect.vue'
import StatusSelect from './StatusSelect.vue'

const props = defineProps<{
  /** Epic terkunci (dari halaman detail epic); kosong → user memilih epic. */
  epicId?: string
  epics: EpicListItem[]
  statuses: Status[]
  colorOf: (statusId: string) => StatusColor
  members: TaskAssignee[]
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const { handleSubmit } = useForm({
  validationSchema: taskSchema,
  initialValues: {
    title: '',
    description: '',
    epic_id: props.epicId ?? '',
    status_id: props.statuses.find((status) => status.is_default)?.id ?? props.statuses[0]?.id,
    priority: 'Medium' as const,
    due_date: undefined,
    assignee_ids: [],
  },
})

const { mutate, isPending } = useCreateTask()

const onSubmit = handleSubmit((values) => {
  mutate(
    {
      epicId: values.epic_id,
      payload: {
        title: values.title,
        description: values.description?.trim() || undefined,
        priority: values.priority,
        due_date: values.due_date || undefined,
        status_id: values.status_id,
      },
      assigneeIds: values.assignee_ids,
    },
    {
      onSuccess: () => emit('saved'),
      onError: (error) => toast.error(toErrorToast(error, 'Gagal membuat task, coba lagi')),
    },
  )
})
</script>

<template>
  <form class="flex min-h-0 flex-1 flex-col" @submit="onSubmit">
    <ResponsiveDialogBody class="space-y-4">
      <FormField v-slot="{ componentField }" name="title">
        <FormItem>
          <FormLabel>Judul <RequiredMark /></FormLabel>
          <FormControl>
            <Input autocomplete="off" placeholder="Contoh: Implementasi hero section" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-if="!epicId" v-slot="{ value, handleChange }" name="epic_id">
        <FormItem>
          <FormLabel>Module <RequiredMark /></FormLabel>
          <!-- Tanpa `name`: Reka tidak merender <select> native tersembunyi; nilai dikelola vee-validate. -->
          <Select :model-value="value" @update:model-value="handleChange">
            <FormControl>
              <SelectTrigger class="w-full"><SelectValue placeholder="Pilih module" /></SelectTrigger>
            </FormControl>
            <AppSelectContent>
              <SelectItem v-for="epic in epics" :key="epic.id" :value="epic.id">{{ epic.title }}</SelectItem>
            </AppSelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField v-slot="{ value, handleChange }" name="status_id">
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <StatusSelect :model-value="value" :statuses="statuses" :color-of="colorOf" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="priority">
          <FormItem>
            <FormLabel>Prioritas <RequiredMark /></FormLabel>
            <FormControl>
              <PrioritySelect :model-value="value" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="due_date">
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <DatePicker :model-value="value" clearable placeholder="Tanpa due date" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ value, handleChange }" name="assignee_ids">
          <FormItem>
            <FormLabel>Assignee</FormLabel>
            <FormControl>
              <AssigneePicker :model-value="value" :members="members" @update:model-value="handleChange" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Deskripsi</FormLabel>
          <FormControl>
            <Textarea autocomplete="off" placeholder="Detail pekerjaan (opsional)" rows="3" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </ResponsiveDialogBody>

    <ResponsiveDialogFooter>
      <Button type="button" variant="outline" :disabled="isPending" @click="emit('cancel')">Batal</Button>
      <Button type="submit" :disabled="isPending">{{ isPending ? 'Menyimpan...' : 'Buat Task' }}</Button>
    </ResponsiveDialogFooter>
  </form>
</template>
