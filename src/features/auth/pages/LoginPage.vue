<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h1 class="text-3xl font-bold tracking-tight">Masuk</h1>
      <p class="text-muted-foreground">Masuk untuk melanjutkan ke project Anda.</p>
    </div>

    <LoginForm />

    <p class="text-center text-sm text-muted-foreground">
      Belum punya akun?
      <RouterLink :to="{ name: 'register' }" class="font-medium text-foreground underline underline-offset-4">
        Daftar
      </RouterLink>
    </p>
  </div>
</template>
