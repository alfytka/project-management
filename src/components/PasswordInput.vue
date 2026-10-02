<script setup lang="ts">
import { Eye, EyeOff, Lock } from '@lucide/vue'
import { ref } from 'vue'
import { Input } from '@/components/ui/input'

/**
 * Input password dengan ikon gembok dan tombol tampilkan/sembunyikan.
 * Atribut (id, aria-*, autocomplete dari `FormControl`) diteruskan ke `<input>`.
 */
defineOptions({ inheritAttrs: false })

const model = defineModel<string>()
const visible = ref(false)
</script>

<template>
  <div class="relative">
    <Lock class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input v-bind="$attrs" v-model="model" :type="visible ? 'text' : 'password'" class="h-10 px-9" />
    <button
      type="button"
      class="absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      :aria-label="visible ? 'Sembunyikan password' : 'Tampilkan password'"
      :aria-pressed="visible"
      @click="visible = !visible"
    >
      <EyeOff v-if="visible" class="size-4" />
      <Eye v-else class="size-4" />
    </button>
  </div>
</template>
