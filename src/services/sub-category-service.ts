import { ResponseError } from '@/errors/response-error'
import { toSubCategoryResponse, type CreateSubCategoryRequest } from '@/models/sub-category'
import db from '@/utils/prisma'
import { SubCategoryValidation } from '@/validations/sub-category'
import { Validation } from '@/validations/validation'

export class SubCategoryService {
  static async create (req: CreateSubCategoryRequest) {
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
}
