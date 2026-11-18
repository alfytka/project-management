<script setup lang="ts">
// LayoutDashboard, ListChecks & Settings dipakai lagi saat menu Dashboard / Tugas Saya / Pengaturan diaktifkan kembali.
import { AtSign, FolderKanban, Plus, Search } from '@lucide/vue'
import { onKeyStroke } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppBrand from '@/components/AppBrand.vue'
import UserMenu from '@/components/UserMenu.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/ui/sidebar'
import ProjectFormDialog from '@/features/projects/components/ProjectFormDialog.vue'
import { useProjects } from '@/features/projects/composables/useProjects'
import { useUnreadMentionCount } from '@/features/mentions/composables/useUnreadMentionCount'
import { formatBadgeCount } from '@/features/mentions/lib/badge'
import { getProjectAccent } from '@/features/projects/lib/accent'

const route = useRoute()
const { setOpen, isMobile, setOpenMobile } = useSidebar()

// Sementara hanya menu yang sudah berfungsi penuh. Dashboard & Tugas Saya disembunyikan dulu
// (route-nya tetap ada); aktifkan lagi beserta import ikonnya bila halamannya sudah siap.
// TODO: badge jumlah Tugas Saya ditambahkan begitu endpoint-nya tersedia.
const navItems = [
  // { name: 'dashboard', label: 'Dashboard', to: '/', icon: LayoutDashboard },
  // { name: 'tasks', label: 'Tugas Saya', to: '/tasks', icon: ListChecks },
  { name: 'projects', label: 'Projects', to: '/projects', icon: FolderKanban },
  { name: 'mentions', label: 'Mentions', to: '/mentions', icon: AtSign },
]

const { data: projects, isPending: projectsPending } = useProjects()
const { data: unreadMentions } = useUnreadMentionCount()

function badgeOf(name: string) {
  return name === 'mentions' ? formatBadgeCount(unreadMentions.value) : undefined
}

const search = ref('')
const query = computed(() => search.value.trim().toLowerCase())
const filteredNavItems = computed(() =>
  navItems.filter((item) => item.label.toLowerCase().includes(query.value)),
)
const filteredProjects = computed(() =>
  (projects.value ?? []).filter((project) => project.name.toLowerCase().includes(query.value)),
)

const activeProjectId = computed(() =>
  route.path.startsWith('/projects/') ? String(route.params.id ?? '') : '',
)

function isActive(name: string) {
  if (name === 'projects') return route.name === 'projects' || !!activeProjectId.value
  return route.name === name
}

// Di mobile sidebar berupa sheet di atas konten; tutup setelah pindah halaman.
watch(
  () => route.fullPath,
  () => {
    if (isMobile.value) setOpenMobile(false)
  },
)

const searchWrapper = useTemplateRef<HTMLElement>('searchWrapper')

onKeyStroke('k', async (event) => {
  if (!(event.metaKey || event.ctrlKey)) return
  event.preventDefault()
  if (isMobile.value) setOpenMobile(true)
  else setOpen(true)
  await nextTick()
  searchWrapper.value?.querySelector('input')?.focus()
})

const createOpen = ref(false)

function openCreate() {
  // Di mobile tutup sheet sidebar dulu supaya bottom sheet form tidak menumpuk di atasnya.
  if (isMobile.value) setOpenMobile(false)
  createOpen.value = true
}

const itemClass =
  'h-9 gap-2.5 rounded-lg px-2.5 text-[0.875rem] text-sidebar-foreground/80 data-[active=true]:bg-background data-[active=true]:font-semibold data-[active=true]:text-foreground data-[active=true]:shadow-xs data-[active=true]:ring-1 data-[active=true]:ring-sidebar-border'
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader class="gap-3">
      <AppBrand />

      <div ref="searchWrapper" class="relative group-data-[collapsible=icon]:hidden">
        <Search class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <SidebarInput
          id="sidebar-search"
          v-model="search"
          name="sidebar-search"
          type="search"
          autocomplete="off"
          placeholder="Cari..."
          aria-label="Cari menu dan project"
          class="h-9 rounded-lg pr-12 pl-8"
        />
        <kbd class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border bg-muted px-1.5 font-sans text-[0.6875rem] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-if="filteredNavItems.length">
        <SidebarGroupLabel class="tracking-wider uppercase">Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu class="gap-0.5">
            <SidebarMenuItem v-for="item in filteredNavItems" :key="item.name">
              <SidebarMenuButton as-child :is-active="isActive(item.name)" :tooltip="item.label" :class="itemClass">
                <RouterLink :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
              <SidebarMenuBadge
                v-if="badgeOf(item.name)"
                class="rounded-full bg-primary text-primary-foreground peer-hover/menu-button:text-primary-foreground peer-data-[active=true]/menu-button:text-primary-foreground"
                :aria-label="`${unreadMentions} mention belum dibaca`"
              >
                {{ badgeOf(item.name) }}
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup class="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel class="tracking-wider uppercase">Project Saya</SidebarGroupLabel>
        <SidebarGroupAction title="Buat project" @click="openCreate">
          <Plus />
          <span class="sr-only">Buat project</span>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu class="gap-0.5">
            <template v-if="projectsPending">
              <SidebarMenuItem v-for="n in 3" :key="n">
                <SidebarMenuSkeleton />
              </SidebarMenuItem>
            </template>
            <SidebarMenuItem v-for="project in filteredProjects" :key="project.id">
              <SidebarMenuButton as-child :is-active="activeProjectId === project.id" :class="itemClass">
                <RouterLink :to="{ name: 'project-dashboard', params: { id: project.id } }">
                  <span :class="[getProjectAccent(project.id).dot, 'mx-1 size-2.5 shrink-0 rounded-[3px]']" />
                  <span>{{ project.name }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <p
              v-if="!projectsPending && !filteredProjects.length"
              class="px-2.5 py-1.5 text-xs text-muted-foreground"
            >
              {{ query ? 'Tidak ada project yang cocok.' : 'Belum ada project.' }}
            </p>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="gap-2">
      <!-- Disembunyikan sementara: halaman Pengaturan belum diimplementasikan (route tetap ada).
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton as-child :is-active="isActive('settings')" tooltip="Pengaturan" :class="itemClass">
            <RouterLink :to="{ name: 'settings' }">
              <Settings />
              <span>Pengaturan</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      -->
      <UserMenu />
    </SidebarFooter>
  </Sidebar>

  <ProjectFormDialog v-model:open="createOpen" />
</template>
