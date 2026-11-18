<script setup lang="ts">
import { MENTION_CHIP_CLASS } from '../lib/chip'

defineProps<{
  name: string
  /** User sudah bukan member project. */
  inactive?: boolean
}>()
</script>

<template>
  <span
    :class="MENTION_CHIP_CLASS"
    :data-inactive="inactive ? '' : undefined"
    :title="inactive ? `${name} (bukan member project lagi)` : undefined"
  >@{{ name }}</span>
</template>
