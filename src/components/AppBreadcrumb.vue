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
import { useProject } from '@/features/projects/composables/useProject'

interface Crumb {
  label: string
  to?: RouteLocationRaw
}

const route = useRoute()

const projectId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const isProjectRoute = computed(() => route.path.startsWith('/projects/') && !!projectId.value)

// Berbagi cache dengan halaman detail, jadi tidak ada request tambahan.
const { data: project } = useProject(projectId)

const crumbs = computed<Crumb[]>(() => {
  if (isProjectRoute.value) {
    return [
      { label: 'Projects', to: { name: 'projects' } },
      { label: project.value?.name ?? '', to: { name: 'project-overview', params: { id: projectId.value } } },
      { label: String(route.meta.title ?? '') },
    ]
  }
  return [{ label: String(route.meta.title ?? route.name ?? '') }]
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(crumb, index) in crumbs" :key="index">
        <BreadcrumbSeparator v-if="index > 0" />
        <BreadcrumbItem>
          <BreadcrumbPage v-if="index === crumbs.length - 1" class="font-medium">
            {{ crumb.label }}
          </BreadcrumbPage>
          <Skeleton v-else-if="!crumb.label" class="h-4 w-24" />
          <BreadcrumbLink v-else as-child>
            <RouterLink :to="crumb.to!" class="max-w-48 truncate">{{ crumb.label }}</RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
