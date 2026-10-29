<script setup lang="ts">
import { Paperclip, Plus } from '@lucide/vue'
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import AttachmentFormDialog from '@/features/attachments/components/AttachmentFormDialog.vue'
import AttachmentRow from '@/features/attachments/components/AttachmentRow.vue'
import DeleteAttachmentDialog from '@/features/attachments/components/DeleteAttachmentDialog.vue'
import { useProjectAttachments } from '@/features/attachments/composables/useProjectAttachments'
import { ATTACHMENT_LIMIT, type ProjectAttachment } from '@/features/attachments/types'
import { useCurrentProject } from '../../composables/useCurrentProject'

const { projectId } = useCurrentProject()
const { data, isPending, isError, refetch } = useProjectAttachments(projectId)

const attachments = computed(() => data.value ?? [])
const atLimit = computed(() => attachments.value.length >= ATTACHMENT_LIMIT)

const formOpen = ref(false)
const editing = ref<ProjectAttachment | null>(null)
const deleteOpen = ref(false)
const deleting = ref<ProjectAttachment | null>(null)

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(attachment: ProjectAttachment) {
  editing.value = attachment
  formOpen.value = true
}

function openDelete(attachment: ProjectAttachment) {
  deleting.value = attachment
  deleteOpen.value = true
}
</script>

<template>
  <section class="overflow-hidden rounded-2xl border bg-card shadow-xs">
    <div class="flex flex-wrap items-center gap-4 p-4 sm:px-6">
      <div class="min-w-0 flex-1 space-y-0.5">
        <h2 class="text-lg font-semibold">Lampiran</h2>
        <p class="text-sm text-muted-foreground">
          Link Figma, Drive, Notion, GitHub, atau referensi lain untuk project ini.
          <span v-if="attachments.length" class="tabular-nums">{{ attachments.length }}/{{ ATTACHMENT_LIMIT }}</span>
        </p>
      </div>
      <Button
        size="lg"
        class="w-full sm:w-auto"
        :disabled="atLimit"
        :title="atLimit ? `Batas ${ATTACHMENT_LIMIT} lampiran per project sudah tercapai` : undefined"
        @click="openCreate"
      >
        <Plus /> Tambah Lampiran
      </Button>
    </div>

    <div v-if="isPending" class="space-y-3 border-t p-4 sm:px-6">
      <Skeleton v-for="n in 3" :key="n" class="h-14 rounded-xl" />
    </div>

    <div v-else-if="isError" class="space-y-2 border-t p-4 text-sm text-muted-foreground sm:px-6">
      <p>Gagal memuat lampiran.</p>
      <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
    </div>

    <div
      v-else-if="!attachments.length"
      class="flex flex-col items-center gap-3 border-t px-6 py-16 text-center"
    >
      <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Paperclip class="size-6" />
      </span>
      <div class="space-y-1">
        <p class="font-medium">Belum ada lampiran</p>
        <p class="text-sm text-muted-foreground">Tempel link agar semua member bisa menemukannya di satu tempat.</p>
      </div>
      <Button size="sm" @click="openCreate"><Plus /> Tambah Lampiran</Button>
    </div>

    <ul v-else class="divide-y border-t">
      <AttachmentRow
        v-for="attachment in attachments"
        :key="attachment.id"
        :attachment="attachment"
        :can-manage="attachment.can_edit"
        @edit="openEdit"
        @delete="openDelete"
      />
    </ul>
  </section>

  <AttachmentFormDialog
    v-model:open="formOpen"
    :project-id="projectId"
    :count="attachments.length"
    :attachment="editing"
  />
  <DeleteAttachmentDialog v-model:open="deleteOpen" :attachment="deleting" />
</template>
