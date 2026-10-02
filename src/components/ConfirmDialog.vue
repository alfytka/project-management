<script setup lang="ts">
import { CircleHelp, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer'
import { useIsDesktop } from '@/composables/useIsDesktop'

/** Dialog konfirmasi: dialog di desktop, bottom sheet dengan tombol bertumpuk di mobile. */
const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    confirmLabel?: string
    pendingLabel?: string
    pending?: boolean
    disabled?: boolean
    destructive?: boolean
  }>(),
  { description: undefined, confirmLabel: 'Hapus', pendingLabel: 'Memproses...', destructive: true },
)

const emit = defineEmits<{ confirm: [] }>()

const open = defineModel<boolean>('open', { required: true })

const isDesktop = useIsDesktop()
const icon = computed(() => (props.destructive ? TriangleAlert : CircleHelp))
const iconClass = computed(() =>
  props.destructive
    ? 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400'
    : 'bg-muted text-foreground',
)
const label = computed(() => (props.pending ? props.pendingLabel : props.confirmLabel))
</script>

<template>
  <Dialog v-if="isDesktop" v-model:open="open">
    <DialogContent class="sm:max-w-md" :show-close-button="false">
      <div class="flex gap-4">
        <span :class="[iconClass, 'flex size-10 shrink-0 items-center justify-center rounded-full']">
          <component :is="icon" class="size-5" />
        </span>
        <DialogHeader class="min-w-0 flex-1 text-left">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogDescription>
            <slot name="description">{{ description }}</slot>
          </DialogDescription>
        </DialogHeader>
      </div>
      <slot />
      <DialogFooter>
        <Button variant="outline" :disabled="pending" @click="open = false">Batal</Button>
        <Button :variant="destructive ? 'destructive' : 'default'" :disabled="pending || disabled" @click="emit('confirm')">
          {{ label }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="open">
    <DrawerContent class="rounded-t-2xl">
      <div class="flex flex-col items-center gap-2 px-6 pt-6 text-center">
        <span :class="[iconClass, 'mb-2 flex size-14 items-center justify-center rounded-full']">
          <component :is="icon" class="size-6" />
        </span>
        <DrawerTitle class="text-lg font-semibold">{{ title }}</DrawerTitle>
        <DrawerDescription class="text-muted-foreground">
          <slot name="description">{{ description }}</slot>
        </DrawerDescription>
      </div>
      <div v-if="$slots.default" class="px-6 pt-4"><slot /></div>
      <div class="flex flex-col gap-3 px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Button
          :variant="destructive ? 'destructive' : 'default'"
          class="h-12 rounded-xl text-base"
          :disabled="pending || disabled"
          @click="emit('confirm')"
        >
          {{ label }}
        </Button>
        <Button variant="outline" class="h-12 rounded-xl text-base" :disabled="pending" @click="open = false">
          Batal
        </Button>
      </div>
    </DrawerContent>
  </Drawer>
</template>
