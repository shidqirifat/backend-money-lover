import { ResponseError } from '@/errors/response-error'
import {
  toSubCategoryResponse,
  type SubCategoryRequest
} from '@/models/sub-category'
import { TypeTransaction } from '@/models/summary'
import { type AuthRequest } from '@/models/user'
import db from '@/utils/prisma'
import { SubCategoryValidation } from '@/validations/sub-category'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'

export class SubCategoryService {
  static async getAll (user: User) {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        masterCategoryTransaction: {
          select: {
            id: true,
            name: true
          }
        },
        subCategories: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: { userId: user.id }
    })

    return categories
  }

  static async create (req: SubCategoryRequest) {
    const validateReq = Validation.validate(
      SubCategoryValidation.CREATE_SUB_CATEGORY,
      req
    )

    const category = await db.category.findFirst({
      where: { id: validateReq.categoryId }
    })
    if (!category) throw new ResponseError(400, 'Category is not found')

    const subCategoryBefore = await db.subCategory.findFirst({
      where: {
        AND: [{ ...validateReq }]
      }
    })

    if (subCategoryBefore) {
      throw new ResponseError(
        400,
        'Sub category name is already exist in the same category'
      )
    }

    const subCategory = await db.subCategory.create({
      data: { ...validateReq }
    })

    return toSubCategoryResponse(subCategory)
  }

  static async update (request: AuthRequest) {
    const body = request.body as SubCategoryRequest
    const params = { id: Number(request.params.id) }

    const validateReq = Validation.validate(
      SubCategoryValidation.UPDATE_SUB_CATEGORY,
      body
    )

    const subCategoryBefore = await db.subCategory.findFirst({
      where: { id: params.id }
    })

    if (!subCategoryBefore) {
      throw new ResponseError(400, 'Sub category is not found')
    }

    const subCategory = await db.subCategory.update({
      where: { id: params.id },
      data: { ...validateReq }
    })

    return toSubCategoryResponse(subCategory)
  }

  static async delete (user: User, id: number) {
    const subCategory = await db.subCategory.findFirst({
      where: { id }
    })
    if (!subCategory) {
      throw new ResponseError(400, 'Sub category is not found')
    }

    const isCategoryUser = await db.category.findFirst({
      where: { userId: user.id }
    })
    if (!isCategoryUser) {
      throw new ResponseError(400, 'Sub category is not found')
    }

    const transactions = await db.transaction.findMany({
      where: { subCategoryId: subCategory.id },
      include: { category: true }
    })

    const wallets: Array<{ id: number, decrement: number }> = []
    for (const transaction of transactions) {
      const index = wallets.findIndex(
        (wallet) => wallet.id === transaction.walletId
      )
      const amount = Number(transaction.amount)
      const { masterCategoryTransactionId } = transaction.category
      if (index === -1) {
        wallets.push({
          id: transaction.walletId,
          decrement:
            masterCategoryTransactionId === TypeTransaction.EXPENSE
              ? amount
              : 0 - amount
        })
      } else {
        switch (masterCategoryTransactionId) {
          case TypeTransaction.EXPENSE:
            wallets[index].decrement += amount
            break
          case TypeTransaction.INCOME:
            wallets[index].decrement -= amount
            break
          default:
            wallets[index].decrement += 0
        }
      }
    }

    for (const wallet of wallets) {
      await db.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { increment: wallet.decrement }
        }
      })
    }

    await db.transaction.deleteMany({
      where: { subCategoryId: subCategory.id }
    })

    await db.subCategory.deleteMany({
      where: { id: subCategory.id }
    })

    return 'Successfully delete sub category'
  }
}
