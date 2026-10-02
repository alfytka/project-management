<script setup lang="ts">
import { Check, UserPlus } from '@lucide/vue'
import { computed, ref, useId } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { TaskAssignee } from '../types'

/**
 * Pilih banyak member project. `v-model` berisi user_id terpilih; event `toggle` dipancarkan
 * per perubahan supaya pemakai bisa langsung memanggil endpoint assign/unassign.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  members: TaskAssignee[]
  disabled?: boolean
}>()

const emit = defineEmits<{ toggle: [member: TaskAssignee, assigned: boolean] }>()

const model = defineModel<string[]>({ default: () => [] })

const search = ref('')
const searchId = useId()
const selected = computed(() => props.members.filter((member) => model.value.includes(member.user_id)))
const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  return props.members.filter(
    (member) => !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query),
  )
})

function toggle(member: TaskAssignee) {
  const assigned = !model.value.includes(member.user_id)
  model.value = assigned
    ? [...model.value, member.user_id]
    : model.value.filter((id) => id !== member.user_id)
  emit('toggle', member, assigned)
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <button
        type="button"
        v-bind="$attrs"
        :disabled="disabled"
        class="flex min-h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1.5 text-left text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30"
      >
        <template v-if="selected.length">
          <div class="flex -space-x-1.5">
            <UserAvatar
              v-for="member in selected.slice(0, 3)"
              :id="member.user_id"
              :key="member.user_id"
              :name="member.name"
              class="size-6 ring-2 ring-background"
            />
          </div>
          <span class="truncate">
            {{ selected.length === 1 ? selected[0]!.name : `${selected.length} orang` }}
          </span>
        </template>
        <span v-else class="inline-flex items-center gap-2 text-muted-foreground">
          <UserPlus class="size-4" /> Pilih assignee
        </span>
      </button>
    </PopoverTrigger>
    <PopoverContent class="w-(--reka-popover-trigger-width) min-w-64 p-2" align="start">
      <Input
        :id="searchId"
        v-model="search"
        name="assignee-search"
        type="search"
        autocomplete="off"
        placeholder="Cari member..."
        aria-label="Cari member"
        class="mb-2 h-8"
      />
      <ul class="max-h-64 overflow-y-auto">
        <li v-for="member in filtered" :key="member.user_id">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
            :aria-pressed="model.includes(member.user_id)"
            @click="toggle(member)"
          >
            <UserAvatar :id="member.user_id" :name="member.name" class="size-7" />
            <span class="min-w-0 flex-1">
              <span class="block truncate font-medium">{{ member.name }}</span>
              <span class="block truncate text-xs text-muted-foreground">{{ member.email }}</span>
            </span>
            <Check :class="cn('size-4 shrink-0', model.includes(member.user_id) ? 'opacity-100' : 'opacity-0')" />
          </button>
        </li>
        <li v-if="!filtered.length" class="px-2 py-4 text-center text-sm text-muted-foreground">
          Tidak ada member yang cocok.
        </li>
      </ul>
    </PopoverContent>
  </Popover>
</template>
