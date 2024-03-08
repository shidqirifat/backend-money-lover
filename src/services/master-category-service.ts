import { toMasterCategoryResponse, type MasterCategoryResponse } from '@/models/master-category-transaction'
import db from '@/utils/prisma'

export class MasterCategoryService {
  static async getAll (): Promise<MasterCategoryResponse[]> {
    const masterCategories = await db.masterCategoryTransaction.findMany()

    return masterCategories.map(masterCategory => toMasterCategoryResponse(masterCategory))
  }
}
