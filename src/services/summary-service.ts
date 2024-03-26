import { ResponseError } from '@/errors/response-error'
import type { SummaryWalletResponse, ParamsSummaryTransaction, TransactionWithCategory, SummaryTransactionResponse } from '@/models/summary'
import { toSummaryWalletResponse, toSummaryTransactionResponse, TypeTransaction, toSummaryByCategoryTransactionResponse } from '@/models/summary'
import db from '@/utils/prisma'
import { SummaryValidation } from '@/validations/summary'
import { Validation } from '@/validations/validation'
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

  static async getSummaryTransaction (user: User, params: ParamsSummaryTransaction): Promise<SummaryTransactionResponse> {
    const validateParams = Validation.validate(SummaryValidation.GET_SUMMARY_TRANSACTION, params)

    const transactions = await db.transaction.findMany({
      select: {
        amount: true,
        category: true
      },
      where: {
        AND: {
          userId: user.id,
          date: {
            gte: validateParams.fromDate,
            lte: validateParams.toDate
          }
        }
      }
    })

    return toSummaryTransactionResponse(transactions as TransactionWithCategory[])
  }

  static async getSummaryExpense (user: User, params: ParamsSummaryTransaction) {
    const validateParams = Validation.validate(SummaryValidation.GET_SUMMARY_TRANSACTION, params)

    const transactions = await db.transaction.findMany({
      select: {
        amount: true,
        category: true
      },
      where: {
        AND: {
          userId: user.id,
          date: {
            gte: validateParams.fromDate,
            lte: validateParams.toDate
          },
          category: {
            masterCategoryTransactionId: TypeTransaction.EXPENSE
          }
        }
      }
    })

    return toSummaryByCategoryTransactionResponse(transactions as TransactionWithCategory[])
  }

  static async getSummaryIncome (user: User, params: ParamsSummaryTransaction) {
    const validateParams = Validation.validate(SummaryValidation.GET_SUMMARY_TRANSACTION, params)

    const transactions = await db.transaction.findMany({
      select: {
        amount: true,
        category: true
      },
      where: {
        AND: {
          userId: user.id,
          date: {
            gte: validateParams.fromDate,
            lte: validateParams.toDate
          },
          category: {
            masterCategoryTransactionId: TypeTransaction.INCOME
          }
        }
      }
    })

    return toSummaryByCategoryTransactionResponse(transactions as TransactionWithCategory[])
  }
}
