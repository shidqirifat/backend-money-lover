import { z } from 'zod'

export class CategoryValidation {
  static readonly CREATE_CATEGORY = z.object({
    name: z.string()
  })
}
