<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CreateEpicPayload, Epic } from '../types'

const props = defineProps<{
  open: boolean
  epic_to_edit?: Epic | null
  is_loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: CreateEpicPayload): void
}>()

const title = ref('')
const description = ref('')
const start_date = ref('')
const end_date = ref('')
const error_message = ref('')

function formatDateForInput(date_str?: string) {
  if (!date_str) return ''
  const d = new Date(date_str)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')
}

watch(
  () => props.open,
  (is_open) => {
    if (is_open) {
      error_message.value = ''
      if (props.epic_to_edit) {
        title.value = props.epic_to_edit.title ?? ''
        description.value = props.epic_to_edit.description ?? ''
        start_date.value = formatDateForInput(props.epic_to_edit.start_date)
        end_date.value = formatDateForInput(props.epic_to_edit.end_date)
      } else {
        title.value = ''
        description.value = ''
        start_date.value = ''
        end_date.value = ''
      }
    }
  }
)

function handleSubmit() {
  error_message.value = ''

  const clean_title = title.value.trim()
  const clean_desc = description.value.trim()

  if (!clean_title) {
    error_message.value = 'Judul epic wajib diisi.'
    return
  }
  if (!start_date.value) {
    error_message.value = 'Tanggal mulai wajib diisi.'
    return
  }
  if (!end_date.value) {
    error_message.value = 'Tanggal selesai wajib diisi.'
    return
  }
  if (new Date(end_date.value) < new Date(start_date.value)) {
    error_message.value = 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.'
    return
  }

  const iso_start = new Date(start_date.value).toISOString()
  const iso_end = new Date(end_date.value).toISOString()

  emit('submit', {
    title: clean_title,
    description: clean_desc || undefined,
    start_date: iso_start,
    end_date: iso_end,
  })
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-5">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 class="font-bold text-slate-800 text-base">
          {{ epic_to_edit ? 'Edit Epic' : 'Tambah Epic Baru' }}
        </h3>
        <button
          type="button"
          class="text-slate-400 hover:text-slate-600 text-lg leading-none"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <div v-if="error_message" class="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-xs">
        {{ error_message }}
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Judul Epic *</label>
          <input
            v-model="title"
            type="text"
            placeholder="Contoh: Modul Autentikasi"
            class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
          <textarea
            v-model="description"
            rows="3"
            placeholder="Tuliskan penjelasan ringkas mengenai epic ini..."
            class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Mulai *</label>
            <input
              v-model="start_date"
              type="date"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tanggal Selesai *</label>
            <input
              v-model="end_date"
              type="date"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            class="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            @click="emit('close')"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="is_loading"
            class="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ is_loading ? 'Menyimpan...' : 'Simpan Epic' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>