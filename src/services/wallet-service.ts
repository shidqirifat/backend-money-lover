import { ResponseError } from '@/errors/response-error'
import { type AuthRequest } from '@/models/user'
import type { WalletResponse, UpdateBalanceBody } from '@/models/wallet'
import { toWalletResponse } from '@/models/wallet'
import db from '@/utils/prisma'
import { Validation } from '@/validations/validation'
import { WalletValidation } from '@/validations/wallet'
import { type User } from '@prisma/client'

export class WalletService {
  static async getAll (user: User): Promise<WalletResponse[]> {
    const wallets = await db.wallet.findMany({
      where: { userId: user.id }
    })

    return wallets.map(wallet => toWalletResponse(wallet))
  }

  static async updateBalance (request: AuthRequest): Promise<WalletResponse> {
    const body = request.body as UpdateBalanceBody
    const params = { id: Number(request.params.id) }

    const validateReq = Validation.validate(WalletValidation.UPDATE_BALANCE, body)

    const wallet = await db.wallet.findFirst({
      where: { id: params.id, userId: request.user?.id }
    })

    if (!wallet) throw new ResponseError(400, 'The wallet is not exist')

    await db.wallet.update({
      where: { id: params.id, userId: request.user?.id },
      data: { balance: validateReq.balance }
    })

    return toWalletResponse(wallet)
  }
}
