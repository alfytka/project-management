<script setup lang="ts">
import { EPIC_STATUS_META } from '../lib/status'
import type { EpicStatus } from '../types'

defineProps<{ status: EpicStatus }>()
</script>

<template>
  <span
    :class="[
      EPIC_STATUS_META[status].badge,
      'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium',
    ]"
  >
    <span :class="[EPIC_STATUS_META[status].dot, 'size-1.5 rounded-full']" />
    {{ EPIC_STATUS_META[status].label }}
  </span>
</template>
