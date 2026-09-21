<script setup lang="ts">
import { Trash2, UserPlus } from '@lucide/vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { extractErrorMessage, isNetworkError } from '@/lib/api-errors'
import { useUpdateMemberRole } from '../composables/useUpdateMemberRole'
import type { MemberRole, ProjectDetail, ProjectMember } from '../types'
import AddMemberDialog from './AddMemberDialog.vue'
import RemoveMemberDialog from './RemoveMemberDialog.vue'

const props = defineProps<{
  project: ProjectDetail
  canManage: boolean
}>()

const addOpen = ref(false)
const removeOpen = ref(false)
const removing = ref<ProjectMember | null>(null)

// <select> menyimpan nilainya sendiri; bump key untuk mengembalikannya ke data server saat gagal.
const resetKey = ref(0)

const { mutate: updateRole, isPending: isUpdating } = useUpdateMemberRole(props.project.id)

// Pembuat project dikunci di UI; aturan lain (mis. admin terakhir) diserahkan ke backend.
const isLocked = (member: ProjectMember) => member.user_id === props.project.created_by

function onRoleChange(member: ProjectMember, role: MemberRole) {
  if (role === member.role) return
  updateRole(
    { userId: member.user_id, role },
    {
      onError: (error) => {
        resetKey.value++
        toast.error(
          isNetworkError(error)
            ? 'Tidak dapat terhubung ke server'
            : extractErrorMessage(error, 'Gagal mengubah role, coba lagi'),
        )
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
  <Card>
    <CardHeader class="flex flex-row items-center justify-between gap-4">
      <CardTitle>Member ({{ project.members.length }})</CardTitle>
      <Button v-if="canManage" size="sm" @click="addOpen = true"><UserPlus /> Tambah Member</Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead v-if="canManage" class="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="member in project.members" :key="member.user_id">
            <TableCell class="font-medium">{{ member.name }}</TableCell>
            <TableCell>{{ member.email }}</TableCell>
            <TableCell>
              <NativeSelect
                v-if="canManage && !isLocked(member)"
                :key="`${member.user_id}-${resetKey}`"
                :model-value="member.role"
                :disabled="isUpdating"
                :aria-label="`Role ${member.name}`"
                @update:model-value="onRoleChange(member, $event as MemberRole)"
              >
                <NativeSelectOption value="member">Member</NativeSelectOption>
                <NativeSelectOption value="admin">Admin</NativeSelectOption>
              </NativeSelect>
              <span v-else class="capitalize">{{ member.role }}</span>
            </TableCell>
            <TableCell v-if="canManage" class="text-right">
              <Button
                v-if="!isLocked(member)"
                variant="ghost"
                size="icon"
                :aria-label="`Hapus ${member.name}`"
                @click="openRemove(member)"
              >
                <Trash2 />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  <AddMemberDialog v-model:open="addOpen" :project-id="project.id" />
  <RemoveMemberDialog v-model:open="removeOpen" :project-id="project.id" :member="removing" />
</template>
