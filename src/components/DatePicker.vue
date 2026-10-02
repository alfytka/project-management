<script setup lang="ts">
import { CalendarDays, X } from '@lucide/vue'
import { parseDate, type DateValue } from '@internationalized/date'
import { computed, ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDateOnly } from '@/lib/date'
import { cn } from '@/lib/utils'

/** Date picker shadcn (Popover + Calendar). Nilai `YYYY-MM-DD`, sama dengan format payload API. */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    placeholder?: string
    /** Tanggal minimum `YYYY-MM-DD`. */
    min?: string
    clearable?: boolean
    disabled?: boolean
  }>(),
  { placeholder: 'Pilih tanggal', min: undefined },
)

const model = defineModel<string | undefined>()

const open = ref(false)

const calendarValue = computed(() => (model.value ? parseDate(model.value) : undefined))
const minValue = computed(() => (props.min ? parseDate(props.min) : undefined))

function onSelect(value: DateValue | undefined) {
  if (!value) return
  model.value = value.toString()
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <div class="relative">
      <PopoverTrigger as-child>
        <button
          type="button"
          v-bind="$attrs"
          :disabled="disabled"
          :class="
            cn(
              'flex h-9 w-full min-w-0 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30',
              'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
              'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
              clearable && model && 'pr-9',
            )
          "
        >
          <CalendarDays class="size-4 shrink-0 text-muted-foreground" />
          <span :class="['truncate', !model && 'text-muted-foreground']">
            {{ model ? formatDateOnly(model) : placeholder }}
          </span>
        </button>
      </PopoverTrigger>
      <button
        v-if="clearable && model && !disabled"
        type="button"
        aria-label="Hapus tanggal"
        class="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        @click="model = undefined"
      >
        <X class="size-3.5" />
      </button>
    </div>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        :model-value="calendarValue"
        :default-placeholder="calendarValue ?? minValue"
        :min-value="minValue"
        locale="id-ID"
        layout="month-and-year"
        initial-focus
        @update:model-value="onSelect"
      />
    </PopoverContent>
  </Popover>
</template>
