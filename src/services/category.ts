import { groupCategoryByMasterCategory } from '@/models/category'
import db from '@/utils/prisma'
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
}
