<script setup lang="ts">
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import RequiredMark from '@/components/RequiredMark.vue'
import { ResponsiveDialogBody, ResponsiveDialogFooter } from '@/components/responsive-dialog'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toErrorToast } from '@/lib/api-errors'
import { useCreateProject } from '../composables/useCreateProject'
import { useUpdateProject } from '../composables/useUpdateProject'
import { projectSchema } from '../schema'

const props = defineProps<{
  project?: { id: string; name: string; description: string | null }
}>()

const emit = defineEmits<{ saved: []; cancel: [] }>()

const { handleSubmit } = useForm({
  validationSchema: projectSchema,
  initialValues: {
    name: props.project?.name ?? '',
    description: props.project?.description ?? '',
  },
})

const create = useCreateProject()
const update = useUpdateProject()

const isPending = computed(() => create.isPending.value || update.isPending.value)

function onError(error: unknown) {
  toast.error(toErrorToast(error, 'Gagal menyimpan project, coba lagi'))
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
  <form class="flex min-h-0 flex-1 flex-col" @submit="onSubmit">
    <ResponsiveDialogBody class="space-y-4">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem>
          <FormLabel>Nama Project <RequiredMark /></FormLabel>
          <FormControl>
            <Input type="text" autocomplete="off" placeholder="Nama project" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Deskripsi</FormLabel>
          <FormControl>
            <Textarea autocomplete="off" placeholder="Deskripsi singkat (opsional)" rows="4" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </ResponsiveDialogBody>

    <ResponsiveDialogFooter>
      <Button type="button" variant="outline" :disabled="isPending" @click="emit('cancel')">
        Batal
      </Button>
      <Button type="submit" :disabled="isPending">
        {{ isPending ? 'Menyimpan...' : 'Simpan' }}
      </Button>
    </ResponsiveDialogFooter>
  </form>
</template>
