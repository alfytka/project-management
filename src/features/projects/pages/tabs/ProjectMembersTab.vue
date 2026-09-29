<script setup lang="ts">
/**
 * TAB MEMBERS — TEMPLATE, BELUM DIDESAIN ULANG.
 *
 * Route : /projects/:id/members  (name: 'project-members')
 *
 * Sementara tab ini memakai `ProjectMembersCard` lama supaya fitur yang sudah jalan
 * (ubah role, hapus member) tetap bisa dipakai. Tombol "Undang" ada di header project.
 *
 * TODO:
 * - Desain ulang mengikuti gaya halaman baru: avatar (`UserAvatar`), `RoleBadge`,
 *   pencarian member, dan jumlah per role.
 * - Tandai user yang sedang login ("Anda") — id user ada di `useAuthStore().user`.
 *
 * Yang sudah tersedia (API sungguhan, bukan mock):
 * - `useCurrentProject()` → `project.members`, `canManage`.
 * - `useAddMember`, `useUpdateMemberRole`, `useRemoveMember` + dialog-dialognya di `components/`.
 */
import ProjectMembersCard from '../../components/ProjectMembersCard.vue'
import { useCurrentProject } from '../../composables/useCurrentProject'

const { project, canManage } = useCurrentProject()
</script>

<template>
  <ProjectMembersCard v-if="project" :project="project" :can-manage="canManage" />
</template>
