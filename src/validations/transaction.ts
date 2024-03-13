import { z } from 'zod'

export class TransactionValidation {
  static readonly GET_ALL = z.object({
    walletId: z.coerce.number().optional(),
    categoryId: z.coerce.number().optional(),
    fromAmount: z.coerce.number().optional(),
    toAmount: z.coerce.number().optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
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
