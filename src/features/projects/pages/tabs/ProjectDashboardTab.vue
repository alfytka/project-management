<script setup lang="ts">
import { ListChecks } from '@lucide/vue'
import { computed, ref } from 'vue'
import AppSelectContent from '@/components/AppSelectContent.vue'
import { Button } from '@/components/ui/button'
import { Select, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjectStatuses } from '@/features/statuses/composables/useProjectStatuses'
import DashboardStatCards from '../../components/dashboard/DashboardStatCards.vue'
import EpicProgressCard from '../../components/dashboard/EpicProgressCard.vue'
import PriorityBreakdownCard from '../../components/dashboard/PriorityBreakdownCard.vue'
import StatusBreakdownCard from '../../components/dashboard/StatusBreakdownCard.vue'
import { useCurrentProject } from '../../composables/useCurrentProject'
import { useProjectDashboard } from '../../composables/useProjectDashboard'

const DUE_WITHIN_OPTIONS = [3, 7, 14, 30]

const { projectId } = useCurrentProject()
const dueWithin = ref(3)
// Select Reka bekerja dengan string; param API tetap number.
const dueWithinModel = computed({
  get: () => String(dueWithin.value),
  set: (value) => (dueWithin.value = Number(value)),
})

const { data, isPending, isError, isPlaceholderData, refetch } = useProjectDashboard(
  projectId,
  dueWithin,
)
const { statuses, byId, colorOf, isPending: statusesPending } = useProjectStatuses(projectId)

// Urutan status mengikuti pengaturan project; status tak dikenal (mis. baru dihapus) di paling akhir.
const byStatus = computed(() => {
  const order = (id: string) => byId.value.get(id)?.order ?? Number.MAX_SAFE_INTEGER
  return [...(data.value?.by_status ?? [])].sort((a, b) => order(a.status_id) - order(b.status_id))
})

const isEmpty = computed(() => data.value?.total_tasks === 0)
</script>

<template>
  <div v-if="isPending" class="space-y-4">
    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <Skeleton v-for="n in 4" :key="n" class="h-36 rounded-xl" />
    </div>
    <div
      class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]"
    >
      <Skeleton class="h-96 rounded-2xl" />
      <div class="space-y-4">
        <Skeleton class="h-72 rounded-2xl" />
        <Skeleton class="h-56 rounded-2xl" />
      </div>
    </div>
  </div>

  <div
    v-else-if="isError || !data"
    class="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
  >
    <div class="space-y-1">
      <p class="font-medium">Gagal memuat dashboard</p>
      <p class="text-sm text-muted-foreground">
        Terjadi kesalahan saat mengambil ringkasan project.
      </p>
    </div>
    <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
  </div>

  <div
    v-else-if="isEmpty"
    class="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
  >
    <span
      class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"
    >
      <ListChecks class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">Belum ada task</p>
      <p class="text-sm text-muted-foreground">
        {{
          data.epics.length
            ? 'Buat task pertama, lalu ringkasan project akan muncul di sini.'
            : 'Mulai dengan membuat module, lalu tambahkan task ke dalamnya.'
        }}
      </p>
    </div>
    <Button size="sm" as-child>
      <RouterLink
        :to="{
          name: data.epics.length ? 'project-tasks' : 'project-epics',
          params: { id: projectId },
        }"
      >
        {{ data.epics.length ? 'Buat task' : 'Buat module' }}
      </RouterLink>
    </Button>
  </div>

  <div v-else class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Ringkasan project</h2>
        <p class="text-sm text-muted-foreground">Pantau progres dan task yang perlu perhatian.</p>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span id="due-within-label">Jatuh tempo dalam</span>
        <Select v-model="dueWithinModel">
          <SelectTrigger class="w-32" aria-labelledby="due-within-label">
            <SelectValue />
          </SelectTrigger>
          <AppSelectContent>
            <SelectItem v-for="days in DUE_WITHIN_OPTIONS" :key="days" :value="String(days)"
              >{{ days }} hari</SelectItem
            >
          </AppSelectContent>
        </Select>
      </div>
    </div>

    <!-- Saat rentang hari diganti, angka lama tetap tampil (pudar) sampai response baru tiba. -->
    <p v-if="isPlaceholderData" role="status" class="text-sm text-muted-foreground">
      Memperbarui ringkasan…
    </p>
    <div
      :aria-busy="isPlaceholderData"
      :class="[isPlaceholderData ? 'opacity-60' : '', 'space-y-4 transition-opacity']"
    >
      <DashboardStatCards :dashboard="data" :due-within="dueWithin" :updating="isPlaceholderData" />

      <div
        class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <EpicProgressCard :project-id="projectId" :epics="data.epics" />

        <div class="space-y-4">
          <Skeleton v-if="statusesPending && !statuses.length" class="h-72 rounded-2xl" />
          <StatusBreakdownCard
            v-else
            :items="byStatus"
            :total="data.total_tasks"
            :color-of="colorOf"
          />
          <PriorityBreakdownCard :items="data.by_priority" :total="data.total_tasks" />
        </div>
      </div>
    </div>
  </div>
</template>
