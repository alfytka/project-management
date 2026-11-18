<script setup lang="ts">
import { Extension } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Placeholder, UndoRedo } from '@tiptap/extensions'
import type { SuggestionProps } from '@tiptap/suggestion'
import { EditorContent, useEditor, VueRenderer } from '@tiptap/vue-3'
import { computed, useId, watch, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { MENTION_CHIP_CLASS } from '../lib/chip'
import { buildMentionTargets, descriptionToDoc, docToDescription, type MentionNodeAttrs } from '../lib/description'
import type { TaskMention } from '../types'
import MentionSuggestionList, { type MentionSuggestionItem } from './MentionSuggestionList.vue'

/**
 * Editor deskripsi yang sadar mention: tampil `@Nama` (chip), `v-model` berisi teks tersimpan
 * dengan `@email`. Ketik `@` untuk memilih member project.
 */
const props = defineProps<{
  members: MentionSuggestionItem[]
  /** Array `mentions` dari response task (sumber kebenaran untuk chip). */
  mentions?: TaskMention[]
  placeholder?: string
  autofocus?: boolean
  invalid?: boolean
  id?: string
  ariaLabel?: string
  class?: HTMLAttributes['class']
}>()

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ blur: [] }>()

const containerId = useId()
const SUGGESTION_LIMIT = 8

// Member tetap jadi cadangan untuk `@email` yang baru diketik dan belum tersimpan di `mentions`.
const targets = computed(() => buildMentionTargets(props.mentions ?? [], props.members, { includeMembers: true }))

const duplicateNames = computed(() => {
  const counts = new Map<string, number>()
  for (const member of props.members) {
    const key = member.name.trim().toLowerCase()
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return new Set([...counts].filter(([, count]) => count > 1).map(([name]) => name))
})

/**
 * Cocokkan nama, atau bagian lokal email (sebelum `@`) — domain diabaikan karena biasanya sama
 * untuk semua member dan akan membuat semua orang cocok. Nama yang diawali query tampil lebih dulu.
 */
function suggest(query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return props.members.slice(0, SUGGESTION_LIMIT)

  const rank = (member: MentionSuggestionItem) => {
    const name = member.name.toLowerCase()
    if (name.startsWith(needle)) return 0
    if (name.split(/\s+/).some((word) => word.startsWith(needle))) return 1
    if (name.includes(needle) || member.email.toLowerCase().split('@')[0]!.includes(needle)) return 2
    return -1
  }

  return props.members
    .map((member) => ({ member, score: rank(member) }))
    .filter(({ score }) => score >= 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, SUGGESTION_LIMIT)
    .map(({ member }) => member)
}

/**
 * Escape = selesai mengedit (blur → pemakai menyimpan), bukan menutup dialog/sheet di sekitarnya.
 * Tanpa ini Escape langsung menutup panel detail task dan ketikan hilang karena editor di-unmount
 * tanpa event blur. Prioritas di bawah Mention (100) supaya Escape menutup dropdown mention dulu.
 */
const ExitOnEscape = Extension.create({
  name: 'exitOnEscape',
  priority: 50,
  addKeyboardShortcuts() {
    return { Escape: ({ editor }) => editor.commands.blur() }
  },
})

const MentionNode = Mention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      inactive: {
        default: false,
        parseHTML: (element) => element.hasAttribute('data-inactive'),
        renderHTML: (attributes) => (attributes.inactive ? { 'data-inactive': '' } : {}),
      },
    }
  },
})

/** Nilai yang terakhir dikirim lewat v-model, supaya perubahan dari luar bisa dibedakan dari ketikan sendiri. */
let lastValue = model.value

const editor = useEditor({
  content: descriptionToDoc(model.value, targets.value),
  autofocus: props.autofocus ? 'end' : false,
  extensions: [
    Document,
    Paragraph,
    Text,
    UndoRedo,
    ExitOnEscape,
    Placeholder.configure({ placeholder: () => props.placeholder ?? '' }),
    MentionNode.configure({
      HTMLAttributes: { class: MENTION_CHIP_CLASS },
      deleteTriggerWithBackspace: true,
      renderText: ({ node }) => `@${node.attrs.id}`,
      // `options.HTMLAttributes` sudah digabung dengan atribut node (class chip, data-id, data-inactive).
      renderHTML: ({ options, node }) => ['span', options.HTMLAttributes, `@${node.attrs.label ?? node.attrs.id}`],
      suggestion: {
        char: '@',
        allowedPrefixes: [' ', '('],
        // Dropdown dipasang di dalam wrapper editor (bukan body) agar tetap di dalam layer dialog/sheet.
        container: `#${CSS.escape(containerId)}`,
        items: ({ query }) => suggest(query),
        render: () => {
          let renderer: VueRenderer | undefined
          let unmount: (() => void) | undefined
          // Hanya props yang dideklarasikan komponen; sisanya (editor, clientRect, dst.) akan
          // jatuh sebagai atribut DOM bila ikut diteruskan.
          const listProps = ({ items, command }: SuggestionProps<MentionSuggestionItem, MentionNodeAttrs>) => ({
            items,
            command,
            duplicateNames: duplicateNames.value,
          })

          return {
            onStart: (suggestionProps) => {
              renderer = new VueRenderer(MentionSuggestionList, {
                props: listProps(suggestionProps),
                editor: suggestionProps.editor,
              })
              if (renderer.element) unmount = suggestionProps.mount(renderer.element as HTMLElement)
            },
            onUpdate: (suggestionProps) => {
              renderer?.updateProps(listProps(suggestionProps))
            },
            onKeyDown: (keyDownProps) => renderer?.ref?.onKeyDown(keyDownProps) ?? false,
            onExit: () => {
              unmount?.()
              renderer?.destroy()
              renderer = undefined
              unmount = undefined
            },
          }
        },
      },
    }),
  ],
  editorProps: {
    attributes: {
      role: 'textbox',
      'aria-multiline': 'true',
      ...(props.id && { id: props.id }),
      ...(props.ariaLabel && { 'aria-label': props.ariaLabel }),
      class: 'min-h-12 outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    lastValue = docToDescription(editor.getJSON())
    model.value = lastValue
  },
  onBlur: () => emit('blur'),
})

// Nilai berubah dari luar (refetch, reset form): muat ulang dokumen tanpa memicu onUpdate.
watch(model, (value) => {
  if (value === lastValue || !editor.value) return
  lastValue = value
  editor.value.commands.setContent(descriptionToDoc(value, targets.value), { emitUpdate: false })
})

function focus() {
  editor.value?.commands.focus('end')
}

defineExpose({ focus })
</script>

<template>
  <div
    :id="containerId"
    :aria-invalid="invalid || undefined"
    :class="
      cn(
        'mention-editor relative min-h-16 w-full cursor-text rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        props.class,
      )
    "
    @click.self="focus"
  >
    <EditorContent :editor="editor" class="break-words" />
  </div>
</template>

<style scoped>
/* Placeholder TipTap: dirender sebagai pseudo-element pada paragraf kosong pertama. */
.mention-editor :deep(p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  color: var(--muted-foreground);
}
</style>
