import { type MasterCategoryTransaction, type Category } from '@prisma/client'

export type CategoryResponse = {
  id: number
  name: string
}

export interface MasterCategoryAndCategory extends Category {
  masterCategoryTransaction: MasterCategoryTransaction | null
}

export type GroupCategoryByMasterCategory = Record<string, MasterCategoryAndCategory[]>

export const groupCategoryByMasterCategory = (categories: MasterCategoryAndCategory[]): GroupCategoryByMasterCategory => {
  const data: GroupCategoryByMasterCategory = {}

  for (const category of categories) {
    const name = category.masterCategoryTransaction?.name
    if (!name) continue

    if (!data[name]) data[name] = [category]
    else data[name].push(category)
  }

  return data
}

export const toCategoryResponse = (category: Category): CategoryResponse => {
  return {
    id: category.id,
    name: category.name
  }
}
