import { http } from '@/lib/http'
import type { LoginPayload, Token, UserCreate, UserResponse } from './types'

export async function login(payload: LoginPayload) {
  const body = new URLSearchParams({
    grant_type: 'password',
    username: payload.username,
    password: payload.password,
  })

  const { data } = await http.post<Token>('/auth/login', body)
  return data
}

export async function register(payload: UserCreate) {
  const { data } = await http.post<UserResponse>('/auth/register', payload)
  return data
}
