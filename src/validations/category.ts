import { z } from 'zod'

export class CategoryValidation {
  static readonly CREATE_CATEGORY = z.object({
    name: z.string(),
    masterCategoryTransactionId: z.number()
  })

  static readonly UPDATE_CATEGORY = z.object({
    name: z.string(),
    masterCategoryTransactionId: z.number()
  })
}
