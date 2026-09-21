<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
    <p class="text-muted-foreground text-sm font-medium">404</p>
    <h1 class="text-2xl font-semibold">Halaman tidak ditemukan</h1>
    <Button as-child>
      <RouterLink to="/">Kembali ke beranda</RouterLink>
    </Button>
  </div>
</template>
