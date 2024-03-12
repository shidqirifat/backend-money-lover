import { ResponseError } from '@/errors/response-error'
import { toSummaryWalletResponse, type SummaryWalletResponse } from '@/models/summary'
import db from '@/utils/prisma'
import { type User } from '@prisma/client'

export class SummaryService {
  static async getSummaryWallet (user: User): Promise<SummaryWalletResponse> {
    const wallets = await db.wallet.findMany({
      select: {
        id: true,
        name: true,
        balance: true
      },
      where: { userId: user.id }
    })

    if (wallets.length === 0) throw new ResponseError(400, 'User do not have any wallet')

    return toSummaryWalletResponse(wallets)
  }
}
