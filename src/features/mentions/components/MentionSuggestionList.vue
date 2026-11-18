<script setup lang="ts">
import type { SuggestionKeyDownProps } from '@tiptap/suggestion'
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { cn } from '@/lib/utils'
import type { MentionNodeAttrs } from '../lib/description'

export interface MentionSuggestionItem {
  user_id: string
  name: string
  email: string
}

/** Dropdown autocomplete `@` — dirender oleh plugin suggestion TipTap lewat `VueRenderer`. */
const props = defineProps<{
  items: MentionSuggestionItem[]
  command: (attrs: MentionNodeAttrs) => void
  /** Nama (lowercase) yang dimiliki lebih dari satu member: email ditampilkan sebagai pembeda. */
  duplicateNames: Set<string>
}>()

const activeIndex = ref(0)
watch(
  () => props.items,
  () => (activeIndex.value = 0),
)

// Daftar bisa lebih tinggi dari max-h: jaga item aktif (navigasi ↑/↓) tetap terlihat.
const options = useTemplateRef<HTMLElement[]>('options')
watch(activeIndex, async (index) => {
  await nextTick()
  options.value?.[index]?.scrollIntoView({ block: 'nearest' })
})

function select(index: number) {
  const item = props.items[index]
  if (item) props.command({ id: item.email, label: item.name, inactive: false })
}

function onKeyDown({ event }: SuggestionKeyDownProps) {
  const count = props.items.length
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (count) activeIndex.value = (activeIndex.value + (event.key === 'ArrowDown' ? 1 : count - 1)) % count
    return true
  }
  if (event.key === 'Enter' || event.key === 'Tab') {
    if (!count) return false
    select(activeIndex.value)
    return true
  }
  return false
}

defineExpose({ onKeyDown })
</script>

<template>
  <div
    class="z-50 max-h-64 w-64 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
    role="listbox"
    aria-label="Mention member"
    @mousedown.prevent
  >
    <p v-if="!items.length" class="px-2 py-1.5 text-sm text-muted-foreground">Tidak ada member yang cocok</p>
    <!-- mousedown.prevent di root: klik di mana pun pada dropdown (item, padding, scrollbar) tidak
         membuat editor kehilangan fokus, yang akan memicu simpan & menutup editor. -->
    <button
      v-for="(item, index) in items"
      :key="item.user_id"
      ref="options"
      type="button"
      role="option"
      :aria-selected="index === activeIndex"
      :class="
        cn(
          'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none',
          index === activeIndex && 'bg-accent text-accent-foreground',
        )
      "
      @mouseenter="activeIndex = index"
      @click="select(index)"
    >
      <UserAvatar :id="item.user_id" :name="item.name" class="size-6" aria-hidden="true" />
      <span class="min-w-0 flex-1">
        <span class="block truncate font-medium">{{ item.name }}</span>
        <span v-if="duplicateNames.has(item.name.trim().toLowerCase())" class="block truncate text-xs text-muted-foreground">
          {{ item.email }}
        </span>
      </span>
    </button>
  </div>
</template>
