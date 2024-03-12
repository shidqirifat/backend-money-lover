import { PrismaClient } from '@prisma/client'
import { SEED_CATEGORIES_EXPENSE, SEED_SUB_CATEGORIES } from './data'

const prisma = new PrismaClient()

export async function seedSubCategory () {
  const user = await prisma.user.findFirst({
    where: { email: 'shidqi@example.com' }
  })

  if (!user) {
    console.log('Seed user not found')
    return
  }

  const subCategoriesBefore = await prisma.subCategory.count()

  if (subCategoriesBefore > 0) {
    console.log('seed subcategory already execute')
    return
  }

  const userCategories = await prisma.category.findMany({
    where: {
      user: { id: user.id }
    }
  })

  for (const category of userCategories) {
    if (!SEED_CATEGORIES_EXPENSE.includes(category.name)) continue
    if (!SEED_SUB_CATEGORIES[category.name]) continue

    await prisma.subCategory.createMany({
      data: SEED_SUB_CATEGORIES[category.name].map(subCategory => ({
        name: subCategory,
        categoryId: category.id
      }))
    })
  }

  console.log('Success run seed sub category')
}
