import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedWallet () {
  const user = await prisma.user.findFirst({
    where: { email: 'shidqi@example.com' }
  })

  if (!user) {
    console.log('Seed user not found')
    return
  }

  const userWallet = await prisma.wallet.count({
    where: {
      user: { id: user.id }
    }
  })

  if (userWallet > 0) {
    console.log('seed wallet already executed')
    return
  }

  const wallet = await prisma.wallet.create({
    data: {
      name: 'Cash',
      balance: 50_000,
      userId: user.id
    }
  })

  console.log('Success run seed wallet', wallet)
}
