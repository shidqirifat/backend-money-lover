import { z } from 'zod'

export class UserValidation {
  static readonly LOGIN = z.object({
    email: z.string().email(),
    password: z.string()
  })
}
