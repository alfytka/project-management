<script setup lang="ts">
import BrandMark from '@/components/BrandMark.vue'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" as-child class="hover:bg-transparent active:bg-transparent">
        <RouterLink :to="{ name: 'dashboard' }">
          <BrandMark />
          <span class="truncate text-sm font-semibold">Project Management</span>
        </RouterLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
