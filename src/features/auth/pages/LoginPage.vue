<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-xl">Masuk ke akun Anda</CardTitle>
      <CardDescription>Kelola project dan task Anda kembali.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <LoginForm />
      <p class="text-muted-foreground text-center text-sm">
        Belum punya akun?
        <RouterLink to="/register" class="text-foreground font-medium underline underline-offset-4">
          Daftar
        </RouterLink>
      </p>
    </CardContent>
  </Card>
</template>
