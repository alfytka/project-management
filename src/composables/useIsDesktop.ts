import { useMediaQuery } from '@vueuse/core'

/** ≥ 768px (breakpoint `md`). Di bawahnya dialog tampil sebagai bottom sheet. */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 768px)')
}
