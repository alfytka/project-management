<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RegisterForm from '../components/RegisterForm.vue'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-xl">Buat akun baru</CardTitle>
      <CardDescription>Mulai kelola project dan task tim Anda.</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <RegisterForm />
      <p class="text-muted-foreground text-center text-sm">
        Sudah punya akun?
        <RouterLink to="/login" class="text-foreground font-medium underline underline-offset-4">
          Masuk
        </RouterLink>
      </p>
    </CardContent>
  </Card>
</template>
