<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { useEpic } from '@/features/epics/composables/useEpic'
import { useProject } from '@/features/projects/composables/useProject'

interface Crumb {
  label: string
  to?: RouteLocationRaw
}

const route = useRoute()

const projectId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const epicId = computed(() => (typeof route.params.epicId === 'string' ? route.params.epicId : ''))
const isProjectRoute = computed(() => route.path.startsWith('/projects/') && !!projectId.value)

// Berbagi cache dengan halaman detail, jadi tidak ada request tambahan.
const { data: project, isError: projectError } = useProject(projectId)
const { data: epic, isError: epicError } = useEpic(epicId)

// Label kosong = masih memuat (skeleton). Bila gagal (404/403), tampilkan teks alih-alih skeleton abadi.
const projectLabel = computed(() => project.value?.name ?? (projectError.value ? 'Tidak ditemukan' : ''))
const epicLabel = computed(() => epic.value?.title ?? (epicError.value ? 'Tidak ditemukan' : ''))

const crumbs = computed<Crumb[]>(() => {
  if (isProjectRoute.value) {
    const projectCrumbs: Crumb[] = [
      { label: 'Projects', to: { name: 'projects' } },
      { label: projectLabel.value, to: { name: 'project-overview', params: { id: projectId.value } } },
    ]
    if (epicId.value) {
      return [
        ...projectCrumbs,
        { label: 'Modules', to: { name: 'project-epics', params: { id: projectId.value } } },
        { label: epicLabel.value },
      ]
    }
    return [...projectCrumbs, { label: String(route.meta.title ?? '') }]
  }
  return [{ label: String(route.meta.title ?? route.name ?? '') }]
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList class="flex-nowrap">
      <template v-for="(crumb, index) in crumbs" :key="index">
        <!-- Di HP hanya dua crumb terakhir yang tampil supaya tidak membungkus ke dua baris. -->
        <BreadcrumbSeparator v-if="index > 0" :class="index < crumbs.length - 1 && 'max-sm:hidden'" />
        <BreadcrumbItem :class="['min-w-0', index < crumbs.length - 2 && 'max-sm:hidden']">
          <BreadcrumbPage v-if="index === crumbs.length - 1" class="truncate font-medium">
            {{ crumb.label }}
          </BreadcrumbPage>
          <Skeleton v-else-if="!crumb.label" class="h-4 w-24" />
          <BreadcrumbLink v-else as-child>
            <RouterLink :to="crumb.to!" class="max-w-32 truncate sm:max-w-48">{{ crumb.label }}</RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
