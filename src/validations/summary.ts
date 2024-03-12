import { z } from 'zod'

export class SummaryValidation {
  static readonly GET_SUMMARY_TRANSACTION = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime()
  })
}
