import { z } from 'zod'

export class WalletValidation {
  static readonly UPDATE_BALANCE = z.object({
    name: z.string(),
    balance: z.number()
  })
}
