<script setup lang="ts">
import { Bell } from '@lucide/vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useMe } from '@/features/auth/composables/useMe'

useMe()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 lg:px-6">
        <SidebarTrigger class="-ml-1 text-muted-foreground" />
        <Separator orientation="vertical" class="data-[orientation=vertical]:h-4" />
        <AppBreadcrumb class="min-w-0 flex-1" />
        <!-- TODO: badge jumlah notifikasi belum dirender karena backend belum punya endpoint-nya -->
        <Button variant="outline" size="icon" class="rounded-lg" aria-label="Notifikasi" as-child>
          <RouterLink :to="{ name: 'notifications' }"><Bell /></RouterLink>
        </Button>
      </header>
      <main class="flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
