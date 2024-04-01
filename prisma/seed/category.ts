import { PrismaClient } from '@prisma/client'
import { SEED_CATEGORIES_EXPENSE, SEED_CATEGORIES_INCOME } from '@/utils/seed'

const prisma = new PrismaClient()

export async function seedCategory () {
  const user = await prisma.user.findFirst({
    where: { email: 'shidqi@example.com' }
  })

  if (!user) {
    console.log('Seed user not found')
    return
  }

  const categoryUser = await prisma.category.count({
    where: {
      user: { id: user.id }
    }
  })

  if (categoryUser > 0) {
    console.log('seed category already executed')
    return
  }

  const categories = await prisma.category.createMany({
    data: [
      ...SEED_CATEGORIES_EXPENSE.map(category => (
        {
          name: category,
          userId: user.id,
          masterCategoryTransactionId: 1
        })),
      ...SEED_CATEGORIES_INCOME.map(category => (
        {
          name: category,
          userId: user.id,
          masterCategoryTransactionId: 2
        }))
    ]
  })

  console.log('Success run seed category', categories)
}
