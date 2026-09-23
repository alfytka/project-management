<script setup lang="ts">
import { RouterLink } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'
</script>

<template>
  <div class="space-y-8">
    <div class="space-y-2 text-center lg:text-left">
      <h1 class="text-2xl font-semibold tracking-tight">Buat akun baru</h1>
      <p class="text-muted-foreground text-sm">Mulai kelola project dan task tim Anda.</p>
    </div>

    <RegisterForm />

    <p class="text-muted-foreground text-center text-sm">
      Sudah punya akun?
      <RouterLink to="/login" class="text-foreground font-medium underline underline-offset-4">
        Masuk
      </RouterLink>
    </p>
  </div>
</template>
