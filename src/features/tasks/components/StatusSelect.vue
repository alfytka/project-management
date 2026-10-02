<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import AppSelectContent from '@/components/AppSelectContent.vue'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StatusColor } from '@/features/statuses/lib/color'
import type { Status } from '@/features/statuses/types'

defineOptions({ inheritAttrs: false })

defineProps<{
  statuses: Status[]
  colorOf: (statusId: string) => StatusColor
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const model = defineModel<string>()
</script>

<template>
  <Select v-model="model" :disabled="disabled">
    <SelectTrigger v-bind="$attrs" :class="['w-full', $props.class]">
      <SelectValue placeholder="Pilih status" />
    </SelectTrigger>
    <AppSelectContent>
      <SelectItem v-for="status in statuses" :key="status.id" :value="status.id">
        <span :class="[colorOf(status.id).dot, 'size-2 rounded-full']" />
        {{ status.name }}
      </SelectItem>
    </AppSelectContent>
  </Select>
</template>
