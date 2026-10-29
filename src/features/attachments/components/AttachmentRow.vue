<script setup lang="ts">
import { ExternalLink, Link2, Pencil, Trash2 } from '@lucide/vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { formatRelative } from '@/lib/date'
import { getDomain, isHttpUrl } from '../lib/url'
import type { ProjectAttachment } from '../types'

const props = defineProps<{
  attachment: ProjectAttachment
  /** Pembuat lampiran atau admin project. Backend tetap memvalidasi. */
  canManage: boolean
}>()

const emit = defineEmits<{
  edit: [attachment: ProjectAttachment]
  delete: [attachment: ProjectAttachment]
}>()

const domain = computed(() => getDomain(props.attachment.url))
// Lapisan pertahanan kedua: jangan pernah merender href selain http(s), apa pun isi data dari server.
const safeHref = computed(() => (isHttpUrl(props.attachment.url) ? props.attachment.url : null))
</script>

<template>
  <li class="flex items-center gap-3 px-4 py-3 sm:px-6">
    <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
      <Link2 class="size-5" aria-hidden="true" />
    </span>

    <div class="min-w-0 flex-1">
      <a
        v-if="safeHref"
        :href="safeHref"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex max-w-full items-center gap-1.5 font-medium hover:underline"
      >
        <span class="truncate">{{ attachment.title }}</span>
        <ExternalLink class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span class="sr-only">(buka di tab baru)</span>
      </a>
      <span v-else class="block truncate font-medium">{{ attachment.title }}</span>
      <p class="truncate text-sm text-muted-foreground">{{ domain }}</p>
      <p class="text-xs text-muted-foreground">
        Ditambahkan oleh {{ attachment.created_by.name }} · {{ formatRelative(attachment.created_at) }}
      </p>
    </div>

    <div v-if="canManage" class="flex shrink-0 items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        class="text-muted-foreground"
        :aria-label="`Edit ${attachment.title}`"
        @click="emit('edit', attachment)"
      >
        <Pencil />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        class="text-muted-foreground hover:text-destructive"
        :aria-label="`Hapus ${attachment.title}`"
        @click="emit('delete', attachment)"
      >
        <Trash2 />
      </Button>
    </div>
  </li>
</template>
