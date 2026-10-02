<script setup lang="ts">
import { computed } from 'vue'
import { ResponsiveDialog, ResponsiveDialogBody } from '@/components/responsive-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useEpic } from '../composables/useEpic'
import EpicForm from './EpicForm.vue'

const props = defineProps<{
  projectId: string
  /** Id epic yang diedit; kosong = buat epic baru. */
  epicId?: string
}>()

const open = defineModel<boolean>('open', { required: true })

// Data edit diambil dari detail (cache dipakai ulang halaman detail) supaya selalu terbaru.
const { data: epic, isPending } = useEpic(() => (open.value && props.epicId) || '')
const loading = computed(() => !!props.epicId && isPending.value)
</script>

<template>
  <ResponsiveDialog
    v-model:open="open"
    :title="epicId ? 'Edit Module' : 'Buat Module'"
    :description="epicId ? 'Perbarui detail dan rentang tanggal module.' : 'Kelompokkan task dalam satu rentang waktu.'"
  >
    <ResponsiveDialogBody v-if="loading" class="space-y-4 pb-6">
      <Skeleton v-for="n in 3" :key="n" class="h-9 w-full" />
    </ResponsiveDialogBody>
    <!-- v-if + key: form di-reset setiap dialog dibuka / target edit berganti -->
    <EpicForm
      v-else-if="open"
      :key="epicId ?? 'new'"
      :project-id="projectId"
      :epic="epicId ? epic : undefined"
      @saved="open = false"
      @cancel="open = false"
    />
  </ResponsiveDialog>
</template>
