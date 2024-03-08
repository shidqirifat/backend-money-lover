import { type MasterCategoryTransaction } from '@prisma/client'

export type MasterCategoryResponse = {
  id: number
  name: string
}

export const toMasterCategoryResponse = (
  masterCategory: MasterCategoryTransaction
): MasterCategoryResponse => {
  return {
    id: masterCategory.id,
    name: masterCategory.name
  }
}
