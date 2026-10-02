<script setup lang="ts">
import { Columns3, FolderKanban, Users } from '@lucide/vue'
import BrandMark from '@/components/BrandMark.vue'

// Halaman publik: hanya menjelaskan fitur, tidak menampilkan apa pun yang terlihat seperti data project.
// Kelas ditulis utuh supaya terdeteksi Tailwind.
const features = [
  {
    icon: FolderKanban,
    iconClass: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
    title: 'Project & Module',
    description: 'Kelompokkan pekerjaan per project dan module dengan rentang waktu yang jelas.',
  },
  {
    icon: Columns3,
    iconClass: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
    title: 'Board & List',
    description: 'Geser task antar status, lalu filter berdasarkan assignee, prioritas, dan due date.',
  },
  {
    icon: Users,
    iconClass: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
    title: 'Kolaborasi Tim',
    description: 'Undang member, atur role admin atau member, dan bagi task ke anggota tim.',
  },
]
</script>

<template>
  <div class="grid min-h-svh bg-background lg:grid-cols-2">
    <aside class="hidden flex-col justify-between gap-10 border-r bg-sidebar p-10 lg:flex">
      <div class="flex items-center gap-2.5">
        <BrandMark />
        <span class="font-semibold">Project Management</span>
      </div>

      <div class="max-w-md space-y-10">
        <div class="space-y-3">
          <h2 class="text-3xl font-bold tracking-tight text-balance">
            Satu ruang kerja untuk semua project dan task tim Anda.
          </h2>
          <p class="text-muted-foreground">
            Rencanakan, bagi tugas, dan pantau progres tim tanpa berpindah aplikasi.
          </p>
        </div>

        <ul class="space-y-6">
          <li v-for="feature in features" :key="feature.title" class="flex gap-4">
            <span :class="[feature.iconClass, 'flex size-10 shrink-0 items-center justify-center rounded-xl']">
              <component :is="feature.icon" class="size-5" />
            </span>
            <div class="space-y-1">
              <p class="font-semibold">{{ feature.title }}</p>
              <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
            </div>
          </li>
        </ul>
      </div>

      <p class="text-sm text-muted-foreground">© {{ new Date().getFullYear() }} Project Management</p>
    </aside>

    <main class="flex flex-col items-center justify-center gap-10 px-4 py-10 sm:px-10">
      <div class="flex items-center gap-2.5 lg:hidden">
        <BrandMark />
        <span class="font-semibold">Project Management</span>
      </div>

      <div class="w-full max-w-sm">
        <RouterView />
      </div>
    </main>
  </div>
</template>
