<script setup lang="ts">
/**
 * TAB EPICS — TEMPLATE, BELUM DIIMPLEMENTASIKAN.
 *
 * Route : /projects/:id/epics  (name: 'project-epics')
 *
 * TODO:
 * - Tampilkan daftar epic project (nama, status, progress, rentang tanggal, jumlah task).
 * - Admin bisa buat / edit / hapus epic (dialog + form; schema zod di `schema.ts`).
 * - Filter status: Berjalan / Terlambat / Selesai / Belum mulai.
 *
 * Yang sudah tersedia:
 * - `useProjectEpics(projectId)` → data epic (MASIH MOCK, lihat `api.ts` & `mock.ts`).
 * - `getEpicStatus`, `getEpicProgress`, `EPIC_STATUS_META` di `lib/epic.ts` (label & warna status).
 * - `useCurrentProject()` → `project`, `canManage` (admin atau bukan).
 * - Contoh tampilan status/progress: `components/overview/EpicTimeline.vue`.
 *
 * Catatan: sambungkan ke endpoint epic sungguhan di `api.ts` begitu backend siap.
 */
import ProjectTabPlaceholder from '../../components/ProjectTabPlaceholder.vue'
</script>

<template>
  <ProjectTabPlaceholder
    title="Epics sedang dikerjakan"
    description="Daftar dan pengelolaan epic project akan tersedia di sini."
  />
</template>
