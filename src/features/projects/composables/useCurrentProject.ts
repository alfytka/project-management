import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProject } from './useProject'

/**
 * Project aktif berdasarkan param `:id` di route, beserta role user yang login.
 * Dipakai oleh halaman detail project dan seluruh tab-nya.
 */
export function useCurrentProject() {
  const route = useRoute()
  const authStore = useAuthStore()

  const projectId = computed(() => String(route.params.id ?? ''))
  const query = useProject(projectId)

  const myRole = computed(
    () => query.data.value?.members.find((m) => m.user_id === authStore.user?.id)?.role,
  )
  const canManage = computed(() => myRole.value === 'admin')

  return { ...query, projectId, project: query.data, myRole, canManage }
}
