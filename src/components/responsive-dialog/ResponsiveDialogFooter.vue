<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { RESPONSIVE_DIALOG_DESKTOP } from './context'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

// Di luar ResponsiveDialog (mis. form di halaman) tombol cukup rata kanan.
const isDesktop = inject(RESPONSIVE_DIALOG_DESKTOP, null)

const layoutClass = computed(() => {
  if (!isDesktop) return 'flex justify-end gap-2 pt-4'
  if (isDesktop.value) return 'flex justify-end gap-2 p-6 pt-4'
  // Mobile: footer sticky di bawah sheet, tombol sama lebar berdampingan.
  return 'grid shrink-0 auto-cols-fr grid-flow-col gap-3 border-t px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] *:h-11 *:w-full'
})
</script>

<template>
  <div :class="cn(layoutClass, props.class)">
    <slot />
  </div>
</template>
