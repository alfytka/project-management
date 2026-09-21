import { useQuery } from '@tanstack/vue-query'
import { getProjects } from '../api'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
}
