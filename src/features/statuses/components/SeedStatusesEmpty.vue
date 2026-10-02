<script setup lang="ts">
import { Columns3, Sparkles } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { toErrorToast } from '@/lib/api-errors'
import { useSeedDefaultStatuses } from '../composables/useSeedDefaultStatuses'
import { DEFAULT_STATUSES } from '../lib/color'

const props = defineProps<{ projectId: string }>()

const { mutate, isPending } = useSeedDefaultStatuses(() => props.projectId)

function seed() {
  mutate(undefined, { onError: (error) => toast.error(toErrorToast(error, 'Gagal membuat status default')) })
}
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center">
    <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <Columns3 class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">Project belum punya status</p>
      <p class="max-w-md text-sm text-muted-foreground">
        Task membutuhkan status (kolom board). Buat status default
        {{ DEFAULT_STATUSES.map((status) => status.name).join(', ') }} lalu ubah sesuai kebutuhan tim.
      </p>
    </div>
    <Button size="sm" :disabled="isPending" @click="seed">
      <Sparkles /> {{ isPending ? 'Membuat...' : 'Buat status default' }}
    </Button>
  </div>
</template>
