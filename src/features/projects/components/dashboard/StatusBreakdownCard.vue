<script setup lang="ts">
import { computed } from 'vue'
import type { StatusColor } from '@/features/statuses/lib/color'

const props = defineProps<{
  items: { status_id: string; status_name: string; count: number }[]
  total: number
  colorOf: (statusId: string) => StatusColor
}>()

const percentOf = (count: number) => (props.total ? Math.round((count / props.total) * 100) : 0)

// Status tanpa task tidak digambar di bar (lebar 0), tetapi tetap tampil di legend.
const segments = computed(() => props.items.filter((item) => item.count > 0))
</script>

<template>
  <section class="rounded-2xl border bg-card p-6 shadow-xs">
    <h2 class="text-lg font-semibold">Task per status</h2>
    <p class="text-sm text-muted-foreground">{{ total }} task di seluruh module</p>

    <!-- Satu bar bertumpuk: jeda 2px antarsegmen, bukan garis tepi. -->
    <div class="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full" role="img" :aria-label="`Sebaran ${total} task per status`">
      <span
        v-for="item in segments"
        :key="item.status_id"
        :class="[colorOf(item.status_id).dot, 'h-full min-w-1.5']"
        :style="{ flexGrow: item.count, flexBasis: 0 }"
        :title="`${item.status_name}: ${item.count} task (${percentOf(item.count)}%)`"
      />
    </div>

    <ul class="mt-5 space-y-2.5">
      <li v-for="item in items" :key="item.status_id" class="flex items-center gap-3 text-sm">
        <span :class="[colorOf(item.status_id).dot, 'size-2.5 shrink-0 rounded-full']" aria-hidden="true" />
        <span class="min-w-0 flex-1 truncate">{{ item.status_name }}</span>
        <span class="font-medium tabular-nums">{{ item.count }}</span>
        <span class="w-10 text-right text-muted-foreground tabular-nums">{{ percentOf(item.count) }}%</span>
      </li>
    </ul>
  </section>
</template>
