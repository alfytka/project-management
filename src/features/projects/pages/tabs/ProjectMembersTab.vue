<script setup lang="ts">
import { Info, Search, Trash2, UserPlus } from '@lucide/vue'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import UserAvatar from '@/components/UserAvatar.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toErrorToast } from '@/lib/api-errors'
import { useIsDesktop } from '@/composables/useIsDesktop'
import { useAuthStore } from '@/stores/auth'
import AddMemberDialog from '../../components/AddMemberDialog.vue'
import RemoveMemberDialog from '../../components/RemoveMemberDialog.vue'
import RoleBadge from '../../components/RoleBadge.vue'
import { useCurrentProject } from '../../composables/useCurrentProject'
import { useUpdateMemberRole } from '../../composables/useUpdateMemberRole'
import type { MemberRole, ProjectMember } from '../../types'

const authStore = useAuthStore()
const isDesktop = useIsDesktop()
const { projectId, project, canManage } = useCurrentProject()

const search = ref('')
const members = computed(() => project.value?.members ?? [])
const filteredMembers = computed(() => {
  const query = search.value.trim().toLowerCase()
  return members.value.filter(
    (member) => !query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query),
  )
})

const adminCount = computed(() => members.value.filter((member) => member.role === 'admin').length)

const isSelf = (member: ProjectMember) => member.user_id === authStore.user?.id

/** Diri sendiri dan admin terakhir tidak bisa diubah role-nya atau dihapus dari tabel ini. */
const isLocked = (member: ProjectMember) =>
  isSelf(member) || (member.role === 'admin' && adminCount.value <= 1)

const addOpen = ref(false)
const removeOpen = ref(false)
const removing = ref<ProjectMember | null>(null)

// <select> menyimpan nilainya sendiri; bump key untuk mengembalikannya ke data server saat gagal.
const resetKey = ref(0)

const { mutate: updateRole, isPending: isUpdating } = useUpdateMemberRole(projectId)

function onRoleChange(member: ProjectMember, role: MemberRole) {
  if (role === member.role) return
  updateRole(
    { userId: member.user_id, role },
    {
      onError: (error) => {
        resetKey.value++
        toast.error(toErrorToast(error, 'Gagal mengubah role, coba lagi'))
      },
    },
  )
}

function openRemove(member: ProjectMember) {
  removing.value = member
  removeOpen.value = true
}
</script>

