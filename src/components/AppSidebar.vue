<script setup lang="ts">
import { FolderKanban, LayoutDashboard, ListTodo, Search, Settings } from '@lucide/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import UserMenu from '@/components/UserMenu.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const route = useRoute()

const navItems = [
  { name: 'dashboard', label: 'Dashboard', to: '/', icon: LayoutDashboard, accent: 'from-sky-400 to-blue-600' },
  { name: 'projects', label: 'Projects', to: '/projects', icon: FolderKanban, accent: 'from-emerald-400 to-teal-600' },
  { name: 'tasks', label: 'Tasks', to: '/tasks', icon: ListTodo, accent: 'from-amber-400 to-orange-600' },
  { name: 'settings', label: 'Settings', to: '/settings', icon: Settings, accent: 'from-slate-400 to-slate-600' },
]

const search = ref('')
const filteredNavItems = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query)
    return navItems
  return navItems.filter(item => item.label.toLowerCase().includes(query))
})

function isActive(name: string) {
  return route.name === name || (name === 'projects' && route.name === 'project-detail')
}
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="gap-3 pb-1">
      <div class="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
        <div class="flex size-6 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.35)]">
          PM
        </div>
        <span class="truncate text-xs font-bold tracking-tight text-muted-foreground group-data-[collapsible=icon]:hidden">
          Project Management
        </span>
      </div>

      <UserMenu />

      <div class="relative px-0.5 group-data-[collapsible=icon]:hidden">
        <Search class="pointer-events-none absolute left-4 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <SidebarInput
          v-model="search"
          placeholder="Cari menu"
          class="h-[2.275rem] rounded-full bg-white pl-9 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-200 ease-out focus-visible:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
        />
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu class="gap-1">
            <SidebarMenuItem v-for="item in filteredNavItems" :key="item.name">
              <SidebarMenuButton
                as-child
                :is-active="isActive(item.name)"
                :tooltip="item.label"
                class="group/nav h-10 gap-2.5 rounded-xl px-2 font-medium transition-[width,height,padding,background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.98] data-[active=true]:bg-blue-500/12 data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:shadow-[0_1px_3px_rgba(37,99,235,0.12)] data-[active=true]:ring-1 data-[active=true]:ring-blue-500/10 dark:data-[active=true]:bg-blue-400/20 group-data-[collapsible=icon]:justify-center"
              >
                <RouterLink :to="item.to">
                  <span :class="[item.accent, 'flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-linear-to-br text-white shadow-[0_1px_2px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform duration-200 ease-out group-hover/nav:scale-110']">
                    <component :is="item.icon" class="size-4" />
                  </span>
                  <span class="truncate group-data-[collapsible=icon]:hidden">{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
