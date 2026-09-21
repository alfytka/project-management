<script setup lang="ts">
import { FolderKanban, LayoutDashboard, ListTodo, Settings } from '@lucide/vue'
import { useRoute } from 'vue-router'
import UserMenu from '@/components/UserMenu.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const route = useRoute()

const navItems = [
  { name: 'dashboard', label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'projects', label: 'Projects', to: '/projects', icon: FolderKanban },
  { name: 'tasks', label: 'Tasks', to: '/tasks', icon: ListTodo },
  { name: 'settings', label: 'Settings', to: '/settings', icon: Settings },
]

function isActive(name: string) {
  return route.name === name || (name === 'projects' && route.name === 'project-detail')
}
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <div class="flex items-center gap-2 px-2 py-1.5">
        <LayoutDashboard class="size-5 shrink-0" />
        <span class="truncate font-semibold group-data-[collapsible=icon]:hidden">
          Project Management
        </span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.name">
              <SidebarMenuButton as-child :is-active="isActive(item.name)" :tooltip="item.label">
                <RouterLink :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <UserMenu />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
