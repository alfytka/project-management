<script setup lang="ts">
import RegisterForm from '../components/RegisterForm.vue'
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-1">
      <h1 class="text-3xl font-bold tracking-tight">Buat Akun</h1>
      <p class="text-muted-foreground">Mulai kelola project dan task tim Anda.</p>
    </div>

    <RegisterForm />

    <p class="text-center text-sm text-muted-foreground">
      Sudah punya akun?
      <RouterLink :to="{ name: 'login' }" class="font-medium text-foreground underline underline-offset-4">
        Masuk
      </RouterLink>
    </p>
  </div>
</template>
