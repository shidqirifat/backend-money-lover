import { hashPassword } from '@/utils/hash'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function seedUser () {
  const user = await prisma.user.upsert({
    where: { email: 'shidqi@example.com' },
    update: {},
    create: {
      name: 'Shidqi Rifat Pangestu',
      email: 'shidqi@example.com',
      password: await hashPassword('Password123*')
    }
  })

  console.log('Success run seed user', user)
}
