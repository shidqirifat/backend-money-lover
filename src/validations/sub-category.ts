import { z } from 'zod'

export class SubCategoryValidation {
  static readonly CREATE_SUB_CATEGORY = z.object({
    name: z.string(),
    categoryId: z.number()
  })
}
