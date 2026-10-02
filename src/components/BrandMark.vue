<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

/** Logo aplikasi — dipakai di sidebar dan halaman auth supaya identitasnya sama. */
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <span
    :class="cn('flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white', props.class)"
    aria-hidden="true"
  >
    PM
  </span>
</template>
