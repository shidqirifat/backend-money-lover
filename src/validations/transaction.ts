import { z } from 'zod'

export class TransactionValidation {
  static readonly GET_ALL = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    keyword: z.string().optional()
  })

  static readonly CREATE_TRANSACTION = z.object({
    amount: z.number(),
    description: z.string(),
    date: z.string().datetime(),
    categoryId: z.number(),
    subCategoryId: z.number().nullable(),
    walletId: z.number()
  })

  static readonly UPDATE_TRANSACTION = z.object({
    amount: z.number(),
    description: z.string(),
    date: z.string().datetime(),
    categoryId: z.number(),
    subCategoryId: z.number().nullable(),
    walletId: z.number()
  })
}
