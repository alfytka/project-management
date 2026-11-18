<script setup lang="ts">
import { computed } from 'vue'
import { parseDescription, type MentionTarget } from '../lib/description'
import MentionChip from './MentionChip.vue'

/**
 * Render deskripsi read-only: `@email` yang ada di `targets` jadi chip `@Nama`,
 * email lain tetap teks biasa. Baris baru dipertahankan.
 */
const props = defineProps<{
  text: string
  targets: MentionTarget[]
}>()

const segments = computed(() => parseDescription(props.text, props.targets))
</script>

<template>
  <div class="break-words whitespace-pre-wrap">
    <template v-for="(segment, index) in segments" :key="index">
      <MentionChip v-if="segment.type === 'mention'" :name="segment.target.name" :inactive="segment.target.inactive" />
      <template v-else>{{ segment.text }}</template>
    </template>
  </div>
</template>
