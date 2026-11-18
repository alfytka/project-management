<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

/**
 * Logo aplikasi (huruf P geometris) — dipakai di sidebar dan halaman auth supaya identitasnya sama.
 * Ukuran diatur lewat `class` (default `size-8`); sudut 25% supaya proporsinya sama di semua ukuran.
 * Versi favicon ada di `public/favicon.svg`.
 */
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <span
    :class="cn('flex size-8 shrink-0 items-center justify-center rounded-[25%] bg-violet-600 text-white', props.class)"
    aria-hidden="true"
  >
    <svg viewBox="0 0 32 32" fill="none" class="size-full">
      <path
        d="M11.5 24V8.5h6.5a5 5 0 0 1 0 10h-6.5"
        stroke="currentColor"
        stroke-width="3.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="21.5" cy="23" r="2" fill="currentColor" fill-opacity="0.6" />
    </svg>
  </span>
</template>
