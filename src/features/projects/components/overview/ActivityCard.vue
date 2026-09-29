<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelative } from '@/lib/date'
import type { ProjectActivity } from '../../types'

defineProps<{
  activities: ProjectActivity[] | undefined
  loading: boolean
}>()
</script>

<template>
  <section class="rounded-2xl border bg-card p-6 shadow-xs">
    <h2 class="text-lg font-semibold">Aktivitas</h2>

    <div v-if="loading" class="mt-4 space-y-4">
      <div v-for="n in 3" :key="n" class="space-y-1.5">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-3 w-20" />
      </div>
    </div>

    <p v-else-if="!activities?.length" class="mt-4 text-sm text-muted-foreground">Belum ada aktivitas.</p>

    <ul v-else class="mt-4 space-y-4">
      <li v-for="activity in activities" :key="activity.id">
        <p class="text-[0.9375rem] leading-snug">{{ activity.message }}</p>
        <p class="mt-0.5 text-sm text-muted-foreground">{{ formatRelative(activity.created_at) }}</p>
      </li>
    </ul>
  </section>
</template>
