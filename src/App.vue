<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <RouterView />
  <!-- Warna per jenis (success/info/warning/error) diatur lewat CSS variable di style.css. -->
  <Toaster
    position="top-right"
    rich-colors
    close-button
    close-button-position="top-right"
    :duration="4000"
    :visible-toasts="3"
  />
</template>
