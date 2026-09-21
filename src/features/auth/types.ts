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
  username: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
}
