import { ResponseError } from '@/errors/response-error'
import { type CreateCategoryRequest, groupCategoryByMasterCategory, toCategoryResponse, type UpdateCategoryRequest } from '@/models/category'
import { type AuthRequest } from '@/models/user'
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

  static async create (user: User, req: CreateCategoryRequest) {
    const validateReq = Validation.validate(CategoryValidation.CREATE_CATEGORY, req)

    const masterCategory = await db.masterCategoryTransaction.findFirst({
      where: { id: validateReq.masterCategoryTransactionId }
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

  static async update (request: AuthRequest) {
    const body = request.body as UpdateCategoryRequest
    const params = { id: Number(request.params.id) }
    const validateReq = Validation.validate(CategoryValidation.UPDATE_CATEGORY, body)

    const masterCategory = await db.masterCategoryTransaction.findFirst({
      where: { id: validateReq.masterCategoryTransactionId }
    })
    if (!masterCategory) throw new ResponseError(400, 'Master category is not found')

    const categoryBefore = await db.category.findFirst({
      where: {
        id: params.id,
        userId: request.user?.id,
        masterCategoryTransactionId: validateReq.masterCategoryTransactionId
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
    const categoryBefore = await db.category.findFirst({
      where: {
        id,
        userId: user.id
      }
    })
    if (!categoryBefore) throw new ResponseError(400, 'Category is not found')

    await db.category.delete({ where: { id } })

    return 'Category has successfully deleted'
  }
}
