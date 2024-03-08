import { type User } from '@prisma/client'

export type LoginRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  name: string
  email: string
  token: string
}

export interface RegisterRequest extends LoginRequest {
  name: string
}

export function toAuthResponse (user: User): AuthResponse {
  return {
    name: user.name,
    email: user.email,
    token: user.token as string
  }
}
