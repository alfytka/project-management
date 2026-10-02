<script setup lang="ts">
import { SelectContent } from '@/components/ui/select'

/**
 * `SelectContent` non-modal.
 *
 * Bawaan Reka memblokir pointer di luar dropdown selama terbuka (`disableOutsidePointerEvents`)
 * dan mengunci scroll body, sehingga klik ke input lain hanya menutup dropdown dan user harus
 * klik sekali lagi. Di sini klik pertama langsung menutup dropdown sekaligus mengenai elemen
 * yang dituju.
 *
 * Saat ditutup, Reka juga mengembalikan fokus ke trigger. Kalau penutupnya klik di luar, fokus
 * itu merebut fokus dari input yang baru diklik — dan ketikan berikutnya malah ditangkap
 * typeahead select (mis. mengetik "a" memilih "Admin"). Jadi pengembalian fokus hanya
 * dilakukan bila dropdown ditutup lewat keyboard / memilih item.
 */
defineOptions({ inheritAttrs: false })

let closedByOutsidePointer = false

function onPointerDownOutside() {
  closedByOutsidePointer = true
}

function onCloseAutoFocus(event: Event) {
  if (closedByOutsidePointer) event.preventDefault()
  closedByOutsidePointer = false
}
</script>

<template>
  <SelectContent
    v-bind="$attrs"
    :disable-outside-pointer-events="false"
    :body-lock="false"
    @pointer-down-outside="onPointerDownOutside"
    @close-auto-focus="onCloseAutoFocus"
  >
    <slot />
  </SelectContent>
</template>
