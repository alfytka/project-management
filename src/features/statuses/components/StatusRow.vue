<script setup lang="ts">
import { Check, GripVertical, Pencil, Star, Trash2, X } from '@lucide/vue'
import { nextTick, ref, useTemplateRef } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toErrorToast } from '@/lib/api-errors'
import { useUpdateStatus } from '../composables/useUpdateStatus'
import { statusNameSchema } from '../schema'
import type { Status } from '../types'
import type { StatusColor } from '../lib/color'

const props = defineProps<{
  status: Status
  color: StatusColor
  readonly: boolean
}>()

const emit = defineEmits<{ delete: [status: Status] }>()

const { mutate: update, isPending } = useUpdateStatus()

function save(payload: Parameters<typeof update>[0]['payload'], message: string) {
  update(
    { id: props.status.id, payload },
    {
      onSuccess: () => toast.success(message),
      onError: (error) => toast.error(toErrorToast(error, 'Gagal memperbarui status, coba lagi')),
    },
  )
}

const editing = ref(false)
const draft = ref('')
const draftError = ref('')
const input = useTemplateRef<InstanceType<typeof Input>>('input')

async function startEdit() {
  draft.value = props.status.name
  draftError.value = ''
  editing.value = true
  await nextTick()
  ;(input.value?.$el as HTMLInputElement | undefined)?.focus()
}

function submitName() {
  const parsed = statusNameSchema.safeParse(draft.value)
  if (!parsed.success) {
    draftError.value = parsed.error.issues[0]!.message
    return
  }
  editing.value = false
  if (parsed.data !== props.status.name) save({ name: parsed.data }, 'Nama status diperbarui')
}
</script>

<template>
  <li class="flex flex-wrap items-center gap-x-3 gap-y-2 bg-card px-3 py-3 sm:px-4">
    <button
      v-if="!readonly"
      type="button"
      class="drag-handle -ml-1 flex size-8 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-accent active:cursor-grabbing"
      :aria-label="`Geser ${status.name}`"
    >
      <GripVertical class="size-4" />
    </button>

    <div class="flex min-w-0 flex-1 items-center gap-2">
      <span :class="[color.dot, 'size-2.5 shrink-0 rounded-full']" />
      <form v-if="editing" class="flex min-w-0 flex-1 items-center gap-1" @submit.prevent="submitName">
        <div class="min-w-0 flex-1">
          <Input
            :id="`status-name-${status.id}`"
            ref="input"
            v-model="draft"
            :name="`status-name-${status.id}`"
            autocomplete="off"
            class="h-8"
            :aria-invalid="!!draftError"
            aria-label="Nama status"
            @keydown.esc="editing = false"
          />
          <p v-if="draftError" class="mt-1 text-xs text-destructive">{{ draftError }}</p>
        </div>
        <Button type="submit" variant="ghost" size="icon-sm" aria-label="Simpan nama"><Check /></Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Batal" @click="editing = false"><X /></Button>
      </form>
      <template v-else>
        <span class="truncate font-medium">{{ status.name }}</span>
        <span
          v-if="status.is_default"
          class="shrink-0 rounded-full bg-violet-50 px-2 text-xs font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300"
        >
          Default
        </span>
        <Button
          v-if="!readonly"
          variant="ghost"
          size="icon-sm"
          class="shrink-0 text-muted-foreground"
          :aria-label="`Ubah nama ${status.name}`"
          @click="startEdit"
        >
          <Pencil />
        </Button>
      </template>
    </div>

    <div class="flex w-full items-center justify-end gap-2 pl-10 sm:w-auto sm:pl-0">
      <!--
        Switch Reka berupa <button>, bukan input — dibungkus <label> membuat Chrome melaporkan
        "label isn't associated with a form field". Label dihubungkan lewat aria-labelledby.
      -->
      <div class="mr-auto inline-flex items-center gap-2 text-sm text-muted-foreground sm:mr-2">
        <Switch
          :aria-labelledby="`status-done-label-${status.id}`"
          :model-value="status.is_done"
          :disabled="readonly || isPending"
          @update:model-value="save({ is_done: $event }, $event ? 'Status ditandai selesai' : 'Status tidak lagi menandai selesai')"
        />
        <span :id="`status-done-label-${status.id}`">Menandai Selesai</span>
      </div>
      <Button
        v-if="!readonly && !status.is_default"
        variant="outline"
        size="sm"
        :disabled="isPending"
        @click="save({ is_default: true }, `${status.name} jadi status default`)"
      >
        <Star /> Jadikan default
      </Button>
      <Button
        v-if="!readonly"
        variant="ghost"
        size="icon-sm"
        class="text-muted-foreground hover:text-destructive"
        :aria-label="`Hapus ${status.name}`"
        @click="emit('delete', status)"
      >
        <Trash2 />
      </Button>
    </div>
  </li>
</template>
