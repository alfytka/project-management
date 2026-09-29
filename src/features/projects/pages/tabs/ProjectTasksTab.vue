<script setup lang="ts">
/**
 * TAB TASKS — TEMPLATE, BELUM DIIMPLEMENTASIKAN.
 *
 * Route : /projects/:id/tasks  (name: 'project-tasks')
 *
 * TODO:
 * - Tabel task pakai TanStack Table (definisi kolom di `columns.ts` fitur terkait).
 * - Kolom: judul, epic, assignee (pakai `UserAvatar`), status, due date.
 * - Filter per epic / status / assignee, pencarian, dan (opsional) tampilan board.
 * - Buat / edit task (form vee-validate + zod di `schema.ts`).
 *
 * Yang sudah tersedia:
 * - `useProjectTaskStats(projectId)` → ringkasan jumlah task (MASIH MOCK).
 * - `useCurrentProject()` → `project` (termasuk `members` untuk pilihan assignee), `canManage`.
 * - `@/components/UserAvatar.vue`, `@/components/AvatarStack.vue`.
 *
 * Catatan: backend belum punya endpoint task. Tambahkan type + fungsi API di `types.ts` & `api.ts`
 * dengan query key `['tasks', { projectId }]`.
 */
import ProjectTabPlaceholder from '../../components/ProjectTabPlaceholder.vue'
</script>

<template>
  <ProjectTabPlaceholder
    title="Tasks sedang dikerjakan"
    description="Daftar task project beserta filter dan assignee akan tersedia di sini."
  />
</template>
