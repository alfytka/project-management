<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Selamat datang{{ authStore.user?.email ? `, ${authStore.user.email}` : '' }}</CardTitle>
      <CardDescription>
        Dashboard ini akan diisi ringkasan project & task pada iterasi berikutnya.
      </CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">
      Shell aplikasi (sidebar, topbar, auth) sudah siap dipakai untuk membangun fitur project
      management selanjutnya.
    </CardContent>
  </Card>
</template>
