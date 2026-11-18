<script setup lang="ts">
import { AtSign, CheckCheck } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import AppSelectContent from '@/components/AppSelectContent.vue'
import { Button } from '@/components/ui/button'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/features/projects/composables/useProjects'
import MentionInboxItem from '../components/MentionInboxItem.vue'
import { useMarkAllMentionsRead, useMarkMentionRead } from '../composables/useMarkMentionsRead'
import { useMentionInbox } from '../composables/useMentionInbox'
import { useUnreadMentionCount } from '../composables/useUnreadMentionCount'
import type { MentionInboxItem as InboxItem } from '../types'

const router = useRouter()

const ALL = 'all'
const unreadOnly = ref(false)
const projectFilter = ref<string>(ALL)
const projectId = computed(() => (projectFilter.value === ALL ? undefined : projectFilter.value))

const { data: projects } = useProjects()
// Ikut filter project, supaya angka tab & tombol "Tandai semua" sesuai list yang tampil.
const { data: unreadCount } = useUnreadMentionCount(projectId)
const { items, isPending, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage } = useMentionInbox(
  () => ({ unread: unreadOnly.value, projectId: projectId.value }),
)

const { mutate: markRead } = useMarkMentionRead()
const { mutate: markAllRead, isPending: markingAll } = useMarkAllMentionsRead()

const hasUnread = computed(() => (unreadCount.value ?? 0) > 0)

function open(item: InboxItem) {
  if (!item.read_at) markRead(item.id)
  if (!item.has_access) {
    toast.error('Kamu sudah tidak punya akses ke project ini')
    return
  }
  router.push({ name: 'project-tasks', params: { id: item.project.id }, query: { task: item.task.id } })
}

const tabs = [
  { value: false, label: 'Semua' },
  { value: true, label: 'Belum dibaca' },
]

const segmentClass =
  'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs'
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="space-y-1">
      <h1 class="text-3xl font-bold tracking-tight">Mentions</h1>
      <p class="text-muted-foreground">Task yang menyebut kamu di deskripsinya.</p>
    </div>
    <Button variant="outline" :disabled="!hasUnread || markingAll" @click="markAllRead(projectId)">
      <CheckCheck /> Tandai semua dibaca
    </Button>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <div class="inline-flex items-center rounded-lg bg-muted p-1" role="tablist" aria-label="Filter status baca">
      <button
        v-for="tab in tabs"
        :key="tab.label"
        type="button"
        role="tab"
        :aria-selected="unreadOnly === tab.value"
        :data-active="unreadOnly === tab.value"
        :class="segmentClass"
        @click="unreadOnly = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.value && unreadCount" class="tabular-nums text-muted-foreground">{{ unreadCount }}</span>
      </button>
    </div>

    <Select v-model="projectFilter">
      <SelectTrigger class="w-full sm:w-56" aria-label="Filter project"><SelectValue /></SelectTrigger>
      <AppSelectContent>
        <SelectItem :value="ALL">Semua project</SelectItem>
        <SelectItem v-for="project in projects ?? []" :key="project.id" :value="project.id">{{ project.name }}</SelectItem>
      </AppSelectContent>
    </Select>
  </div>

  <section class="overflow-hidden rounded-2xl border bg-card shadow-xs">
    <div v-if="isPending" class="divide-y">
      <div v-for="n in 5" :key="n" class="flex gap-3 px-5 py-4">
        <Skeleton class="size-9 shrink-0 rounded-full" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-3 w-1/3" />
        </div>
      </div>
    </div>

    <div v-else-if="isError" class="space-y-2 px-5 py-10 text-center text-sm text-muted-foreground">
      <p>Gagal memuat mention.</p>
      <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
    </div>

    <div v-else-if="!items.length" class="flex flex-col items-center gap-3 px-5 py-16 text-center">
      <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <AtSign class="size-6" />
      </span>
      <div class="space-y-1">
        <p class="font-medium">{{ unreadOnly ? 'Semua mention sudah dibaca' : 'Belum ada yang me-mention kamu' }}</p>
        <p class="text-sm text-muted-foreground">
          {{
            unreadOnly
              ? 'Mention baru akan muncul di sini.'
              : 'Saat anggota tim menulis @namamu di deskripsi task, task itu akan muncul di sini.'
          }}
        </p>
      </div>
    </div>

    <ul v-else class="divide-y" aria-label="Daftar mention">
      <li v-for="item in items" :key="item.id">
        <MentionInboxItem :item="item" @open="open" />
      </li>
    </ul>

    <div v-if="hasNextPage" class="border-t p-3 text-center">
      <Button variant="ghost" size="sm" :disabled="isFetchingNextPage" @click="fetchNextPage()">
        {{ isFetchingNextPage ? 'Memuat...' : 'Muat lagi' }}
      </Button>
    </div>
  </section>
</template>
