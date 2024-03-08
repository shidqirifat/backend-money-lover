import { z } from 'zod'

export class UserValidation {
  static readonly REGISTER = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
  })

  static readonly LOGIN = z.object({
    email: z.string().email(),
    password: z.string()
  })
}
