<script setup lang="ts">
import { computed, ref } from 'vue'
import { EPIC_STATUS_META, getEpicProgress, getEpicStatus } from '../../lib/epic'
import type { Epic } from '../../types'

const props = defineProps<{ epics: Epic[] }>()

type Scale = 'month' | 'quarter'

const scale = ref<Scale>('month')
const today = new Date()

const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' })
const todayFormatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })

/** Kolom waktu (bulan/kuartal) yang mencakup seluruh epic dan hari ini, minimal 4 kolom. */
const columns = computed(() => {
  const times = props.epics.flatMap((e) => [new Date(e.start_date).getTime(), new Date(e.end_date).getTime()])
  const min = new Date(Math.min(today.getTime(), ...times))
  const max = new Date(Math.max(today.getTime(), ...times))
  const step = scale.value === 'month' ? 1 : 3

  const cursor = new Date(min.getFullYear(), min.getMonth() - (min.getMonth() % step), 1)
  const result: { start: Date; end: Date; label: string }[] = []
  while (cursor <= max || result.length < 4) {
    const start = new Date(cursor)
    cursor.setMonth(cursor.getMonth() + step)
    const label =
      scale.value === 'month'
        ? monthFormatter.format(start).replace('.', '')
        : `Q${Math.floor(start.getMonth() / 3) + 1} ${start.getFullYear()}`
    result.push({ start, end: new Date(cursor), label })
  }
  return result
})

const range = computed(() => ({
  start: columns.value[0]!.start.getTime(),
  end: columns.value.at(-1)!.end.getTime(),
}))

function toPercent(date: Date | string) {
  const { start, end } = range.value
  const value = ((new Date(date).getTime() - start) / (end - start)) * 100
  return Math.min(100, Math.max(0, value))
}

const todayPercent = computed(() => toPercent(today))

const rows = computed(() =>
  props.epics.map((epic) => {
    const status = getEpicStatus(epic, today)
    const left = toPercent(epic.start_date)
    return {
      epic,
      status,
      meta: EPIC_STATUS_META[status],
      progress: getEpicProgress(epic),
      left,
      width: Math.max(toPercent(epic.end_date) - left, 1),
    }
  }),
)

const segmentClass =
  'inline-flex h-8 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs'
</script>

<template>
  <section class="rounded-2xl border bg-card p-6 shadow-xs">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-lg font-semibold">Timeline epic</h2>
      <div class="inline-flex items-center rounded-lg bg-muted p-1">
        <button type="button" :data-active="scale === 'month'" :class="segmentClass" @click="scale = 'month'">Bulan</button>
        <button type="button" :data-active="scale === 'quarter'" :class="segmentClass" @click="scale = 'quarter'">Kuartal</button>
      </div>
    </div>

    <p v-if="!epics.length" class="py-12 text-center text-sm text-muted-foreground">
      Belum ada epic. Buat epic untuk melihat timeline project.
    </p>

    <template v-else>
      <div class="mt-4 overflow-x-auto">
        <div class="min-w-160">
          <div class="grid grid-cols-[13rem_1fr] text-sm text-muted-foreground">
            <span />
            <div class="relative flex">
              <span v-for="column in columns" :key="column.label" class="flex-1 truncate py-2">{{ column.label }}</span>
            </div>
          </div>

          <div
            v-for="row in rows"
            :key="row.epic.id"
            class="grid grid-cols-[13rem_1fr] items-center py-2.5"
          >
            <div class="min-w-0 pr-4">
              <p class="truncate font-medium">{{ row.epic.name }}</p>
              <p :class="[row.meta.text, 'text-xs']">{{ row.meta.label }} · {{ row.progress }}%</p>
            </div>

            <div class="relative h-10">
              <!-- garis batas kolom -->
              <span
                v-for="(column, index) in columns.slice(1)"
                :key="column.label"
                class="absolute inset-y-0 w-px bg-border"
                :style="{ left: `${((index + 1) / columns.length) * 100}%` }"
              />
              <!-- bar: penuh = rentang tanggal, bagian gelap = progress -->
              <div
                :class="[row.meta.track, 'absolute top-1/2 h-6 -translate-y-1/2 overflow-hidden rounded-md']"
                :style="{ left: `${row.left}%`, width: `${row.width}%` }"
                :title="`${row.epic.name}: ${row.progress}%`"
              >
                <div :class="[row.meta.bar, 'h-full rounded-md']" :style="{ width: `${row.progress}%` }" />
              </div>
              <!-- hari ini -->
              <span class="absolute inset-y-0 w-0.5 bg-red-600" :style="{ left: `${todayPercent}%` }" />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 border-t pt-4 text-sm text-muted-foreground">
        <span class="inline-flex items-center gap-2">
          <span class="h-3.5 w-0.5 bg-red-600" /> Hari ini ({{ todayFormatter.format(today) }})
        </span>
        <span>Bar penuh = rentang tanggal, bagian gelap = progress</span>
      </div>
    </template>
  </section>
</template>
