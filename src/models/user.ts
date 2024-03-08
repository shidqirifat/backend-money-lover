import { type User } from '@prisma/client'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  name: string
  email: string
  token: string
}

export function toLoginResponse (user: User): LoginResponse {
  return {
    name: user.name,
    email: user.email,
    token: user.token as string
  }
}
