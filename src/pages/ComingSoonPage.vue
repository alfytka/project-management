<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{ title: string }>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
      <CardDescription>Halaman ini belum diimplementasikan.</CardDescription>
    </CardHeader>
    <CardContent class="text-muted-foreground text-sm">Segera hadir.</CardContent>
  </Card>
</template>
