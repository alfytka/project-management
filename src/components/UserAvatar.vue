<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getAvatarColor, getInitials } from '@/lib/avatar'
import { cn } from '@/lib/utils'

const props = defineProps<{
  id: string
  name: string
  class?: HTMLAttributes['class']
}>()

const initials = computed(() => getInitials(props.name))
const color = computed(() => getAvatarColor(props.id))
</script>

<template>
  <Avatar :class="cn('size-8', props.class)" :title="name">
    <AvatarFallback :class="[color, 'text-[0.625rem] font-semibold tracking-tight text-white']">
      {{ initials }}
    </AvatarFallback>
  </Avatar>
</template>
