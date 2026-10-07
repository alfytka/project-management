<script setup lang="ts">
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Plus, Search, Target } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import DeleteEpicDialog from '@/features/epics/components/DeleteEpicDialog.vue'
import EpicCard from '@/features/epics/components/EpicCard.vue'
import EpicFormDialog from '@/features/epics/components/EpicFormDialog.vue'
import { useProjectEpics } from '@/features/epics/composables/useProjectEpics'
import { EPIC_STATUS_META, EPIC_STATUS_ORDER, getEpicStatus } from '@/features/epics/lib/status'
import type { EpicListItem, EpicStatus } from '@/features/epics/types'
import { useProjectStatuses } from '@/features/statuses/composables/useProjectStatuses'
import { useCurrentProject } from '../../composables/useCurrentProject'

type StatusFilter = 'all' | EpicStatus

const router = useRouter()
const { projectId, canManage } = useCurrentProject()
const { data, isPending, isError, refetch } = useProjectEpics(projectId)
const { colorOf } = useProjectStatuses(projectId)

const dotOf = (statusId: string) => colorOf(statusId).dot

const search = ref('')
const statusFilter = ref<StatusFilter>('all')
const sortAsc = ref(true)

const epics = computed(() => (data.value ?? []).map((epic) => ({ epic, status: getEpicStatus(epic) })))

const filters = computed<{ value: StatusFilter; label: string; count: number }[]>(() => [
  { value: 'all', label: 'Semua', count: epics.value.length },
  ...EPIC_STATUS_ORDER.map((status) => ({
    value: status,
    label: EPIC_STATUS_META[status].label,
    count: epics.value.filter((item) => item.status === status).length,
  })),
])

const filteredEpics = computed(() => {
  const query = search.value.trim().toLowerCase()
  const direction = sortAsc.value ? 1 : -1
  return epics.value
    .filter(
      (item) =>
        (statusFilter.value === 'all' || item.status === statusFilter.value) &&
        (!query ||
          item.epic.title.toLowerCase().includes(query) ||
          item.epic.description?.toLowerCase().includes(query)),
    )
    .map((item) => item.epic)
    .sort((a, b) => a.start_date.localeCompare(b.start_date) * direction)
})

const formOpen = ref(false)
const editingId = ref<string>()
const deleteOpen = ref(false)
const deleting = ref<EpicListItem | null>(null)

function openCreate() {
  editingId.value = undefined
  formOpen.value = true
}

function openEdit(epic: EpicListItem) {
  editingId.value = epic.id
  formOpen.value = true
}

function openDelete(epic: EpicListItem) {
  deleting.value = epic
  deleteOpen.value = true
}

function openDetail(epic: EpicListItem) {
  router.push({ name: 'epic-detail', params: { id: projectId.value, epicId: epic.id } })
}

const segmentClass =
  'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-background data-[active=true]:text-foreground data-[active=true]:shadow-xs'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative w-full sm:w-72">
      <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="module-search"
        v-model="search"
        name="module-search"
        type="search"
        autocomplete="off"
        placeholder="Cari module..."
        aria-label="Cari module"
        class="h-10 pl-9"
      />
    </div>

    <div class="inline-flex max-w-full items-center overflow-x-auto rounded-lg bg-muted p-1" role="tablist" aria-label="Filter status">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        role="tab"
        :aria-selected="statusFilter === filter.value"
        :data-active="statusFilter === filter.value"
        :class="segmentClass"
        @click="statusFilter = filter.value"
      >
        {{ filter.label }}
        <span class="tabular-nums text-muted-foreground">{{ filter.count }}</span>
      </button>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <Button
        variant="outline"
        size="lg"
        :title="`Urutan saat ini: tanggal mulai ${sortAsc ? 'terlama' : 'terbaru'} dulu. Klik untuk membalik.`"
        @click="sortAsc = !sortAsc"
      >
        <component :is="sortAsc ? ArrowUpNarrowWide : ArrowDownWideNarrow" />
        Tanggal Mulai
        <span class="text-muted-foreground">{{ sortAsc ? 'Terlama' : 'Terbaru' }}</span>
      </Button>
      <Button v-if="canManage" size="lg" @click="openCreate"><Plus /> Buat Module</Button>
    </div>
  </div>

  <div v-if="isError" class="mt-2 space-y-2 text-sm text-muted-foreground">
    <p>Gagal memuat daftar module.</p>
    <Button variant="outline" size="sm" @click="refetch()">Coba lagi</Button>
  </div>

  <div v-else-if="isPending" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <Skeleton v-for="n in 2" :key="n" class="h-56 rounded-2xl" />
  </div>

  <div
    v-else-if="!epics.length"
    class="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center"
  >
    <span class="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
      <Target class="size-6" />
    </span>
    <div class="space-y-1">
      <p class="font-medium">Belum ada module</p>
      <p class="text-sm text-muted-foreground">
        {{ canManage ? 'Buat module untuk mengelompokkan task dalam satu rentang waktu.' : 'Admin project belum membuat module.' }}
      </p>
    </div>
    <Button v-if="canManage" size="sm" @click="openCreate"><Plus /> Buat Module</Button>
  </div>

  <p v-else-if="!filteredEpics.length" class="py-12 text-center text-sm text-muted-foreground">
    Tidak ada module yang cocok dengan filter.
  </p>

  <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <EpicCard
      v-for="epic in filteredEpics"
      :key="epic.id"
      :epic="epic"
      :project-id="projectId"
      :can-manage="canManage"
      :dot-of="dotOf"
      @open="openDetail"
      @edit="openEdit"
      @delete="openDelete"
    />
  </div>

  <EpicFormDialog v-model:open="formOpen" :project-id="projectId" :epic-id="editingId" />
  <DeleteEpicDialog v-model:open="deleteOpen" :epic="deleting" />
</template>
