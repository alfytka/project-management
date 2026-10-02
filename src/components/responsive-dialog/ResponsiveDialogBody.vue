<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { RESPONSIVE_DIALOG_DESKTOP } from './context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

// Di luar ResponsiveDialog (mis. form di halaman) komponen ini hanya pembungkus biasa.
const isDesktop = inject(RESPONSIVE_DIALOG_DESKTOP, null)

const layoutClass = computed(() => {
  if (!isDesktop) return ''
  return cn('min-h-0 flex-1 overflow-y-auto', isDesktop.value ? 'px-6 pb-2' : 'px-5 py-4')
})
</script>

<template>
  <div :class="cn(layoutClass, props.class)">
    <slot />
  </div>
</template>
