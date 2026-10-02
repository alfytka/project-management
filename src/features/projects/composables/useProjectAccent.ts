import { computed } from 'vue'
import { getProjectAccent } from '../lib/accent'
import { useProjects } from './useProjects'

/**
 * Pemberi warna aksen project yang konsisten di sidebar, card, dan header detail.
 * Memakai cache `useProjects()`, jadi tidak menambah request.
 */
export function useProjectAccent() {
  const { data: projects } = useProjects()

  const order = computed(() => {
    const sorted = [...(projects.value ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at))
    return new Map(sorted.map((project, index) => [project.id, index]))
  })

  return (id: string) => getProjectAccent(id, order.value.get(id))
}
