<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { computed } from 'vue'
import DatePicker from '@/components/DatePicker.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppSelectContent from '@/components/AppSelectContent.vue'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Status } from '@/features/statuses/types'
import { TASK_PRIORITIES, type TaskAssignee, type TaskFilters, type TaskPriority } from '../types'

const props = defineProps<{
  statuses: Status[]
  members: TaskAssignee[]
  currentUserId?: string
}>()

const filters = defineModel<TaskFilters>('filters', { required: true })
const search = defineModel<string>('search', { required: true })

// Reka Select tidak menerima value kosong, jadi "semua" memakai sentinel.
const ALL = 'all'

function bind<K extends keyof TaskFilters>(key: K) {
  return computed({
    get: () => filters.value[key] ?? ALL,
    set: (value: string) => {
      filters.value = { ...filters.value, [key]: value === ALL ? undefined : (value as TaskFilters[K]) }
    },
  })
}

const status = bind('status')
const assignee = bind('assignee')
const priority = bind('priority')
const dueBefore = computed({
  get: () => filters.value.due_before,
  set: (value) => (filters.value = { ...filters.value, due_before: value }),
})

const otherMembers = computed(() => props.members.filter((member) => member.user_id !== props.currentUserId))
const hasFilter = computed(() => !!search.value || Object.values(filters.value).some(Boolean))

function reset() {
  filters.value = {}
  search.value = ''
}

const priorities: TaskPriority[] = [...TASK_PRIORITIES]
</script>

<template>
  <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
    <div class="relative col-span-2 sm:w-64">
      <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="task-search"
        v-model="search"
        name="task-search"
        type="search"
        autocomplete="off"
        placeholder="Cari task..."
        aria-label="Cari task"
        class="h-9 pl-9"
      />
    </div>

    <Select v-model="status">
      <SelectTrigger class="w-full sm:w-40" aria-label="Filter status"><SelectValue /></SelectTrigger>
      <AppSelectContent>
        <SelectItem :value="ALL">Semua status</SelectItem>
        <SelectItem v-for="item in statuses" :key="item.id" :value="item.id">{{ item.name }}</SelectItem>
      </AppSelectContent>
    </Select>

    <Select v-model="assignee">
      <SelectTrigger class="w-full sm:w-44" aria-label="Filter assignee"><SelectValue /></SelectTrigger>
      <AppSelectContent>
        <SelectItem :value="ALL">Semua assignee</SelectItem>
        <SelectItem v-if="currentUserId" :value="currentUserId">Tugas saya</SelectItem>
        <SelectItem v-for="member in otherMembers" :key="member.user_id" :value="member.user_id">
          {{ member.name }}
        </SelectItem>
      </AppSelectContent>
    </Select>

    <Select v-model="priority">
      <SelectTrigger class="w-full sm:w-40" aria-label="Filter prioritas"><SelectValue /></SelectTrigger>
      <AppSelectContent>
        <SelectItem :value="ALL">Semua prioritas</SelectItem>
        <SelectItem v-for="item in priorities" :key="item" :value="item">{{ item }}</SelectItem>
      </AppSelectContent>
    </Select>

    <DatePicker v-model="dueBefore" clearable placeholder="Due sebelum..." class="sm:w-44" aria-label="Due sebelum" />

    <Button v-if="hasFilter" variant="ghost" size="sm" class="col-span-2 sm:col-span-1" @click="reset">
      <X /> Reset filter
    </Button>
  </div>
</template>
