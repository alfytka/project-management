<script setup lang="ts">
import { ChevronsUpDown, LogOut } from '@lucide/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const displayName = computed(() => authStore.user?.email ?? 'Pengguna')
const initials = computed(() => displayName.value.slice(0, 2).toUpperCase())

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar class="size-8 rounded-lg">
          <AvatarFallback class="rounded-lg">{{ initials }}</AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">{{ displayName }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" side="top" align="start">
      <DropdownMenuLabel class="font-normal">
        <div class="grid text-left text-sm leading-tight">
          <span class="truncate font-medium">{{ displayName }}</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout">
        <LogOut class="mr-2 size-4" />
        Keluar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
