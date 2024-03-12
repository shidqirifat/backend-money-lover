import { ResponseError } from '@/errors/response-error'
import { toSubCategoryResponse, type SubCategoryRequest } from '@/models/sub-category'
import { type AuthRequest } from '@/models/user'
import db from '@/utils/prisma'
import { SubCategoryValidation } from '@/validations/sub-category'
import { Validation } from '@/validations/validation'
import { type User } from '@prisma/client'

export class SubCategoryService {
  static async create (req: SubCategoryRequest) {
    const validateReq = Validation.validate(SubCategoryValidation.CREATE_SUB_CATEGORY, req)

    const category = await db.category.findFirst({
      where: { id: validateReq.categoryId }
    })
    if (!category) throw new ResponseError(400, 'Category is not found')

    const subCategoryBefore = await db.subCategory.findFirst({
      where: {
        AND: [{ ...validateReq }
        ]
      }
    })

    if (subCategoryBefore) throw new ResponseError(400, 'Sub category name is already exist in the same category')

    const subCategory = await db.subCategory.create({
      data: { ...validateReq }
    })

    return toSubCategoryResponse(subCategory)
  }

  static async update (request: AuthRequest) {
    const body = request.body as SubCategoryRequest
    const params = { id: Number(request.params.id) }

    const validateReq = Validation.validate(SubCategoryValidation.UPDATE_SUB_CATEGORY, body)

    const subCategoryBefore = await db.subCategory.findFirst({
      where: { id: params.id }
    })

    if (!subCategoryBefore) throw new ResponseError(400, 'Sub category is not found')

    const subCategory = await db.subCategory.update({
      where: { id: params.id },
      data: { ...validateReq }
    })

    return toSubCategoryResponse(subCategory)
  }

  static async delete (user: User, id: number) {
    const subCategoryBefore = await db.subCategory.findFirst({
      where: { id }
    })
    if (!subCategoryBefore) throw new ResponseError(400, 'Sub category is not found')

    const isCategoryUser = await db.category.findFirst({
      where: { userId: user.id }
    })
    if (!isCategoryUser) throw new ResponseError(400, 'Sub category is not found')

    await db.subCategory.delete({ where: { id } })

    return 'Successfully delete sub category'
  }
}
