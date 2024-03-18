import { ResponseError } from '@/errors/response-error'
import {
  toTransactionResponse,
  type TransactionWithRelation,
  type TransactionRequest,
  type TransactionResponse,
  type ParamsTransaction,
  toListTransactionResponse
} from '@/models/transaction'
import { type AuthRequest } from '@/models/user'
import db from '@/utils/prisma'
import { TransactionValidation } from '@/validations/transaction'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'

export class TransactionService {
  static async getAll (
    user: User,
    params: ParamsTransaction
  ): Promise<TransactionResponse[]> {
    const validateParams = Validation.validate(TransactionValidation.GET_ALL, params)

    const optionalParams = () => {
      const optional: Record<string, number> = {}
      if (validateParams.categoryId) optional.categoryId = validateParams.categoryId
      if (validateParams.walletId) optional.walletId = validateParams.walletId

      return optional
    }

    const transactions = await db.transaction.findMany({
      where: {
        AND: {
          userId: user.id,
          description: {
            contains: validateParams.keyword
          },
          date: {
            gte: validateParams.fromDate,
            lte: validateParams.toDate
          },
          amount: {
            gte: validateParams.fromAmount,
            lte: validateParams.toAmount
          },
          ...optionalParams()
        }
      },
      orderBy: { date: 'asc' },
      include: {
        wallet: true,
        category: {
          include: {
            masterCategoryTransaction: true
          }
        },
        subCategory: true
      }
    })

    return toListTransactionResponse(transactions as TransactionWithRelation[])
  }

  static async get (user: User, id: number): Promise<TransactionResponse> {
    const transaction = await db.transaction.findFirst({
      where: {
        AND: {
          id,
          userId: user.id
        }
      },
      include: {
        wallet: true,
        category: true,
        subCategory: true
      }
    })

    if (!transaction) throw new ResponseError(400, 'Transaction is not found')

    return toTransactionResponse(transaction as TransactionWithRelation)
  }

  static async create (
    user: User,
    req: TransactionRequest
  ): Promise<TransactionResponse> {
    const validateReq = Validation.validate(
      TransactionValidation.CREATE_TRANSACTION,
      req
    )

    const wallet = await db.wallet.findFirst({
      where: {
        AND: {
          id: validateReq.walletId,
          userId: user.id
        }
      }
    })

    if (!wallet) throw new ResponseError(400, 'Wallet is not found')

    const category = await db.category.findFirst({
      where: {
        AND: {
          id: validateReq.categoryId,
          userId: user.id
        }
      }
    })

    if (!category) throw new ResponseError(400, 'Category is not found')

    if (validateReq.subCategoryId) {
      const subCategory = await db.subCategory.findFirst({
        where: {
          AND: {
            id: validateReq.subCategoryId,
            categoryId: validateReq.categoryId
          }
        }
      })

      if (!subCategory) {
        throw new ResponseError(400, 'Sub category is not found')
      }
    }

    const transaction = await db.transaction.create({
      data: {
        amount: validateReq.amount,
        description: validateReq.description,
        date: validateReq.date,
        categoryId: validateReq.categoryId,
        subCategoryId: validateReq.subCategoryId || null,
        walletId: validateReq.walletId,
        userId: user.id
      }
    })

    await db.wallet.update({
      where: { id: transaction.walletId },
      data: {
        balance: {
          increment: validateReq.amount
        }
      }
    })

    const transactionAfter = await db.transaction.findFirst({
      where: { id: transaction.id },
      include: {
        wallet: true,
        category: true,
        subCategory: true
      }
    })

    return toTransactionResponse(transactionAfter as TransactionWithRelation)
  }

  static async update (request: AuthRequest): Promise<TransactionResponse> {
    const body = request.body as TransactionRequest
    const validateReq = Validation.validate(TransactionValidation.UPDATE_TRANSACTION, body)

    const user = request.user as User
    const id = Number(request.params.id)

    const transactionBefore = await db.transaction.findFirst({ where: { id } })
    if (!transactionBefore) throw new ResponseError(400, 'Transaction is not found')

    const wallet = await db.wallet.findFirst({
      where: {
        AND: {
          id: validateReq.walletId,
          userId: user.id
        }
      }
    })

    if (!wallet) throw new ResponseError(400, 'Wallet is not found')

    const category = await db.category.findFirst({
      where: {
        AND: {
          id: validateReq.categoryId,
          userId: user.id
        }
      }
    })

    if (!category) throw new ResponseError(400, 'Category is not found')

    if (validateReq.subCategoryId) {
      const subCategory = await db.subCategory.findFirst({
        where: {
          AND: {
            id: validateReq.subCategoryId,
            categoryId: validateReq.categoryId
          }
        }
      })

      if (!subCategory) {
        throw new ResponseError(400, 'Sub category is not found')
      }
    }

    const transaction = await db.transaction.update({
      where: { id },
      data: {
        amount: validateReq.amount,
        description: validateReq.description,
        date: validateReq.date,
        categoryId: validateReq.categoryId,
        subCategoryId: validateReq.subCategoryId || null,
        walletId: validateReq.walletId
      }
    })

    await db.wallet.update({
      where: { id: transaction.walletId },
      data: {
        balance: {
          increment: validateReq.amount - Number(transactionBefore.amount)
        }
      }
    })

    const transactionAfter = await db.transaction.findFirst({
      where: { id: transaction.id },
      include: {
        wallet: true,
        category: true,
        subCategory: true
      }
    })

    return toTransactionResponse(transactionAfter as TransactionWithRelation)
  }

  static async delete (user: User, id: number): Promise<string> {
    const transaction = await db.transaction.findFirst({
      where: { AND: { id, userId: user.id } }
    })

    if (!transaction) throw new ResponseError(400, 'Transaction is not found')

    await db.transaction.delete({
      where: { id: transaction.id }
    })

    await db.wallet.update({
      where: { id: transaction.walletId },
      data: {
        balance: {
          decrement: transaction.amount
        }
      }
    })

    return 'Transaction has successfully deleted'
  }
}
