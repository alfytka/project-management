import { http } from '@/lib/http'
import type { LoginPayload, LoginResponse, MeResponse, UserCreate, UserResponse } from './types'

export async function login(payload: LoginPayload) {
  const { data } = await http.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function register(payload: UserCreate) {
  const { data } = await http.post<UserResponse>('/auth/register', payload)
  return data
}

export async function getMe() {
  const { data } = await http.get<MeResponse>('/me')
  return data.user
}
