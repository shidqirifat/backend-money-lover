import { PrismaClient } from '@prisma/client'
import { SEED_MASTER_CATEGORY_TRANSACTIONS } from './data'

const prisma = new PrismaClient()

export async function seedMasterCategoryTransaction (): Promise<void> {
  const count = await prisma.masterCategoryTransaction.count()

  if (count > 0) {
    console.log('seed master category transaction already executed')
    return
  }

  const masterCategoryTransactions = await prisma.masterCategoryTransaction.createMany({
    data: SEED_MASTER_CATEGORY_TRANSACTIONS
      .map(category => ({ name: category }))
  })

  console.log('Success run seed master category transaction', masterCategoryTransactions)
}
