<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Epic } from '../types'

defineProps<{
  epic: Epic
}>()

const emit = defineEmits<{
  (e: 'open', epic: Epic): void
  (e: 'edit', epic: Epic): void
  (e: 'delete', epic: Epic): void
}>()

const is_open = ref(false)
const menu_ref = ref<HTMLElement | null>(null)

function toggleMenu(event: MouseEvent) {
  event.stopPropagation()
  is_open.value = !is_open.value
}

function handleAction(action: 'open' | 'edit' | 'delete', epic: Epic, event: MouseEvent) {
  event.stopPropagation()
  is_open.value = false
  if (action === 'open') {
  emit('open', epic)
} else if (action === 'edit') {
  emit('edit', epic)
} else if (action === 'delete') {
  emit('delete', epic)
}
}

function handleClickOutside(event: MouseEvent) {
  if (menu_ref.value && !menu_ref.value.contains(event.target as Node)) {
    is_open.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="menu_ref" class="relative inline-block text-left">
    <button
      type="button"
      class="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
      @click="toggleMenu"
    >
      <span class="text-base font-bold">⋮</span>
    </button>

    <div
      v-if="is_open"
      class="absolute right-0 mt-1 w-40 rounded-xl bg-white border border-slate-200 shadow-lg py-1 z-20 text-xs text-slate-700"
    >
      <button
        type="button"
        class="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        @click="handleAction('open', epic, $event)"
      >
        <span>📁</span>
        <span>Buka epic</span>
      </button>

      <button
        type="button"
        class="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors"
        @click="handleAction('edit', epic, $event)"
      >
        <span>✏️</span>
        <span>Edit epic</span>
      </button>

      <button
        type="button"
        class="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition-colors font-medium"
        @click="handleAction('delete', epic, $event)"
      >
        <span>🗑️</span>
        <span>Hapus epic</span>
      </button>
    </div>
  </div>
</template>