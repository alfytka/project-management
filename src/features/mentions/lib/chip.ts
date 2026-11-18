/**
 * Kelas chip mention, dipakai bersama oleh `MentionChip.vue` (mode baca) dan node mention di
 * editor TipTap (yang dirender lewat `renderHTML`, bukan komponen Vue).
 */
export const MENTION_CHIP_CLASS =
  'inline rounded-md bg-violet-500/10 px-1 py-px font-medium whitespace-nowrap text-violet-700 dark:bg-violet-400/15 dark:text-violet-300 data-[inactive]:bg-muted data-[inactive]:text-muted-foreground'
