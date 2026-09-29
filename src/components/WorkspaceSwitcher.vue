<script setup lang="ts">
import { Check, ChevronsUpDown, Plus } from '@lucide/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

// Placeholder: backend belum punya konsep workspace, jadi hanya ada satu workspace statis.
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">
              PM
            </span>
            <div class="grid flex-1 text-left leading-tight">
              <span class="truncate text-sm font-semibold">Project Management</span>
              <span class="truncate text-xs text-muted-foreground">Workspace tim</span>
            </div>
            <ChevronsUpDown class="ml-auto text-muted-foreground" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-(--reka-dropdown-menu-trigger-width) min-w-56" align="start">
          <DropdownMenuLabel class="text-xs text-muted-foreground">Workspace</DropdownMenuLabel>
          <DropdownMenuItem>
            <span class="flex size-6 items-center justify-center rounded-md bg-violet-600 text-[0.625rem] font-bold text-white">
              PM
            </span>
            Project Management
            <Check class="ml-auto size-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <Plus class="size-4" />
            Tambah workspace
            <span class="ml-auto text-xs text-muted-foreground">Segera</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
