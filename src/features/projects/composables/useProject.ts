import { useQuery } from '@tanstack/vue-query'
import { isAxiosError } from 'axios'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getProject } from '../api'

export function useProject(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => ['projects', toValue(id)]),
    queryFn: () => getProject(toValue(id)),
    // Breadcrumb memanggil ini di semua halaman; tanpa id jangan request `GET /projects/`.
    enabled: computed(() => !!toValue(id)),
    // 403/404 tidak akan berubah dengan mencoba ulang — tampilkan "tidak ditemukan" segera.
    retry: (count, error) => !(isAxiosError(error) && [403, 404].includes(error.response?.status ?? 0)) && count < 1,
  })
}
