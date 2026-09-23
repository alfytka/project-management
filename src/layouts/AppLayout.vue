<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const route = useRoute()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage class="font-medium">{{ String(route.meta.title ?? route.name ?? '') }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main class="flex flex-1 flex-col gap-4 p-4">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
