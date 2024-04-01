import { ResponseError } from '@/errors/response-error'
import {
  type CategoryRequest,
  groupCategoryByMasterCategory,
  toCategoryResponse
} from '@/models/category'
import { TypeTransaction } from '@/models/summary'
import { type AuthRequest } from '@/models/user'
import db from '@/utils/prisma'
import { CategoryValidation } from '@/validations/category'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'

export class CategoryService {
  static async getCategoriesByUser (user: User) {
    const categories = await db.category.findMany({
      where: { userId: user.id },
      include: {
        masterCategoryTransaction: true
      }
    })

    return groupCategoryByMasterCategory(categories)
  }

  static async create (user: User, req: CategoryRequest) {
    const validateReq = Validation.validate(
      CategoryValidation.CREATE_CATEGORY,
      req
    )

    const masterCategory = await db.masterCategoryTransaction.findFirst({
      where: { id: validateReq.masterCategoryTransactionId }
    })
    if (!masterCategory) { throw new ResponseError(400, 'Master category is not found') }

    const categoryBefore = await db.category.findFirst({
      where: { AND: { ...validateReq } }
    })
    if (categoryBefore) {
      throw new ResponseError(
        400,
        'Category name is already in use in the same master category'
      )
    }

    const category = await db.category.create({
      data: {
        name: validateReq.name,
        userId: user.id,
        masterCategoryTransactionId: req.masterCategoryTransactionId
      }
    })

    return toCategoryResponse(category)
  }

  static async update (request: AuthRequest) {
    const body = request.body as CategoryRequest
    const params = { id: Number(request.params.id) }
    const validateReq = Validation.validate(
      CategoryValidation.UPDATE_CATEGORY,
      body
    )

    const masterCategory = await db.masterCategoryTransaction.findFirst({
      where: { id: validateReq.masterCategoryTransactionId }
    })
    if (!masterCategory) { throw new ResponseError(400, 'Master category is not found') }

    const categoryBefore = await db.category.findFirst({
      where: {
        AND: {
          id: params.id,
          userId: request.user?.id
        }
      }
    })
    if (!categoryBefore) throw new ResponseError(400, 'Category is not found')

    const category = await db.category.update({
      where: { id: params.id },
      data: {
        name: validateReq.name
      }
    })

    return toCategoryResponse(category)
  }

  static async delete (user: User, id: number) {
    const category = await db.category.findFirst({
      where: {
        AND: { id, userId: user.id }
      }
    })

    if (!category) throw new ResponseError(400, 'Category is not found')

    const transactions = await db.transaction.findMany({
      where: { categoryId: category.id },
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
      where: { categoryId: category.id }
    })

    await db.subCategory.deleteMany({
      where: { categoryId: category.id }
    })

    await db.category.delete({ where: { id: category.id } })

    return 'Category has successfully deleted'
  }
}
