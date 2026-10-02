<script setup lang="ts">
import { Ellipsis, FolderOpen, Pencil, Trash2 } from '@lucide/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { EpicListItem } from '../types'

defineProps<{
  epic: EpicListItem
  canManage: boolean
}>()

const emit = defineEmits<{
  open: [epic: EpicListItem]
  edit: [epic: EpicListItem]
  delete: [epic: EpicListItem]
}>()
</script>

<template>
  <!-- Non-modal: klik di luar langsung mengenai elemen tujuan, bukan hanya menutup menu. -->
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger as-child>
      <button
        type="button"
        aria-label="Aksi module"
        class="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent"
      >
        <Ellipsis class="size-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="emit('open', epic)">
        <FolderOpen class="size-4" />
        Buka module
      </DropdownMenuItem>
      <template v-if="canManage">
        <DropdownMenuItem @click="emit('edit', epic)">
          <Pencil class="size-4" />
          Edit module
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" @click="emit('delete', epic)">
          <Trash2 class="size-4" />
          Hapus module
        </DropdownMenuItem>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
