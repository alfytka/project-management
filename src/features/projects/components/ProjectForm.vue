<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { extractValidationIssues, isNetworkError } from '@/lib/api-errors'
import { useCreateProject } from '../composables/useCreateProject'
import { useUpdateProject } from '../composables/useUpdateProject'
import { projectSchema } from '../schema'

const props = defineProps<{
  project?: { id: string; name: string; description: string | null }
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const { handleSubmit, setFieldError } = useForm({
  validationSchema: projectSchema,
  initialValues: {
    name: props.project?.name ?? '',
    description: props.project?.description ?? '',
  },
})

const create = useCreateProject()
const update = useUpdateProject()

const isPending = () => create.isPending.value || update.isPending.value

function onError(error: unknown) {
  const issues = extractValidationIssues(error)
  if (issues) {
    for (const issue of issues) {
      setFieldError(issue.field as 'name' | 'description', issue.message)
    }
    return
  }
  if (isNetworkError(error)) {
    toast.error('Tidak dapat terhubung ke server')
    return
  }
  toast.error('Gagal menyimpan project, coba lagi')
}

const onSubmit = handleSubmit((values) => {
  const description = values.description?.trim() || null
  const callbacks = { onSuccess: () => emit('saved'), onError }

  if (props.project) {
    update.mutate(
      { id: props.project.id, payload: { name: values.name, description } },
      callbacks,
    )
  } else {
    create.mutate({ name: values.name, description }, callbacks)
  }
})
</script>

<template>
  <form class="space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Nama Project</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Nama project" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Deskripsi</FormLabel>
        <FormControl>
          <Textarea placeholder="Deskripsi singkat (opsional)" rows="4" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-end gap-2">
      <Button type="button" variant="outline" :disabled="isPending()" @click="emit('cancel')">
        Batal
      </Button>
      <Button type="submit" :disabled="isPending()">
        {{ isPending() ? 'Menyimpan...' : 'Simpan' }}
      </Button>
    </div>
  </form>
</template>
