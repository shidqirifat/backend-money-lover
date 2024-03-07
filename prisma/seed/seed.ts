import { PrismaClient } from '@prisma/client'
import { seedUser, seedMasterCategoryTransaction, seedCategory, seedSubCategory, seedWallet } from './'

const prisma = new PrismaClient()

async function main () {
  await seedUser()
  await seedMasterCategoryTransaction()
  await seedCategory()
  await seedSubCategory()
  await seedWallet()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
