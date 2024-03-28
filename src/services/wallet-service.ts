import { ResponseError } from '@/errors/response-error'
import { type AuthRequest } from '@/models/user'
import type { WalletResponse, UpdateWalletBody } from '@/models/wallet'
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

  static async update (request: AuthRequest): Promise<WalletResponse> {
    const body = request.body as UpdateWalletBody
    const params = { id: Number(request.params.id) }
    const user = request.user as User

    const validateReq = Validation.validate(WalletValidation.UPDATE_WALLET, body)

    const wallet = await db.wallet.findFirst({
      where: { AND: { id: params.id, userId: user.id } }
    })

    if (!wallet) throw new ResponseError(400, 'The wallet is not exist')

    const walletAfter = await db.wallet.update({
      where: { id: params.id, userId: user.id },
      data: { ...validateReq }
    })

    if (walletAfter.balance < wallet.balance) {
      // adjust balance expense
      const categoryOtherExpense = await db.category.findFirst({
        where: {
          AND: {
            name: { contains: 'Other Expense' },
            userId: user.id
          }
        }
      })

      if (!categoryOtherExpense) throw new ResponseError(500, 'Other expense is not exist')

      await db.transaction.create({
        data: {
          amount: wallet.balance - walletAfter.balance,
          description: 'Penyesuaian saldo',
          date: new Date().toISOString(),
          categoryId: categoryOtherExpense.id,
          subCategoryId: null,
          walletId: walletAfter.id,
          userId: user.id
        }
      })
    } else if (walletAfter.balance > wallet.balance) {
      // adjust balance income
      const categoryOtherIncome = await db.category.findFirst({
        where: {
          AND: {
            name: { contains: 'Other Income' },
            userId: user.id
          }
        }
      })

      if (!categoryOtherIncome) throw new ResponseError(500, 'Other income is not exist')

      await db.transaction.create({
        data: {
          amount: walletAfter.balance - wallet.balance,
          description: 'Penyesuaian saldo',
          date: new Date().toISOString(),
          categoryId: categoryOtherIncome.id,
          subCategoryId: null,
          walletId: walletAfter.id,
          userId: user.id
        }
      })
    }

    return toWalletResponse(walletAfter)
  }
}
