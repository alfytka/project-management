<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'

const props = withDefaults(
  defineProps<{
    users: { id: string; name: string }[]
    max?: number
    /** Total sebenarnya, bila `users` hanya sebagian (mis. dari member_count). */
    total?: number
  }>(),
  { max: 3, total: undefined },
)

const visible = computed(() => props.users.slice(0, props.max))
const rest = computed(() => (props.total ?? props.users.length) - visible.value.length)
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex -space-x-1.5">
      <UserAvatar
        v-for="user in visible"
        :id="user.id"
        :key="user.id"
        :name="user.name"
        class="size-6 ring-2 ring-background"
      />
    </div>
    <span v-if="rest > 0" class="text-xs text-muted-foreground">+{{ rest }}</span>
  </div>
</template>
