import { z } from 'zod'

export class WalletValidation {
  static readonly UPDATE_WALLET = z.object({
    name: z.string(),
    balance: z.number()
  })
}
