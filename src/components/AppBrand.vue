<script setup lang="ts">
import BrandMark from '@/components/BrandMark.vue'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" as-child class="hover:bg-transparent active:bg-transparent">
        <RouterLink :to="{ name: 'projects' }" aria-label="Project Management">
          <BrandMark />
          <!-- Dua baris supaya nama tidak terpotong di lebar sidebar. -->
          <span class="grid min-w-0 leading-tight">
            <span class="truncate text-sm font-semibold tracking-tight">Project</span>
            <span class="truncate text-xs font-medium text-muted-foreground">Management</span>
          </span>
        </RouterLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
