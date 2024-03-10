import { type SubCategory } from '@prisma/client'

export type SubCategoryResponse = {
  id: number
  name: string
}

export type CreateSubCategoryRequest = {
  name: string
  categoryId: number
}

export const toSubCategoryResponse = (subCategory: SubCategory): SubCategoryResponse => {
  return {
    id: subCategory.id,
    name: subCategory.name
  }
}
