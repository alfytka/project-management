# project-management — Frontend

## Stack
- Vue 3 (Composition API + <script setup>), TypeScript, Vite
- Tailwind CSS v4, shadcn-vue (Reka UI based)
- TanStack Query (Vue Query) untuk server state
- TanStack Table untuk data table
- Pinia untuk client/UI state SAJA (bukan server state)
- vee-validate + zod v3 (BUKAN v4 — @vee-validate/zod belum support v4)
- Package manager: pnpm (bukan npm/yarn)

## Bash commands
- `pnpm dev` — jalankan dev server
- `pnpm build` — build production
- `pnpm type-check` — cek TypeScript
- `pnpm lint` — jalankan linter
- `pnpm test:unit` — jalankan Vitest

## Code style
- Gunakan Composition API dengan <script setup lang="ts">, jangan Options API
- Import komponen shadcn-vue dari `@/components/ui/*`, jangan modifikasi
  file di folder itu kecuali diminta eksplisit — kalau perlu kustomisasi,
  buat wrapper component baru di `@/components/`
- Struktur folder: feature-based di `src/features/<nama-fitur>/`
  (components, composables, api.ts, schema.ts, columns.ts, types.ts)
- Query key TanStack Query: gunakan array, format `['<domain>', <params>]`
- Form: schema zod didefinisikan di `schema.ts` per fitur, pakai
  `toTypedSchema()` dari `@vee-validate/zod`, komponen form pakai
  `<Form>`, `<FormField>` dari shadcn-vue

## Workflow
- Setelah selesai ubah kode, WAJIB jalankan `pnpm type-check` sebelum
  dianggap selesai
- Jangan jalankan `pnpm build` kecuali diminta eksplisit (lambat)
- Untuk fitur baru yang menyentuh lebih dari 2 file, buat plan dulu
  sebelum implementasi

## Gotcha
- zod harus tetap versi 3.x — `pnpm dlx shadcn-vue add form` bisa
  otomatis downgrade zod, cek `package.json` setelah menjalankan itu
- Alias `@` mengarah ke `src/`, sudah dikonfigurasi di tsconfig.json,
  tsconfig.app.json, dan vite.config.ts
