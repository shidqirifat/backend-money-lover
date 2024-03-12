import { ResponseError } from '@/errors/response-error'
import { toTransactionResponse, type TransactionWithRelation, type TransactionRequest, type TransactionResponse } from '@/models/transaction'
import db from '@/utils/prisma'
import { TransactionValidation } from '@/validations/transaction'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'

export class TransactionService {
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

  static async create (user: User, req: TransactionRequest): Promise<TransactionResponse> {
    const validateReq = Validation.validate(TransactionValidation.CREATE_TRANSACTION, req)

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

      if (!subCategory) throw new ResponseError(400, 'Sub category is not found')
    }

    const transaction = await db.transaction.create({
      data: {
        amount: validateReq.amount,
        description: validateReq.description,
        date: validateReq.date,
        categoryId: validateReq.categoryId,
        subCategoryId: validateReq.subCategoryId,
        walletId: validateReq.walletId,
        userId: user.id
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
}
