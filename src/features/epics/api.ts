import { http } from '@/lib/http'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, unref, type MaybeRef } from 'vue'
import type { Epic, CreateEpicPayload, UpdateEpicPayload } from './types'

export async function getProjectEpics(projectId: string): Promise<Epic[]> {
  const { data } = await http.get<Epic[]>(`/projects/${projectId}/epics`)
  return data
}

export async function createEpic(projectId: string, payload: CreateEpicPayload): Promise<Epic> {
  const { data } = await http.post<Epic>(`/projects/${projectId}/epics`, payload)
  return data
}

export async function updateEpic(epicId: string, payload: UpdateEpicPayload): Promise<Epic> {
  const { data } = await http.patch<Epic>(`/epics/${epicId}`, payload)
  return data
}

export async function deleteEpic(epicId: string): Promise<void> {
  await http.delete(`/epics/${epicId}`)
}

export function useEpicsQuery(projectId: MaybeRef<string>) {
  const id = computed(() => unref(projectId))

  return useQuery({
    queryKey: ['epics', id],
    queryFn: () => getProjectEpics(id.value),
    enabled: computed(() => !!id.value),
  })
}

export function useCreateEpicMutation(projectId: MaybeRef<string>) {
  const queryClient = useQueryClient()
  const id = computed(() => unref(projectId))

  return useMutation({
    mutationFn: (payload: CreateEpicPayload) => createEpic(id.value, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epics', id] })
    },
  })
}

export function useUpdateEpicMutation(projectId: MaybeRef<string>) {
  const queryClient = useQueryClient()
  const id = computed(() => unref(projectId))

  return useMutation({
    mutationFn: ({ epicId, payload }: { epicId: string; payload: UpdateEpicPayload }) =>
      updateEpic(epicId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epics', id] })
    },
  })
}

export function useDeleteEpicMutation(projectId: MaybeRef<string>) {
  const queryClient = useQueryClient()
  const id = computed(() => unref(projectId))

  return useMutation({
    mutationFn: (epicId: string) => deleteEpic(epicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epics', id] })
    },
  })
}
