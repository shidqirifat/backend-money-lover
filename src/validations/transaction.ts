import { z } from 'zod'

export class TransactionValidation {
  static readonly CREATE_TRANSACTION = z.object({
    amount: z.number(),
    description: z.string(),
    date: z.string().datetime(),
    categoryId: z.number(),
    subCategoryId: z.number().nullable(),
    walletId: z.number()
  })
}
