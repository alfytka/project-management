<script setup lang="ts">
import { X } from '@lucide/vue'
import { provide, type HTMLAttributes } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer'
import { useIsDesktop } from '@/composables/useIsDesktop'
import { cn } from '@/lib/utils'
import { RESPONSIVE_DIALOG_DESKTOP } from './context'

/**
 * Dialog di desktop, bottom sheet (drawer) di mobile.
 * Isi dengan `ResponsiveDialogBody` (area scroll) dan `ResponsiveDialogFooter` (tombol, sticky di mobile).
 */
const props = defineProps<{
  title: string
  description?: string
  /** Kelas tambahan untuk konten dialog desktop, mis. `sm:max-w-2xl`. */
  class?: HTMLAttributes['class']
}>()

const open = defineModel<boolean>('open', { required: true })

const isDesktop = useIsDesktop()
provide(RESPONSIVE_DIALOG_DESKTOP, isDesktop)
</script>

<template>
  <Dialog v-if="isDesktop" v-model:open="open">
    <DialogContent :class="cn('flex max-h-[90dvh] flex-col gap-0 p-0', props.class)">
      <DialogHeader class="p-6 pb-4">
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription :class="!description && 'sr-only'">{{ description ?? title }}</DialogDescription>
      </DialogHeader>
      <slot />
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="open">
    <DrawerContent class="max-h-[92dvh]! rounded-t-2xl">
      <div class="flex items-center justify-between gap-4 border-b px-5 pt-3 pb-4">
        <DrawerTitle class="text-lg font-semibold">{{ title }}</DrawerTitle>
        <DrawerClose
          class="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Tutup"
        >
          <X class="size-4" />
        </DrawerClose>
      </div>
      <DrawerDescription class="sr-only">{{ description ?? title }}</DrawerDescription>
      <slot />
    </DrawerContent>
  </Drawer>
</template>
