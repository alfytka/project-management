<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2 text-center lg:text-left">
      <h1 class="text-2xl font-semibold tracking-tight">Masuk ke akun Anda</h1>
      <p class="text-muted-foreground text-sm">Kelola project dan task Anda kembali.</p>
    </div>

    <LoginForm />

    <p class="text-muted-foreground text-center text-sm">
      Belum punya akun?
      <RouterLink to="/register" class="text-foreground font-medium underline underline-offset-4">
        Daftar
      </RouterLink>
    </p>
  </div>
</template>
