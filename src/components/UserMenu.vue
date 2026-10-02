<script setup lang="ts">
import { ChevronsUpDown, LogOut, UserCog } from '@lucide/vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/UserAvatar.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => ({
  id: authStore.user?.id ?? '',
  name: authStore.user?.name ?? 'Pengguna',
  email: authStore.user?.email ?? '',
}))

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <!-- Non-modal: klik di luar langsung mengenai elemen tujuan, bukan hanya menutup menu. -->
      <DropdownMenu :modal="false">
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="h-auto rounded-xl border bg-background py-2 shadow-xs hover:bg-background data-[state=open]:bg-background group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:shadow-none"
          >
            <UserAvatar :id="user.id" :name="user.name" class="size-9 group-data-[collapsible=icon]:size-8" />
            <div class="grid flex-1 text-left leading-tight">
              <span class="truncate text-sm font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ml-auto text-muted-foreground" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-(--reka-dropdown-menu-trigger-width) min-w-56" side="top" align="start">
          <DropdownMenuLabel class="font-normal">
            <div class="grid text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="router.push({ name: 'settings' })">
            <UserCog class="size-4" />
            Pengaturan akun
          </DropdownMenuItem>
          <DropdownMenuItem @click="handleLogout">
            <LogOut class="size-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
