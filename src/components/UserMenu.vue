<script setup lang="ts">
import { ChevronRight, LogOut, UserCog } from '@lucide/vue'
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
        class="group/profile h-auto gap-2.5 rounded-xl px-2 py-1.5 transition-[width,height,padding,background-color,box-shadow,transform] duration-200 ease-out hover:bg-sidebar-accent active:scale-[0.99] data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:justify-center"
      >
        <Avatar class="size-9 shrink-0 rounded-full ring-1 ring-black/5 transition-transform duration-200 ease-out group-hover/profile:scale-105 group-data-[collapsible=icon]:size-7">
          <AvatarFallback class="rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.35)] group-data-[collapsible=icon]:text-[10px]">
            {{ initials }}
          </AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
          <span class="truncate text-sm font-semibold">{{ displayName }}</span>
          <span class="truncate text-xs text-muted-foreground">Akun &amp; Pengaturan</span>
        </div>
        <ChevronRight class="size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200 ease-out group-hover/profile:translate-x-0.5 group-data-[collapsible=icon]:hidden" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="start">
      <DropdownMenuLabel class="font-normal">
        <div class="grid text-left text-sm leading-tight">
          <span class="truncate font-medium">{{ displayName }}</span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="router.push({ name: 'settings' })">
        <UserCog class="mr-2 size-4" />
        Pengaturan akun
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleLogout">
        <LogOut class="mr-2 size-4" />
        Keluar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
