<script setup lang="ts">
import { Bell } from '@lucide/vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useMe } from '@/features/auth/composables/useMe'
import { useUnreadMentionCount } from '@/features/mentions/composables/useUnreadMentionCount'
import { formatBadgeCount } from '@/features/mentions/lib/badge'

useMe()
const { data: unreadMentions } = useUnreadMentionCount()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <!-- min-w-0: tanpa ini konten lebar (tabel, board) mendorong layout keluar layar di tablet. -->
    <SidebarInset class="min-w-0">
      <header class="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 lg:px-6">
        <SidebarTrigger class="-ml-1 text-muted-foreground" />
        <Separator orientation="vertical" class="data-[orientation=vertical]:h-4" />
        <AppBreadcrumb class="min-w-0 flex-1" />
        <Button
          variant="outline"
          size="icon"
          class="relative rounded-lg"
          :aria-label="unreadMentions ? `Mentions, ${unreadMentions} belum dibaca` : 'Mentions'"
          as-child
        >
          <RouterLink :to="{ name: 'mentions' }">
            <Bell />
            <span
              v-if="unreadMentions"
              class="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[0.625rem] leading-none font-semibold text-white tabular-nums ring-2 ring-background"
              aria-hidden="true"
            >
              {{ formatBadgeCount(unreadMentions) }}
            </span>
          </RouterLink>
        </Button>
      </header>
      <main class="flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8 lg:py-8">
        <RouterView />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>
