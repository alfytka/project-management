<script setup lang="ts">
import { computed } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import type { ProjectDetail } from '../../types'
import RoleBadge from '../RoleBadge.vue'

const props = defineProps<{ project: ProjectDetail }>()

const MAX_VISIBLE = 5

const visible = computed(() => props.project.members.slice(0, MAX_VISIBLE))
const rest = computed(() => props.project.members.length - visible.value.length)
</script>

<template>
  <section class="rounded-2xl border bg-card p-6 shadow-xs">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Member</h2>
      <RouterLink
        :to="{ name: 'project-members', params: { id: project.id } }"
        class="text-sm text-muted-foreground hover:text-foreground"
      >
        Kelola
      </RouterLink>
    </div>

    <ul class="mt-4 space-y-3">
      <li v-for="member in visible" :key="member.user_id" class="flex items-center gap-3">
        <UserAvatar :id="member.user_id" :name="member.name" />
        <span class="min-w-0 flex-1 truncate font-medium">{{ member.name }}</span>
        <RoleBadge :role="member.role" />
      </li>
    </ul>

    <RouterLink
      v-if="rest > 0"
      :to="{ name: 'project-members', params: { id: project.id } }"
      class="mt-3 block text-sm text-muted-foreground hover:text-foreground"
    >
      +{{ rest }} member lainnya
    </RouterLink>
  </section>
</template>