<template>
  <section v-if="project" class="overflow-hidden rounded-2xl border bg-card shadow-xs">
    <div class="flex flex-wrap items-center gap-4 p-4 sm:px-6">
      <div class="min-w-0 flex-1 space-y-0.5">
        <h2 class="text-lg font-semibold">Member project</h2>
        <p class="text-sm text-muted-foreground">Atur siapa yang bisa mengakses project ini dan perannya.</p>
      </div>
      <div class="relative w-full sm:w-64">
        <Search class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="member-search"
          v-model="search"
          name="member-search"
          type="search"
          autocomplete="off"
          placeholder="Cari member..."
          aria-label="Cari member"
          class="h-10 pl-9"
        />
      </div>
      <Button v-if="canManage" size="lg" class="w-full sm:w-auto" @click="addOpen = true">
        <UserPlus /> Tambah Member
      </Button>
    </div>

    <!-- Mobile: kartu per member, role & aksi di baris kedua. -->
    <ul v-if="!isDesktop" class="divide-y border-t">
      <li v-for="member in filteredMembers" :key="member.user_id" class="space-y-3 px-4 py-3">
        <div class="flex items-center gap-3">
          <UserAvatar :id="member.user_id" :name="member.name" class="size-10 text-xs" />
          <div class="min-w-0 flex-1">
            <p class="flex items-center gap-2 font-medium">
              <span class="truncate">{{ member.name }}</span>
              <span v-if="isSelf(member)" class="rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
                Anda
              </span>
            </p>
            <p class="truncate text-sm text-muted-foreground">{{ member.email }}</p>
          </div>
          <RoleBadge v-if="!canManage || isLocked(member)" :role="member.role" />
        </div>
        <div v-if="canManage && !isLocked(member)" class="flex items-center gap-2 pl-13">
          <NativeSelect
            :key="`${member.user_id}-${resetKey}`"
            :name="`role-${member.user_id}`"
            class="w-40"
            :model-value="member.role"
            :disabled="isUpdating"
            :aria-label="`Role ${member.name}`"
            @update:model-value="onRoleChange(member, $event as MemberRole)"
          >
            <NativeSelectOption value="member">Member</NativeSelectOption>
            <NativeSelectOption value="admin">Admin</NativeSelectOption>
          </NativeSelect>
          <Button
            variant="ghost"
            size="icon"
            class="ml-auto text-muted-foreground hover:text-destructive"
            :aria-label="`Hapus ${member.name}`"
            @click="openRemove(member)"
          >
            <Trash2 />
          </Button>
        </div>
      </li>
      <li v-if="!filteredMembers.length" class="py-10 text-center text-sm text-muted-foreground">
        Tidak ada member yang cocok dengan pencarian.
      </li>
    </ul>

    <Table v-else>
      <TableHeader class="bg-muted/50">
        <TableRow>
          <TableHead class="h-11 pl-6">Member</TableHead>
          <TableHead class="h-11 w-48">Role</TableHead>
          <TableHead v-if="canManage" class="h-11 w-16 pr-6"><span class="sr-only">Aksi</span></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="member in filteredMembers" :key="member.user_id">
          <TableCell class="py-3 pl-6">
            <div class="flex items-center gap-3">
              <UserAvatar :id="member.user_id" :name="member.name" class="size-10 text-xs" />
              <div class="min-w-0">
                <p class="flex items-center gap-2 font-medium">
                  <span class="truncate">{{ member.name }}</span>
                  <span v-if="isSelf(member)" class="rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
                    Anda
                  </span>
                </p>
                <p class="truncate text-sm text-muted-foreground">{{ member.email }}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <NativeSelect
              v-if="canManage && !isLocked(member)"
              :key="`${member.user_id}-${resetKey}`"
              :name="`role-${member.user_id}`"
              class="w-40"
              :model-value="member.role"
              :disabled="isUpdating"
              :aria-label="`Role ${member.name}`"
              @update:model-value="onRoleChange(member, $event as MemberRole)"
            >
              <NativeSelectOption value="member">Member</NativeSelectOption>
              <NativeSelectOption value="admin">Admin</NativeSelectOption>
            </NativeSelect>
            <RoleBadge v-else :role="member.role" />
          </TableCell>
          <TableCell v-if="canManage" class="pr-6 text-right">
            <Button
              v-if="!isLocked(member)"
              variant="ghost"
              size="icon"
              class="text-muted-foreground hover:text-destructive"
              :aria-label="`Hapus ${member.name}`"
              @click="openRemove(member)"
            >
              <Trash2 />
            </Button>
          </TableCell>
        </TableRow>
        <TableRow v-if="!filteredMembers.length" class="hover:bg-transparent">
          <TableCell :colspan="canManage ? 3 : 2" class="h-24 text-center text-muted-foreground">
            Tidak ada member yang cocok dengan pencarian.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </section>

  <div
    class="flex gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
  >
    <Info class="mt-0.5 size-4 shrink-0" />
    <p>
      Hanya admin yang dapat menambah, menghapus, atau mengubah role member. Project harus selalu
      punya minimal 1 admin — admin terakhir tidak bisa dihapus atau diturunkan.
    </p>
  </div>

  <AddMemberDialog v-model:open="addOpen" :project-id="projectId" />
  <RemoveMemberDialog v-model:open="removeOpen" :project-id="projectId" :member="removing" />
</template>
