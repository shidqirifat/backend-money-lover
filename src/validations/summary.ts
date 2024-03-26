import { z } from 'zod'

export class SummaryValidation {
  static readonly GET_SUMMARY_TRANSACTION = z.object({
    fromDate: z.string().datetime(),
    toDate: z.string().datetime()
  })
}
