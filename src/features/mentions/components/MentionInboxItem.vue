<script setup lang="ts">
import { Lock } from '@lucide/vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { formatRelative } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { MentionInboxItem } from '../types'

defineProps<{ item: MentionInboxItem }>()
const emit = defineEmits<{ open: [item: MentionInboxItem] }>()
</script>

<template>
  <button
    type="button"
    :class="
      cn(
        'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:bg-muted/60 sm:px-5',
        !item.read_at && 'bg-violet-500/5 dark:bg-violet-400/10',
        !item.has_access && 'text-muted-foreground',
      )
    "
    :aria-label="`${item.mentioned_by.name} me-mention kamu di ${item.task.title}${item.read_at ? '' : ' (belum dibaca)'}`"
    @click="emit('open', item)"
  >
    <UserAvatar
      :id="item.mentioned_by.id"
      :name="item.mentioned_by.name"
      :class="cn('mt-0.5 size-9 shrink-0', !item.has_access && 'opacity-60')"
    />

    <div class="min-w-0 flex-1 space-y-1">
      <p class="text-sm">
        <span class="font-semibold" :class="item.has_access && 'text-foreground'">{{ item.mentioned_by.name }}</span>
        me-mention kamu di
        <span class="font-medium" :class="item.has_access && 'text-foreground'">{{ item.task.title }}</span>
      </p>
      <p v-if="item.snippet" class="line-clamp-2 text-sm text-muted-foreground">{{ item.snippet }}</p>
      <p class="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
        <Lock v-if="!item.has_access" class="size-3" aria-hidden="true" />
        <span class="truncate">{{ item.project.name }}</span>
        <span aria-hidden="true">·</span>
        <time :datetime="item.created_at">{{ formatRelative(item.created_at) }}</time>
        <template v-if="!item.has_access">
          <span aria-hidden="true">·</span>
          <span>Tidak ada akses</span>
        </template>
      </p>
    </div>

    <span
      v-if="!item.read_at"
      class="mt-2 size-2 shrink-0 rounded-full bg-violet-600 dark:bg-violet-400"
      aria-hidden="true"
    />
  </button>
</template>
