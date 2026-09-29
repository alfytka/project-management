<script setup lang="ts">
/**
 * TAB PENGATURAN — TEMPLATE, BELUM DIIMPLEMENTASIKAN.
 *
 * Route : /projects/:id/settings  (name: 'project-settings')
 *
 * TODO:
 * - Form umum: nama & deskripsi project (bisa pakai ulang `components/ProjectForm.vue`).
 * - "Danger zone": hapus project (pakai `components/DeleteProjectDialog.vue`,
 *   lalu redirect ke `{ name: 'projects' }`).
 * - Hanya admin yang boleh mengubah; member melihat mode baca saja (`canManage`).
 *
 * Yang sudah tersedia (API sungguhan):
 * - `useCurrentProject()` → `project`, `canManage`.
 * - `useUpdateProject`, `useDeleteProject`.
 * - Sementara ini edit/hapus bisa lewat menu "..." di header project.
 */
import ProjectTabPlaceholder from '../../components/ProjectTabPlaceholder.vue'
</script>

<template>
  <ProjectTabPlaceholder
    title="Pengaturan sedang dikerjakan"
    description="Untuk sementara, edit atau hapus project lewat menu ••• di bagian atas halaman."
  />
</template>
