export interface UserCreate {
  name: string
  email: string
  password: string
}

export interface UserResponse {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: UserResponse
}

export interface MeResponse {
  message: string
  user: UserResponse
}
