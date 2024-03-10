import { ResponseError } from '@/errors/response-error'
import { type CategoryRequest, groupCategoryByMasterCategory, toCategoryResponse } from '@/models/category'
import db from '@/utils/prisma'
import { CategoryValidation } from '@/validations/category'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'

export class CategoryService {
  static async getCategoriesByUser (user: User) {
    const categories = await db.category.findMany({
      where: {
        userId: user.id
      },
      include: {
        masterCategoryTransaction: true
      }
    })

    return groupCategoryByMasterCategory(categories)
  }

  static async create (user: User, req: CategoryRequest) {
    const validateReq = Validation.validate(CategoryValidation.CREATE_CATEGORY, req)

    const masterCategory = await db.masterCategoryTransaction.findFirst({
      where: { id: req.masterCategoryTransactionId }
    })
    if (!masterCategory) throw new ResponseError(400, 'Master category is not found')

    const categoryBefore = await db.category.findFirst({
      where: { ...validateReq }
    })
    if (categoryBefore) throw new ResponseError(400, 'Category name is already in use in the same master category')

    const category = await db.category.create({
      data: {
        name: validateReq.name,
        userId: user.id,
        masterCategoryTransactionId: req.masterCategoryTransactionId
      }
    })

    return toCategoryResponse(category)
  }
}
